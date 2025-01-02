// account.controller.ts
import { Controller, Post, Get, Put, Param, Body, Headers } from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { Account } from '../aggregate/Account';
import { CreateAccount } from '../command/CreateAccount';
import { QueryAccount } from '../query/QueryAccount';
import { Withdraw } from '../command/Withdraw';
import { Deposit } from '../command/Deposit';


@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // Create Account
  @Post()
  async createAccount(@Body() command: CreateAccount): Promise<string> {
    return await this.accountService.createAccount(command);
  }

  // Query Account
  @Get(':no')
  async queryAccount(@Param('no') no: string): Promise<Account> {
    const query = new QueryAccount(no);
    return await this.accountService.queryAccount(query);
  }

  // Deposit
  @Put(':no')
  handleTransaction(
    @Param('no') no: string,
    @Body() command: Deposit | Withdraw,
    @Headers('command') commandHeader: string,
  ): void {
    if (commandHeader === 'Deposit') {
      if (command instanceof Deposit) {
        command.setNo(no);
        this.accountService.deposit(command);
      }
    } else if (commandHeader === 'Withdraw') {
      if (command instanceof Withdraw) {
        command.setNo(no);
        this.accountService.withdraw(command);
      }
    } else {
      throw new Error('Invalid command');
    }
  }
}