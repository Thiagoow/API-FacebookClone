import Ws from 'App/Services/Ws'

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
