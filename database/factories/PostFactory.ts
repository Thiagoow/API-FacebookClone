import { Post } from 'App/Models'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserFactory } from '.'

//Gerará dados falsos de usuários para popular a nossa dB:
export const PostFactory = Factory.define(Post, ({ faker }) => {
  return {
    description: faker.lorem.text(),
  }
})
  .relation('user', () => UserFactory)
  .build()