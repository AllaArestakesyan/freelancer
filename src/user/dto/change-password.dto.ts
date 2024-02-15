import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  id:number
  @ApiProperty()
  currentPassword: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  confirmationPassword: string;
}