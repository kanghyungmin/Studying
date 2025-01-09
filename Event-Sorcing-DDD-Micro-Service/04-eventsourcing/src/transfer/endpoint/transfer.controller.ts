import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransferService } from '../service/transfer.service';
import { TransferMoney } from '../command/TransferMoney';
import { Transfer } from '../aggregate/Transfer';
import { QueryTransfer } from '../query/QueryTransfer';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async transferMoney(@Body() command: TransferMoney): Promise<string> {
    return this.transferService.transferMoney(command);
  }

  @Get(':transferId')
  async queryTransfer(@Param('transferId') transferId: string): Promise<Transfer> {
    const query = new QueryTransfer(transferId);
    return this.transferService.queryTransfer(query);
  }
}
