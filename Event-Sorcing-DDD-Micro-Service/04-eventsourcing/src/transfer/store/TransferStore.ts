import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from '../aggregate/Transfer';
import { TransferORM } from './orm/TransferORM';
import { TransferRepo } from './orm/TransferRepo';


@Injectable()
export class TransferStore {
  constructor(
    private readonly transferRepository: TransferRepo,
  ) {}

  async create(transfer: Transfer): Promise<void> {
    const transferEntity = new TransferORM(transfer);
    await this.transferRepository.save(transferEntity);
  }

  async retrieve(transferId: string): Promise<Transfer> {
    const transferEntity = await this.transferRepository.findOne({ where: { transferId: transferId } });
    if (!transferEntity) {
      throw new NotFoundException('Transfer not found');
    }
    return transferEntity.toTransfer();
  }

  async update(transfer: Transfer): Promise<void> {
    const transferEntity = new TransferORM(transfer);
    await this.transferRepository.save(transferEntity);
  }
}
