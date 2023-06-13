import {Injectable, Logger, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import {AuthService} from "./auth/auth.service";

interface AuthenticatedRequest extends Request {
    user: any; // Define the 'user' property according to your user model
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly jwtService: JwtService) {}

    use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        this.logger.debug(`middleware -> accessing ${req.path}`);

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            this.logger.debug(`middleware -> no token.`);
            throw new UnauthorizedException('Authentication token not found');
        }

        try {
            const decoded = this.jwtService.verify(token);
            this.logger.debug(`middleware -> token verified.`);
            req.user = decoded;
            next();
        } catch (err) {
            this.logger.debug(`middleware -> invalid token.`);
            throw new UnauthorizedException('Invalid authentication token');
        }
    }
}
