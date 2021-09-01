import Route from '@ioc:Adonis/Core/Route'
import './Auth'

Route.get('/', async () => {
  return { hello: 'world' }
})
