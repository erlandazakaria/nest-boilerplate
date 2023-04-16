import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import BaseService from '../../libs/service.base';
import { User, UserDocument } from '../../models/user.model';
import { Role } from '../../constants/enum.role';

import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService extends BaseService {
  private readonly logger = new Logger(AuthService.name);
  private INTERNAL_SERVER_ERROR = 'Internal Server Error';
  private ERROR_OCCURED = 'Error Occured';
  private USERNAME_ALREADY_EXIST = 'Username Already Exist';
  private REGISTERED_SUCCESSFULLY = 'Registered Successfully';
  private WRONG_PASSWORD = 'Wrong Password';
  private USERNAME_NOT_REGISTERED = 'Username is not registered';
  private PASSWORD_CHANGED = 'Password changed successfully';
  private WRONG_OLD_PASSWORD = 'Wrong Old Password';

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async register(registerDto: RegisterDto) {
    try {
      const findDuplicate = await this.userModel
        .findOne({ username: registerDto.username })
        .select('_id')
        .lean();

      if (findDuplicate) {
        this.logger.error(this.USERNAME_ALREADY_EXIST);
        return this.response.error(
          HttpStatus.BAD_REQUEST,
          this.USERNAME_ALREADY_EXIST,
        );
      }

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(registerDto.password, salt);

      // Add all from DTO
      const newUser = new this.userModel();
      Object.keys(registerDto).forEach((key) => {
        newUser[key] = registerDto[key];
      });

      // Custom Field
      newUser.password = hash;
      newUser.role = Role.User;

      await newUser.save();
      return this.response.success(this.REGISTERED_SUCCESSFULLY);
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const result = await this.userModel
        .findOne({ username: loginDto.username, isActive: true })
        .exec();
      if (result) {
        const { password } = result;
        if (await bcrypt.compare(loginDto.password, password)) {
          const payload = {
            _id: result.id,
            name: result.name,
            username: result.username,
            role: result.role,
          };
          return this.response.successWithData({
            token: this.jwtService.sign(payload),
          });
        }
        this.logger.error(this.WRONG_PASSWORD);
        return this.response.error(HttpStatus.BAD_GATEWAY, this.WRONG_PASSWORD);
      }

      this.logger.error(this.USERNAME_NOT_REGISTERED);
      return this.response.error(
        HttpStatus.BAD_GATEWAY,
        this.USERNAME_NOT_REGISTERED,
      );
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    try {
      const result = await this.userModel
        .findOne({ _id: changePasswordDto.id, isActive: true })
        .exec();
      if (result) {
        const { password } = result;
        if (await bcrypt.compare(changePasswordDto.oldPassword, password)) {
          const salt = await bcrypt.genSalt();
          const newPassword = await bcrypt.hash(
            changePasswordDto.newPassword,
            salt,
          );
          await this.userModel.findByIdAndUpdate(changePasswordDto.id, {
            password: newPassword,
          });
          return this.response.success(this.PASSWORD_CHANGED);
        }

        this.logger.error(this.WRONG_OLD_PASSWORD);
        return this.response.error(
          HttpStatus.BAD_GATEWAY,
          this.WRONG_OLD_PASSWORD,
        );
      }

      this.logger.error(this.ERROR_OCCURED);
      return this.response.error(HttpStatus.BAD_GATEWAY, this.ERROR_OCCURED);
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserRole(id: string) {
    try {
      const result = await this.userModel
        .findById(id)
        .select(['_id', 'role'])
        .lean();
      return result;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
