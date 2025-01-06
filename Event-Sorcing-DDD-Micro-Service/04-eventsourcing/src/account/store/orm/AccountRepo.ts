import { Repository, EntityManager, SelectQueryBuilder, InsertResult, EntityRepository } from 'typeorm';
import { AccountORM } from './AccoutOrm';

@EntityRepository(AccountORM)
export class AccountRepo extends Repository<AccountORM> {
    private readonly userAlias = 'TB_ACCOUNT';
  
    constructor(manager: EntityManager) {
      super(AccountORM, manager);
    }
  
    private buildUserQueryBuilder(): SelectQueryBuilder<AccountORM> {
      return this.createQueryBuilder(this.userAlias).select();
    }
  
    private extendQueryWithByProperties(
      by: { no : string;},
      query: SelectQueryBuilder<AccountORM>
    ): void {
      if (by.no) {
        query.andWhere(`${this.userAlias}.no = :no`, { no: by.no });
      }
      
    }
  
    public async findUser(by: { no: string;  }): Promise<AccountORM> {
      const query = this.buildUserQueryBuilder();
      this.extendQueryWithByProperties(by, query);
  
      const ormEntity = await query.getOne();
      return ormEntity;
    }
  
    public async addUser(ormUser: AccountORM): Promise<{ no: string }> {
  
      const insertResult: InsertResult = await this.createQueryBuilder()
        .insert()
        .into(AccountORM)
        .values([ormUser])
        .execute();
  
        
      return { no: insertResult.identifiers[0].no };
    }

    public async updateUser(user: AccountORM): Promise<void> {
      await this.update(user.no, user);
    }
  }
  