import { ApiProperty } from "@nestjs/swagger";

export class CreateJobUserDto {
    @ApiProperty()
    jobId: number
}
