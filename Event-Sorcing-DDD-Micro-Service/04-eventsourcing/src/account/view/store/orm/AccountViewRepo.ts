import { Repository, EntityManager, SelectQueryBuilder, InsertResult, EntityRepository } from 'typeorm';
import { AccountViewORM } from './AccountViewORM';

@EntityRepository(AccountViewORM)
export class AccountViewRepo extends Repository<AccountViewORM> {
    private readonly userAlias = 'TB_ACCOUNT';
  
    constructor(manager: EntityManager) {
      super(AccountViewORM, manager);
    }
  
    private buildUserQueryBuilder(): SelectQueryBuilder<AccountViewORM> {
      return this.createQueryBuilder(this.userAlias).select();
    }
  
    private extendQueryWithByProperties(
      by: { no : string;},
      query: SelectQueryBuilder<AccountViewORM>
    ): void {
      if (by.no) {
        query.andWhere(`${this.userAlias}.no = :no`, { no: by.no });
      }
      
    }
  
    public async findUser(by: { no: string;  }): Promise<AccountViewORM> {
      const query = this.buildUserQueryBuilder();
      this.extendQueryWithByProperties(by, query);
  
      const ormEntity = await query.getOne();
      return ormEntity;
    }
  
    public async addUser(ormUser: AccountViewORM): Promise<{ no: string }> {
  
      const insertResult: InsertResult = await this.createQueryBuilder()
        .insert()
        .into(AccountViewORM)
        .values([ormUser])
        .execute();
  
        
      return { no: insertResult.identifiers[0].no };
    }

    public async updateUser(user: AccountViewORM): Promise<void> {
      await this.update(user.no, user);
    }
  }
  