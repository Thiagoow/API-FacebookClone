import supertest from 'supertest'

//Para que o servidor de testes consiga testar o server da aplicação:
export const baseURL = supertest(`http://${process.env.HOST}:${process.env.PORT}`)
