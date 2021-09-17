import test from 'japa'
import { baseURL } from 'Test/utils'
import Database from '@ioc:Adonis/Lucid/Database'
import Mail from '@ioc:Adonis/Addons/Mail'
import faker from 'faker'

test.group('/users/register', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('[store] - Able to send mail after pre-registration', async (assert) => {
    const email = faker.internet.email()

    //Antes de enviar o e-mail, intercepta ele com o método trap:
    Mail.trap((message) => {
      //E vê se todos os dados dele são iguais aos que deveriam ser:
      assert.deepEqual(message.to, [{ address: email }])
      assert.deepEqual(message.subject, 'Criação de conta')
      assert.deepEqual(message.from, {
        address: 'contato@facebookclone.com',
        name: 'Thiago - FacebookAdmin',
      })
    })

    await baseURL
      .post('/users/register')
      .send({ email, redirectUrl: 'https://localhost:3000' })
      .expect(200)

    //Tira o e-mail da intercepção com trap:
    Mail.restore()
  })
})
