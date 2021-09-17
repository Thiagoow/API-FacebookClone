import { UserFactory } from 'Database/factories'
import { baseURL } from './baseURL'

export const generateRandomUserToken = async () => {
  const user = await UserFactory.merge({ password: 'secret' }).create()

  const { body } = await baseURL.post('auth').send({ email: user.email, password: 'secret' })

  return { token: body.token, user }
}
