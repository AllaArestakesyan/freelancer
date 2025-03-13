import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/role/role.enum';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags("Customer*")
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ description: "վերադարձնում է բոլոր այն մարդկանց տվյալները, ովքեր գրանցվել են որպես customer " })
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.customerService.findAll();
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @ApiResponse({ description: "վերադարձնում է customer-ի տվյալը ըստ իր id-ի" })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.customerService.findOne(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CUSTOMER)
  @ApiResponse({description:"հնարավորություն է տալիս customer-ի տվյալներ թարմացնել->description "})
  @Patch(':id')
  async update(@Param('id') id: string, @Res() res: Response, @Body() updateCustomerDto: UpdateCustomerDto) {
    try {
      const data = await this.customerService.update(+id, updateCustomerDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ error: e.message })
    }
  }


  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiResponse({ description: "հնարավորություն է տալիս ջնջել customer-ի տվյալները" })
  // @Delete(':id')
  // async remove(@Param('id') id: string, @Res() res: Response) {
  //   try {
  //     const data = await this.customerService.remove(+id);
  //     return res.status(HttpStatus.OK).json(data)
  //   } catch (e) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
  //   }
  // }
}
