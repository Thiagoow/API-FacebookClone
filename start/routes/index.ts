import Route from '@ioc:Adonis/Core/Route'
import './auth'
import './users'
import './uploads'

Route.get('/', async () => {
  return {
    hello: 'world :D',
  }
})

Route.get('/user-register', async ({ view }) => {
  return view.render('emails/register')
})
