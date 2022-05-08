import test from 'japa'
import { baseURL } from 'Test/utils'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import faker from '@faker-js/faker'

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

  test('[store] - Authenticate with valid credentials', async (assert) => {
    //Cria um user com a fábrica de users e a senha personalizada 'secret':
    const user = await UserFactory.merge({ password: 'secret' }).create()
    //Faz o login como usuário que foi criado:
    const { body } = await baseURL
      .post('auth')
      .send({ email: user.email, password: 'secret' })
      .expect(200)
    //Verifica se existe um token:
    assert.exists(body.token)
  })

  test('[store] - Fail to authenticate with invalid credentials', async () => {
    //Tenta fazer o login com um user não existente de e-mail aleatório:
    await baseURL
      .post('/auth')
      .send({ email: faker.internet.email(), password: 'secret' })
      .expect(400)
  })

  test('[destroy] - Delete token after logout', async (assert) => {
    //Cria um user com a fábrica de users e a senha personalizada 'secret':
    const user = await UserFactory.merge({ password: 'secret' }).create()
    //Faz o login como usuário que foi criado:
    const { body } = await baseURL
      .post('auth')
      .send({ email: user.email, password: 'secret' })
      .expect(200)

    //Deleta o token com a autorização/autenticação do user criado:
    await baseURL.delete('/auth').set('authorization', `bearer${body.token}`).expect(200)

    //Verifica se ainda existe um token na tabela 'api_tokens':
    const token = await Database.from('api_tokens').where({ user_id: user.id }).first
    //Dá certo se existe um token nulo/vazio na aplicação:
    assert.isNull(token)
  })
})
