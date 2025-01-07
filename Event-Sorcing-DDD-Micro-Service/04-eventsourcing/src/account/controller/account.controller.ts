// account.controller.ts
import { Controller, Post, Get, Put, Param, Body, Headers } from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { Account } from '../aggregate/Account';
import { CreateAccount } from '../command/OpenAccount';
import { QueryAccount } from '../query/QueryAccount';
import { Withdraw } from '../command/Withdraw';
import { Deposit } from '../command/Deposit';
import { plainToInstance } from 'class-transformer';


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
  async handleTransaction(
    @Param('no') no: string,
    @Body() command: Deposit | Withdraw,
    @Headers('command') commandHeader: string,
  ): Promise<void> {
    if (commandHeader === 'Deposit') {
        let deposit = plainToInstance(Deposit, command);
        
        await this.accountService.deposit(deposit);
    } else if (commandHeader === 'Withdraw') {
        await this.accountService.withdraw(command as Withdraw);
    } else {
      throw new Error('Invalid command');
    }
  }
}