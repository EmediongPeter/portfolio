import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // 💡 See this condition
            console.log("🚀 ~ AccessTokenGuard ~", super.canActivate(context), isPublic)
            return true;
        }
        
        console.log("🚀 ~ AccessTokenGuard ~", super.canActivate(context),)
        return super.canActivate(context)
    }

}
