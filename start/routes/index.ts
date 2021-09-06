import Route from '@ioc:Adonis/Core/Route'
import './auth'
import './users'
import './uploads'
import './posts'
import './comments'

Route.get('/', async () => {
  return {
    hello: 'world :D',
  }
})

Route.get('/user-register', async ({ view }) => {
  return view.render('emails/register')
})
