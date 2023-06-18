import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Stadium, StadiumRelations} from '../models';

export class StadiumRepository extends DefaultCrudRepository<
  Stadium,
  typeof Stadium.prototype.id,
  StadiumRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Stadium, dataSource);
  }
}
