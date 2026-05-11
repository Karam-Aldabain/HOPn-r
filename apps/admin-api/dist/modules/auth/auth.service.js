"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../../common/mail/mail.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    mail;
    constructor(usersService, jwtService, prisma, mail) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.mail = mail;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        return user;
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        await this.usersService.touchLastLogin(user.id);
        const tokens = await this.issueTokens(user.id, user.email, user.role, user.name);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
        };
    }
    async refresh(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        const existing = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
        if (!existing || existing.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        const user = await this.usersService.findById(existing.userId);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        await this.prisma.refreshToken.deleteMany({ where: { id: existing.id } });
        return this.issueTokens(user.id, user.email, user.role, user.name);
    }
    async logout(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        await this.prisma.refreshToken.deleteMany({ where: { tokenHash } });
        return { ok: true };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        // Return ok:true even if user not found — avoids leaking which emails exist
        if (!user)
            return { ok: true };
        const token = (0, crypto_1.randomBytes)(32).toString("hex");
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, tokenHash, expiresAt },
        });
        // Build the reset URL. APP_URL should be set to the frontend origin,
        // e.g. https://hopn.eu  The admin reset page lives at /admin/reset.
        const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
        const resetUrl = `${appUrl}/admin/reset?token=${token}`;
        const sent = await this.mail.sendMail({
            to: user.email,
            subject: "HOPn — Password Reset",
            text: [
                `Hi ${user.name},`,
                "",
                "You requested a password reset. Click the link below to set a new password.",
                "The link expires in 1 hour.",
                "",
                resetUrl,
                "",
                "If you did not request this, you can safely ignore this email.",
            ].join("\n"),
        });
        if (!sent) {
            // SMTP not configured yet — fall back to logging so local dev still works
            // eslint-disable-next-line no-console
            console.warn(`[Auth] SMTP not configured. Reset token for ${email}: ${token}`);
        }
        return { ok: true };
    }
    async resetPassword(token, newPassword) {
        const tokenHash = this.hashToken(token);
        const record = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
        if (!record || record.usedAt || record.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException("Invalid reset token");
        }
        await this.usersService.setPassword(record.userId, newPassword);
        await this.prisma.passwordResetToken.update({
            where: { id: record.id },
            data: { usedAt: new Date() },
        });
        return { ok: true };
    }
    async me(userId) {
        return this.usersService.findById(userId);
    }
    async issueTokens(id, email, role, name) {
        const payload = { sub: id, email, role, name };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = (0, crypto_1.randomBytes)(48).toString("hex");
        const tokenHash = this.hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
        await this.prisma.refreshToken.create({
            data: { userId: id, tokenHash, expiresAt },
        });
        return { accessToken, refreshToken };
    }
    hashToken(token) {
        return (0, crypto_1.createHash)("sha256").update(token).digest("hex");
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map