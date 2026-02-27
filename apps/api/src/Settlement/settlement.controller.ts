import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto, EditSettlementDto } from './settlement.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('settlement')
export class SettlementController {
    constructor(private readonly settlementService: SettlementService) {}

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.settlementService.findOne(id);
    }

    @Post()
    async create(@Body() createSettlementDto: CreateSettlementDto) {
        return await this.settlementService.create(createSettlementDto);
    }

    @Put(':id')
    async edit(@Param('id') id: string, @Body() editSettlementDto: EditSettlementDto) {
        return await this.settlementService.edit({ ...editSettlementDto, id });
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.settlementService.delete(id);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return await this.settlementService.findByUser(userId);
    }

}