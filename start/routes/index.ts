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

//Teste pra ver se o Ws está executando os eventos pelo Front End:
Route.on('/test').render('test')

//Rota para utilização do teste de chat e mensagens em tempo real:
Route.on('/chat').render('chat')

//
Route.on('/home').render('home')

/*Link user1 -> Usuário admin (Lester):
http://127.0.0.1:3333/chat?conversationId=3&userId=3&receiverId=4&token=NQ.HvSQ_HqE7PkR99f3QqMIFtlp8jvNiIvo2pRI2-7Tk1KpK3nE227750qg6Som
*/

/* Link user2 -> Usuário normal (Beluga):
http://127.0.0.1:3333/chat?conversationId=3&userId=4&receiverId=3&token=Ng.-gU76gMlMpdAwUCE5JR9y64WOnc_wMzyiYO3qgoe8b9VzenzhipmHb0WRXDA
*/
