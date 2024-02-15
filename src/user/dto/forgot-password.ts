import { ApiProperty } from "@nestjs/swagger"

export class ForgotPassword {
    @ApiProperty()
    email: string
   
  }

  