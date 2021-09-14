import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'
import execa from 'execa'

//Cria um mini server de tests:
process.env.NODE_ENV = 'testing'
/* Usa uma dB vazia que terá tudo que há na dB original,
para realizar os testes: */
process.env.MYSQL_DB_NAME = 'testing'
//Oculta os logs não importantes (mostra apenas os resultados):
process.env.LOG_LEVEL = 'fatal'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

//Executa as migrations para criar tabelas de testes:
async function runMigrations() {
  await execa.node('ace', ['migration:run'])
}

//Roda o server da aplicação e de testes:
async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

//Desfaz todas as migrations para limpar a dB de testes:
async function rollbackMigrations() {
  await execa.node('ace', ['migration:rollback'])
}

configure({
  /* Executa os arquivos de teste que tem
  possuam o final ".spec.ts", dentro da pasta 'test':  */
  files: ['test/specs/**/*.spec.ts'],
  //Mas antes de executar os arquivos, sobe o server de tests:
  before: [runMigrations, startHttpServer],
  //Faz um rollback/desfazer a criação de todas as migrations:
  after: [rollbackMigrations],
})
