import { AccountViewStore } from './../view/store/AccountViewStore';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Headers,
} from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { OpenAccount } from '../command/OpenAccount';
import { Account } from '../aggregate/Account';
import { QueryAccount } from '../query/QueryAccount';
import { Deposit } from '../command/Deposit';
import { Withdraw } from '../command/Withdraw';
import { CloseAccount } from '../command/CloseAccount';


@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountViewStore : AccountViewStore
  ) {}

  @Post()
  async openAccount(@Body() command: OpenAccount): Promise<string> {
    return await this.accountService.openAccount(command);
  }

  @Get(':accountNo')
  async queryAccount(@Param('accountNo') accountNo: string): Promise<Account> {
    const query = new QueryAccount(accountNo);
    return await this.accountService.queryAccount(query);
  }

  @Put(':accountNo')
  async deposit(
    @Param('accountNo') accountNo: string,
    @Body() command: Deposit,
    @Headers('command') commandType: string,
  ): Promise<void> {
    if (commandType === 'Deposit') {
      command.setNo(accountNo);
      await this.accountService.deposit(command);
    }
  }

  @Put(':accountNo')
  async withdraw(
    @Param('accountNo') accountNo: string,
    @Body() command: Withdraw,
    @Headers('command') commandType: string,
  ): Promise<void> {
    if (commandType === 'Withdraw') {
      command.setNo(accountNo);
      await this.accountService.withdraw(command);
    }
  }

  @Delete(':accountNo')
  async close(@Param('accountNo') accountNo: string): Promise<void> {
    const command = new CloseAccount(accountNo);
    await this.accountService.close(command);
  }
}