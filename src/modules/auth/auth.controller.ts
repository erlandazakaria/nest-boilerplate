import {
  Controller,
  Post,
  Body,
  Res,
  Version,
  Logger,
  Req,
} from '@nestjs/common';

import BaseController from '../../libs/controller.base';
import { AuthService } from './auth.service';
import { RequiredPermissions } from '../../libs/permission.decorator';
import { Permission } from '../../constants/enum.permission';
import { V100, X_CORRELATION_ID } from '../../constants/constant.header';

import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController extends BaseController {

  constructor(private readonly authService: AuthService) {
    super(AuthController.name);
  }

  @Version(V100)
  @Post('register')
  async register(
    @Req() request,
    @Res() response,
    @Body() registerDto: RegisterDto,
  ) {
    this.printRequestDetail(request, {}, registerDto);
    const result = await this.authService.register(registerDto);
    return this.response.generate(request, response, result);
  }

  @Version(V100)
  @Post('login')
  async login(@Req() request, @Res() response, @Body() loginDto: LoginDto) {
    this.printRequestDetail(request, {}, loginDto);
    const result = await this.authService.login(loginDto);
    return this.response.generate(request, response, result);
  }

  @Version(V100)
  @RequiredPermissions(Permission.ADMIN, Permission.SELF)
  @Post('change-password')
  async changePassword(
    @Req() request,
    @Res() response,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    this.printRequestDetail(request, {}, changePasswordDto);
    const result = await this.authService.changePassword(changePasswordDto);
    return this.response.generate(request, response, result);
  }
}
