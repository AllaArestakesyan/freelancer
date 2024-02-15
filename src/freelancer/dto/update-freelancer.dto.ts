import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFreelancerDto } from './create-freelancer.dto';

export class UpdateFreelancerDto extends PartialType(CreateFreelancerDto) {
    @ApiProperty()
    salary: number

    @ApiProperty()
    profession: string
}
