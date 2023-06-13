import {Controller, Post, Body, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'User Signup' })
    @ApiResponse({ status: 201, description: 'User successfully signed up' })
    @Post('signup')
    async signup(@Body() userDto: UserDto): Promise<void> {
        const { username, password } = userDto;
        await this.authService.signup(username, password);
    }

    @ApiOperation({ summary: 'User Login' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @Post('login')
    async login(@Body() createUserDto: UserDto): Promise<{ accessToken: string }> {
        const { username, password } = createUserDto;
        return this.authService.login(username, password);
    }

    @ApiOperation({ summary: 'App pulse' })
    @ApiResponse({ status: 200, description: 'Check that app is up' })
    @Get('pulse')
    async pulse() {
        return "We have pulse!";
    }
}
