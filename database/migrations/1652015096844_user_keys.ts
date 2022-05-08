import { userKeys } from 'App/Utils/user'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserKeys extends BaseSchema {
  protected tableName = 'user_keys'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.uuid('key').notNullable()
      table.enum('type', userKeys).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('expired_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
