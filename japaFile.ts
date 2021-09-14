import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

//Cria um mini server de tests:
process.env.NODE_ENV = 'testing'
//Oculta os logs não importantes (mostra apenas os resultados):
process.env.LOG_LEVEL = 'fatal'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

//Roda o server da aplicação e de testes:
async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

configure({
  /* Executa os arquivos de teste que tem
  possuam o final ".spec.ts", dentro da pasta 'test':  */
  files: ['test/**/*.spec.ts'],
  //Mas antes de executar os arquivos, sobe o server de tests:
  before: [startHttpServer],
})
