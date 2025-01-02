import { Repository, EntityManager, SelectQueryBuilder, InsertResult } from 'typeorm';
import { AccountORM } from './AccoutOrm';

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
        query.andWhere(`${this.userAlias}.id = :id`, { id: by.no });
      }
      
    }
  
    public async findUser(by: { no: string;  }): Promise<AccountORM> {
      const query = this.buildUserQueryBuilder();
      this.extendQueryWithByProperties(by, query);
  
      const ormEntity = await query.getOne();
      return ormEntity;
    }
  
    public async addUser(ormUser: AccountORM): Promise<{ id: string }> {
  
      const insertResult: InsertResult = await this.createQueryBuilder()
        .insert()
        .into(AccountORM)
        .values([ormUser])
        .execute();
  
      return { id: insertResult.identifiers[0].id };
    }

    public async updateUser(user: AccountORM): Promise<void> {
      await this.update(user.no, user);
    }
  }
  