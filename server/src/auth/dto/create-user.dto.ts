import { IsEmail, IsString, Length, Matches } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  @Length(6)
  fullName: string;
  @IsString()
  @Length(/*MIN*/ 8, /*MAX*/ 50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
