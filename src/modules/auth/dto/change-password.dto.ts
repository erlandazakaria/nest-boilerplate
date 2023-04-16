import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Id cannot be empty.' })
  @IsString({ message: 'Invalid id format.' })
  id: string;

  @IsNotEmpty({ message: 'Old Password cannot be empty.' })
  @IsString({ message: 'Invalid old password format.' })
  @Length(8, 20, {
    message: 'Old Password must be at least 8 characters long.',
  })
  oldPassword: string;

  @IsNotEmpty({ message: 'New Password cannot be empty.' })
  @IsString({ message: 'Invalid new password format.' })
  @Length(8, 20, {
    message: 'New Password must be at least 8 characters long.',
  })
  newPassword: string;
}
