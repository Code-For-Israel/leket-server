import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {PrismaService} from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async signup(username: string, password: string): Promise<void> {
        // Check if a user with the provided username already exists
        const existingUser = await this.prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            throw new UnauthorizedException('User with this username already exists');
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user in the database
        await this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
    }

    async checkDb() {
        const fields = await this.prisma.field.findMany();
        return fields.length;
    }

    async login(username: string, password: string): Promise<{ accessToken: string }> {
        // Find the user with the provided username
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        // Compare the provided password with the stored password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const payload = { user };
        const secret = process.env.JWT_SECRET;
        const accessToken = this.jwtService.sign(payload, { secret });

        return { accessToken };
    }

    async validateUser(userId: number): Promise<any> {
        // Find the user with the provided ID
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
