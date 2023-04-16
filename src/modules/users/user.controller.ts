import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Version,
  Logger,
  Get,
  Param,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';

import BaseController from '../../libs/controller.base';
import { UserService } from './user.service';
import { RequiredPermissions } from '../../libs/permission.decorator';
import { Permission } from '../../constants/enum.permission';
import { V100, X_CORRELATION_ID } from '../../constants/constant.header';

import { AddUserDto } from './dto/add-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController extends BaseController {

  constructor(private readonly userService: UserService) {
    super(UserController.name);
  }

  @Version(V100)
  @RequiredPermissions(Permission.ADMIN)
  @Post()
  async add(@Req() request, @Res() response, @Body() addUserDto: AddUserDto) {
    this.printRequestDetail(request, {}, addUserDto);
    const result = await this.userService.add(addUserDto);
    return this.response.generate(request, response, result);
  }

  @Version(V100)
  @RequiredPermissions(Permission.ADMIN)
  @Post('filter')
  async filter(
    @Req() request,
    @Res() response,
    @Body() filterUserDto: FilterUserDto,
  ) {
    this.printRequestDetail(request, {}, filterUserDto);
    const result = await this.userService.filter(filterUserDto);
    return this.response.generate(request, response, result);
  }

  @Version(V100)
  @RequiredPermissions(Permission.ADMIN, Permission.SELF)
  @Get(':id')
  async get(
    @Req() request,
    @Res() response,
    @Param(new ValidationPipe({ transform: true })) params: GetUserDto,
  ) {
    this.printRequestDetail(request, params, {});
    const result = await this.userService.get(params.id);
    return this.response.generate(request, response, result);
  }

  @Version(V100)
  @RequiredPermissions(Permission.ADMIN)
  @Patch(':id')
  async update(
    @Req() request,
    @Res() response,
    @Param(new ValidationPipe({ transform: true })) params: GetUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.printRequestDetail(request, params, updateUserDto);
    const result = await this.userService.update(params.id, updateUserDto);
    return this.response.generate(request, response, result);
  }

  @Version(V100)
  @RequiredPermissions(Permission.ADMIN)
  @Delete(':id')
  async delete(
    @Req() request,
    @Res() response,
    @Param(new ValidationPipe({ transform: true })) params: GetUserDto,
  ) {
    this.printRequestDetail(request, params, {});
    const result = await this.userService.delete(params.id);
    return this.response.generate(request, response, result);
  }
}
