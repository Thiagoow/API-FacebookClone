import Ws from 'App/Services/Ws'
import { User } from 'App/Models'
import { getIds, OnlineUser, updateOnlineFollowing } from 'App/Utils'

/* WebSocket de teste :D
//Inicia o web socket no back end:
Ws.start((socket) => {
  //Escuta o eventoX, definido lá no @resources/test.edge:
  socket.on('eventoX', () => {
    //Mostra no console o id da conexão do user 
    //conectado na view de test.edge:
    console.log(socket.id)
  })
})
*/

//Quando criarmos uma nova conversa com o Front End:
Ws.start((socket) => {
  //Cria uma nova sala/conversa com o Ws:
  socket.on('create', (room) => {
    //Se junta a sala criada:
    socket.join(room)
  })
})

//Eventos em tempo real com Ws para saber quando os users estão online:
const onlineUsers: OnlineUser[] = []

Ws.start((socket) => {
  socket.on('isOnline', async ({ userId }) => {
    onlineUsers.push({
      databaseId: userId,
      socketId: socket.id,
    })

    await updateOnlineFollowing({ onlineUsers, socket, userId })

    socket.on('disconnect', async () => {
      const index = onlineUsers.findIndex(({ socketId }) => socketId === socket.id)

      onlineUsers.splice(index, 1)

      await updateOnlineFollowing({ onlineUsers, socket, userId })
    })
  })

  socket.on('getOnlineFollowing', async ({ userId }) => {
    const user = await User.findOrFail(userId)

    await user.preload('following', (query) => {
      query.whereIn('following_id', getIds(onlineUsers))
    })

    socket.emit('onlineFollowingList', user.following)
  })

  socket.on('create', (room) => {
    socket.join(room)
  })
})
