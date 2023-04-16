import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import BaseService from '../../libs/service.base';
import { User, UserDocument } from '../../models/user.model';

import { AddUserDto } from './dto/add-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends BaseService {
  private readonly logger = new Logger(UserService.name);
  private INTERNAL_SERVER_ERROR = 'Internal Server Error';
  private USERNAME_ALREADY_EXIST = 'Username Already Exist';
  private ADDED_SUCCESSFULLY = 'User Added Successfully';
  private DATA_UPDATED = 'Data Updated Successfully';
  private DATA_DELETED = 'Data Deleted Successfully';

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async add(addUserDto: AddUserDto) {
    try {
      const findDuplicate = await this.userModel
        .findOne({ username: addUserDto.username })
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
      const hash = await bcrypt.hash(addUserDto.password, salt);

      // Add all from DTO
      const newUser = new this.userModel();
      Object.keys(addUserDto).forEach((key) => {
        newUser[key] = addUserDto[key];
      });

      // Custom Fields
      newUser.password = hash;

      await newUser.save();
      return this.response.success(this.ADDED_SUCCESSFULLY);
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async filter(filterUserDto: FilterUserDto) {
    try {
      const limit = filterUserDto.limit ?? 10;
      const page = filterUserDto.page ?? 1;
      const condition: any = {};
      const sort: any = {};

      // FILTER BY FIELDS
      if (filterUserDto.name) {
        condition.name = { $regex: filterUserDto.name, $options: 'i' };
      }

      // SORTING
      if (filterUserDto.sortAsc) {
        filterUserDto.sortAsc.split(',').forEach((sortAsc) => {
          sort[sortAsc] = 1;
        });
      }

      if (filterUserDto.sortDesc) {
        filterUserDto.sortDesc.split(',').forEach((sortDesc) => {
          sort[sortDesc] = -1;
        });
      }

      // COUNT DATA
      const totalData = await this.userModel.find(condition).count().exec();

      const result = await this.userModel
        .find(condition)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      return result
        ? this.response.successWithData(
            {
              limit,
              page,
              totalData,
              totalPage: Math.ceil(totalData / limit),
              data: result,
            },
            this.DATA_UPDATED,
          )
        : this.response.badRequest();
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async get(id: string) {
    try {
      const result = await this.userModel.findById(id).exec();
      return result
        ? this.response.successWithData(result)
        : this.response.badRequest();
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const newUser = new UpdateUserDto();

      // Add all from DTO
      Object.keys(updateUserDto).forEach((key) => {
        newUser[key] = updateUserDto[key];
      });

      // Customer Fields

      const result = await this.userModel.updateOne({ _id: id }, newUser);
      return result.modifiedCount > 0
        ? this.response.success(this.DATA_UPDATED)
        : this.response.badRequest();
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string) {
    try {
      const result = await this.userModel.updateOne(
        { _id: id },
        { isActive: false },
      );

      return result.modifiedCount > 0
        ? this.response.success(this.DATA_DELETED)
        : this.response.badRequest();
    } catch (err) {
      this.logger.error(err);
      return this.response.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
