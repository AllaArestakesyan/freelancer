import { ApiProperty } from "@nestjs/swagger"

export class CreateJobDto {
    @ApiProperty()
    title: string
    @ApiProperty()
    description: string
    @ApiProperty()
    price: number

    @ApiProperty()
    skills: number[]


}
