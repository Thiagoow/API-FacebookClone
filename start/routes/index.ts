import Route from '@ioc:Adonis/Core/Route'
import './auth'
import './users'
import './uploads'
import './posts'
import './comments'
import './reactions'
import './follows'
import './profiles'
import './messages'
import './conversations'

Route.get('/', async () => {
  return {
    hello: 'world :D',
  }
})

/* Visualização em .edge do layout dos e-mails a
serem enviados pro usuário em SMTP: */
Route.get('/verify-register', async ({ view }) => {
  return view.render('emails/verify-register')
})
Route.get('/forgot-password', async ({ view }) => {
  return view.render('emails/forgot-password')
})

Route.on('/test').render('test')
