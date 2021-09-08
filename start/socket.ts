import Ws from 'App/Services/Ws'

//Inicia o web socket no back end:
Ws.start((socket) => {
  //Escuta o eventoX, definido lá no @resources/test.edge:
  socket.on('eventoX', () => {
    /* Mostra no console o id da conexão do user 
    conectado na view de test.edge: */
    console.log(socket.id)
  })
})
