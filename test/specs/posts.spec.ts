/* CADA TESTE DENTRO DE UM GRUPO DE UM ARQUIVO PRECISA
SER TOTALMENTE ISOLADO E INDEPENDENTE DO OUTRO PARA FUNCIONAR!!!!
Ou seja -> Não podemos definir e usar variáveis no escopo global,
APENAS no escopo local!! */
import test from 'japa'
import { baseURL, generateRandomUserToken } from 'Test/utils'
import { PostFactory, UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import { Post } from 'App/Models'
import faker from '@faker-js/faker'

//Teste de CRUD das postagens:
test.group('/posts', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  // index
  test('[index] - List posts with username filter', async (assert) => {
    const user = await UserFactory.with('posts', 3, (post) => post.with('media')).create()
    //Autentica a rota com um token de user aleatório:
    const { token } = await generateRandomUserToken()
    //Faz uma requisição GET das postagens do user e postagens criadas acima:
    const { body } = await baseURL
      .get(`/posts?username=${user.username}`)
      .set('authorization', `bearer ${token}`)
      .expect(200)

    //Confirma se o user realmente criou 3 postagens com os dados:
    assert.lengthOf(body, user.posts.length)
    body.forEach((post: Post) => {
      assert.exists(post.id)
      assert.exists(post.description)
      assert.exists(post.user.name)
      assert.exists(post.user.username)
      assert.exists(post.comments)
      assert.exists(post.commentsCount)
      assert.exists(post.countReactions.like)
      assert.exists(post.countReactions.love)
      assert.exists(post.countReactions.sad)
      assert.exists(post.countReactions.angry)
      assert.exists(post.countReactions.haha)
    })
  })
  test('[index] - List your own posts when username filter is missing', async (assert) => {
    const user = await UserFactory.with('posts', 3, (post) => post.with('media')).create()
    //Autentica a rota com um token de user aleatório:
    const { token } = await generateRandomUserToken()
    //Faz uma requisição GET das postagens sem username definido:
    const body = await baseURL.get(`/posts`).set('authorization', `bearer ${token}`).expect(200)

    assert.equal(body.user.id, user.id)
  })

  // store
  test('[store] - Store a post when authenticated', async (assert) => {
    const { token } = await generateRandomUserToken()

    const { body } = await baseURL
      .post('/posts')
      .set('authorization', `bearer ${token}`)
      .send({ description: faker.lorem.words() })
      .expect(200)

    assert.exists(body.id)
    assert.exists(body.description)
  })
  test('[store] - Fail to store a post when is not authenticated', async () => {
    await baseURL
      .post('/posts')
      //Autenticação inválida:
      .set('authorization', `bearer ${faker.lorem.word()}`)
      .send({ description: faker.lorem.words() })
      .expect(401)
  })

  // update
  test('[update] - Update a post when authenticated', async (assert) => {
    const { token, user } = await generateRandomUserToken()
    /* Define na autenticação que o id de quem irá criar essas 
    postagens === Ao id do user criado acima: */
    const post = await PostFactory.merge({ userId: user.id }).create()
    const newDescription = faker.lorem.word()

    const { body } = await baseURL
      .put(`/posts/${post.id}`)
      .set('authorization', `bearer ${token}`)
      .send({ description: newDescription })
      .expect(200)

    //A descrição da postagem tem que ser IGUAL a definida nesse teste:
    assert.equal(body.description, newDescription)
  })
  test('[update] - Fail to update a post when isn"t authenticated', async (assert) => {
    //Cria uma postagem aleatória, de um user aleatório:
    const post = await PostFactory.create()
    const newDescription = faker.lorem.word()

    const { body } = await baseURL
      .put(`/posts/${post.id}`)
      .send({ description: newDescription })
      .expect(401)

    //A descrição da postagem tem que ser DIFERENTE a definida nesse teste:
    assert.notEqual(body.description, newDescription)
  })
  test('[update] - Fail to update a post from another user', async (assert) => {
    //Cria uma postagem aleatória, de um user aleatório:
    const { token } = await generateRandomUserToken()
    const post = await PostFactory.create()
    const newDescription = faker.lorem.word()

    const { body } = await baseURL
      .put(`/posts/${post.id}`)
      /*Tenta atualizar a postagem com a autenticação
        de um user diferente do dono: */
      .set('authorization', `bearer ${token}`)
      .send({ description: newDescription })
      .expect(401)

    //A descrição da postagem tem que ser DIFERENTE a definida nesse teste:
    assert.notEqual(body.description, newDescription)
  })

  // destroy
  test('[destroy] - Destroy a post when authenticated', async (assert) => {
    const { token, user } = await generateRandomUserToken()
    /* Define na autenticação que o id de quem irá criar essas 
    postagens === Ao id do user criado acima: */
    const post = await PostFactory.merge({ userId: user.id }).create()

    await baseURL.delete(`/posts/${post.id}`).set('authorization', `bearer ${token}`).expect(200)

    const postAfterDelete = await Database.from('posts').where({ id: post.id }).first()

    //Confirma que foi apagado da dB o post com id === criado acima:
    assert.isNull(postAfterDelete)
  })
  test('[destroy] - Fail to destroy a post when isn"t authenticated', async (assert) => {
    const post = await PostFactory.create()
    await baseURL
      .delete(`/posts/${post.id}`)
      //Autenticação inválida:
      .set('authorization', `bearer ${faker.lorem.word()}`)
      .expect(401)

    const postAfterDelete = await Database.from('posts').where({ id: post.id }).first()

    //Confirma que ainda existe na dB o post com id === criado acima:
    assert.exists(postAfterDelete)
  })
  test('[destroy] - Fail to destroy a post from another user', async (assert) => {
    const { token } = await generateRandomUserToken()
    const post = await PostFactory.create()
    await baseURL
      .delete(`/posts/${post.id}`)
      /*Tenta deletar a postagem com a autenticação
        de um user diferente do dono: */
      .set('authorization', `bearer ${token}`)
      .expect(401)

    const postAfterDelete = await Database.from('posts').where({ id: post.id }).first()

    //Confirma que ainda existe na dB o post com id === criado acima:
    assert.exists(postAfterDelete)
  })
})

//Teste de envio e delete de mídias de postagens:
test.group('/posts/:id/media', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('[store] - Attach an image to a post', async (assert) => {
    const { user, token } = await generateRandomUserToken()
    /* Define na autenticação que o id de quem irá criar essas 
    postagens === Ao id do user criado acima: */
    const post = await PostFactory.merge({ userId: user.id }).create()

    await baseURL
      .post(`/posts/${post.id}/media`)
      .set('authorization', `bearer ${token}`)
      .attach('file', 'Test/assets/image.jpg')
      .expect(200)

    //Verifica se a imagem realmente foi adicionada e existe na dB:
    const postMedia = Database.from('files').where({
      file_category: 'post',
      owner_id: post.id,
    })
    assert.exists(postMedia)
  })

  test('[store] - Fail to attach an image to a post from another user', async (assert) => {
    //Cria uma postagem sem antes criar um user pra dar a ela o owner_id === user.id:
    const post = await PostFactory.create()

    await baseURL
      .post(`/posts/${post.id}/media`)
      //Autenticação inválida:
      .set('authorization', `bearer ${faker.lorem.word()}`)
      .attach('file', 'Test/assets/image.jpg')
      .expect(401)

    //Verifica se a imagem NÃO foi adicionada e existe na dB:
    const postMedia = Database.from('files').where({
      file_category: 'post',
      owner_id: post.id,
    })
    assert.notExists(postMedia)
  })
})
