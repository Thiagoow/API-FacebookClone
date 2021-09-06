import BaseSchema from '@ioc:Adonis/Lucid/Schema'
/* Arquivo que define quais categorias 
podem ser os arquivos dessa tabela de files:*/
import { fileCategories } from 'App/Utils'

export default class Files extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').notNullable()
      table.string('file_name').notNullable()
      //Essa coluna categorizará todos os arquivos enviados pra nossa tabela de files:
      table.enu('file_category', fileCategories).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
