import { EntityManager, EntityRepository, Repository } from "typeorm";
import { TransferORM } from "./TransferORM";
import { Transfer } from "src/transfer/aggregate/Transfer";


@EntityRepository(TransferORM)
export class TransferRepo extends Repository<TransferORM> {
    private readonly tName = 'TB_TRANSFER';

  constructor(manager: EntityManager) {
        super(TransferORM, manager);
    }

   public async addTransfer(transfer: Transfer): Promise<TransferORM> {
        return await this.save(new TransferORM(transfer));
    }

    public async findTransfer(id : string): Promise<Transfer> {
        let ret =  await this.findOne({ where: { transferId: id } });
        return ret.toTransfer()
     
    }

    public async updateTransfer(obj: Transfer): Promise<void> {
        await this.update(obj.transferId, obj);
    }



    
}