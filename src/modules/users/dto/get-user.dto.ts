import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty({ message: 'Id cannot be empty.' })
  @IsString({ message: 'Invalid id format.' })
  id: string;
}
