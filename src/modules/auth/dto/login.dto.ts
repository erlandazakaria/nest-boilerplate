import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username cannot be empty.' })
  @IsString({ message: 'Invalid username format.' })
  username: string;

  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @IsString({ message: 'Invalid password format.' })
  @Length(8, 20, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
