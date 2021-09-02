import Route from '@ioc:Adonis/Core/Route'

// Rotas convencionais:
Route.post('/auth', 'Auth/Main.store')
Route.delete('/auth', 'Auth/Main.destroy').middleware('auth')

/* Rotas como recurso:
Route.resource('/auth', 'Auth/Main')
  .only(['store', 'destroy'])
  .middleware({
    destroy: ['auth'],
  })
*/
