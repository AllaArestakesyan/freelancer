import { ApiProperty,  } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto {

    @ApiProperty()
    description:string
}
