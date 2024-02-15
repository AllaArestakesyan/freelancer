import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateJobUserDto } from './create-job-user.dto';

export class UpdateJobUserDto extends PartialType(CreateJobUserDto) {}

export class UpdateDone {
    @ApiProperty()
    num:number
}