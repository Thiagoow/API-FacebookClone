import { User } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { PostFactory } from '.'

//Gerará dados falsos de usuários para popular a nossa dB:
export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.name.findName(),
  }
})
  //O usuário tem os relacionamentos:
  .relation('posts', () => PostFactory)
  .build()
