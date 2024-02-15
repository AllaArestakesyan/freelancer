import { ApiProperty } from "@nestjs/swagger"

export class ResetPassword {
    @ApiProperty()
    code: number
   
    @ApiProperty()
    password: string
   
    @ApiProperty()
    confirm_password: string
   
  }