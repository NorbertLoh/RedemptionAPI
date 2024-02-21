import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RedemptionService } from './redemption.service';
import { CreateRedemptionDto } from './dto/create-redemption.dto';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @Post()
  create(@Body() createRedemptionDto: CreateRedemptionDto) {
    return this.redemptionService.create(createRedemptionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.redemptionService.findOne(+id);
  }
}
