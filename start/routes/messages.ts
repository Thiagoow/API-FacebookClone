import Route from '@ioc:Adonis/Core/Route'

Route.post('/messages', 'Messages/Main.store').middleware('auth')
Route.delete('/messages', 'Messages/Main.destroy').middleware('auth')
