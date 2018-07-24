'use strict'

const Schema = use('Schema')

class CodeSchema extends Schema {
  up () {
    this.create('codes', (table) => {
      table.increments()
      table.string('title', 50)
      table.text('body')
      table.string('language', 50)
      table.integer('users_id').unsigned().index()
      table.foreign('users_id').references('id').on('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('codes')
  }
}

module.exports = CodeSchema
