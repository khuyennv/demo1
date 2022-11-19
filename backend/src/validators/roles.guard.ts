import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const roles = this.reflector.get<string[]>("roles", context.getHandler());

        const role = (request.headers["x-fjob-role"])
            ? request.headers["x-fjob-role"] as string
            : null;

        const userId = (request.headers["x-fjob-user-id"])
            ? request.headers["x-fjob-user-id"] as number
            : null;

        const userCode = (request.headers["x-fjob-user-code"])
            ? request.headers["x-fjob-user-code"] as string
            : null;

        if (roles) {
            if (!userId || !userCode || !roles.includes(role)) {
                return false
            }
            return true
        }

        return true;
    }
}
