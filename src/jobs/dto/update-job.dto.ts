import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto {
    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    price: number
}

export class UpdateJobStatus {
    @ApiProperty()
    status:number
}