import { User } from 'App/Models'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Database from '@ioc:Adonis/Lucid/Database'

export const isFollowing = async (user: User, auth: AuthContract) => {
  const isFollowing = await Database.query()
    //Busca na tabela follows:
    .from('follows')
    //Se o user logado já segue ou não um usuário:
    .where('follower_id', auth.user!.id)
    //Como só pode seguir uma única vez:
    .first()

  //Define se o usuário está ou não seguindo um outro:
  user.$extras.isFollowing = isFollowing ? true : false
}
