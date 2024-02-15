import { ApiProperty } from "@nestjs/swagger";

export class CreateFeedbackDto {
    @ApiProperty()
    rate:number
    @ApiProperty()
    text:string
    

}