import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
  name: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);
