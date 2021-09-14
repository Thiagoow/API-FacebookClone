import test from 'japa'
import { baseURL } from 'Test/utils'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Grupo de testes', (group) => {
  /* Usando as transactions e life cycle hooks do
  Japa, conseguimos limpar toda a nossa dB. Revertendo
  ela para o estado vazio original com o beforeEach + o
  beginGlobalTransaction() */
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  //Limpa a dB DEPOIS de todos os tests desse grupo:
  group.afterEach(async () => {
    /* Pois faz um rollback de tudo que foi feito 
    depois da criação da transaction: */
    await Database.rollbackGlobalTransaction()
  })

  test('Ensure GET requests', async (assert) => {
    //Testando a rota index:
    const { body } = await baseURL.get('/')
    //Pra dar certo, no certo tem que ter uma coluna hello:
    assert.exists(body.hello)
    //E o conteúdo dessa coluna ser 'world :D':
    assert.equal(body.hello, 'world :D')
  })

  test('Ensure login request', async (assert) => {
    //Popula a tabela de usuários com a factory e o faker:
    const user = await UserFactory.merge({ password: 'secret123' }).create()
    /* with() => Faz com que o usuário crie 
    5 postagens por exemplo. */

    const { body, status } = await baseURL.post('/auth').send({
      email: user.email,
      password: 'secret123',
    })

    assert.equal(status, 200)
    assert.exists(body.token)
  })
})
