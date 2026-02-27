import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, EditExpenseDto } from './expense.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  //all expenses for a group
  @Get('group/:groupId')
  async findByGroup(@Param('groupId') groupId: string) {
    return this.expenseService.findByGroup(groupId);
  }

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    console.log('Incoming /expense body', createExpenseDto);
    return this.expenseService.create(createExpenseDto);
  }

  @Put(':id')
  async edit(@Param('id') id: string, @Body() editExpenseDto: EditExpenseDto) {
    return this.expenseService.edit({...editExpenseDto, id});
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.expenseService.delete(id);
  }   

}