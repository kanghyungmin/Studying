import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransferService } from '../service/TransferService';
import { QueryTransfer } from '../query/QueryTransfer';
import { TransferMoney } from '../command/TransferMoney';
import { Transfer } from '../aggregate/Transfer';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async transfer(@Body() command: TransferMoney): Promise<string> {
    console.log("0")
    return await this.transferService.transfer(command);
  }

  @Get(':transferId')
  async queryTransfer(@Param('transferId') transferId: string): Promise<Transfer> {
    
    const query = new QueryTransfer(transferId);
    return this.transferService.query(query);
  }
}
