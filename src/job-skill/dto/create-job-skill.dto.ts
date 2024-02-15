import { ApiProperty } from "@nestjs/swagger";

export class CreateJobSkillDto {
    @ApiProperty()
    skillId: number
    @ApiProperty()
    jobId: number
}
