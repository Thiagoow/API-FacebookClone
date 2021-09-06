import Route from '@ioc:Adonis/Core/Route'

//Fornece todos os recursos para o controlador Main de Posts:
Route.resource('/posts', 'Posts/Main')
  /* Com todos as rotas de uma API Rest, EXCETO,
  a rota 'show'. Pois não haverá visualização individual
  de postagens ;) */
  .apiOnly()
  .except(['show'])
  /* Com as middlewares que limitam essas rotas apenas
  para users autenticados: */
  .middleware({
    index: ['auth'],
    store: ['auth'],
    update: ['auth'],
    destroy: ['auth'],
  })

Route.post('/posts/:id/media', 'Posts/Media.store').middleware('auth')
