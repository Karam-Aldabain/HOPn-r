import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  async login(email: string, password: string) {
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

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const existing = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!existing || existing.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    const user = await this.usersService.findById(existing.userId);
    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    await this.prisma.refreshToken.deleteMany({ where: { id: existing.id } });
    return this.issueTokens(user.id, user.email, user.role, user.name);
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.deleteMany({ where: { tokenHash } });
    return { ok: true };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { ok: true };
    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });
    // TODO: send email via SMTP provider. For now, log the token.
    // eslint-disable-next-line no-console
    console.log(`[Auth] Password reset token for ${email}: ${token}`);
    return { ok: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashToken(token);
    const record = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid reset token");
    }
    await this.usersService.setPassword(record.userId, newPassword);
    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
    return { ok: true };
  }

  async me(userId: number) {
    return this.usersService.findById(userId);
  }

  private async issueTokens(id: number, email: string, role: string, name: string) {
    const payload = { sub: id, email, role, name };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = randomBytes(48).toString("hex");
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    await this.prisma.refreshToken.create({
      data: { userId: id, tokenHash, expiresAt },
    });
    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }
}
