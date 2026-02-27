// ExpenseSplit controller
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ExpenseSplitService } from './expensesplit.service';
import { CreateExpenseSplitDto, EditExpenseSplitDto } from './expensesplit.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('expensesplit')
export class ExpenseSplitController {
  constructor(private readonly expenseSplitService: ExpenseSplitService) {}

  @Get()
  async getExpenseSplits(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    if (userId) {
      return this.expenseSplitService.findByUser(userId, status);
    }

    return this.expenseSplitService.list({ userId, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseSplitService.findOne(id);
  }

  @Post()
  async create(@Body() createExpenseSplitDto: CreateExpenseSplitDto) {
    return this.expenseSplitService.create(createExpenseSplitDto);
  }

  @Put(':id')
  async edit(@Param('id') id: string, @Body() editExpenseSplitDto: EditExpenseSplitDto) {
    return this.expenseSplitService.edit({ ...editExpenseSplitDto, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.expenseSplitService.delete(id);
  }
}
