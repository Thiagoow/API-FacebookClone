import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/Follows'
import { User } from 'App/Models'

export default class UnfollowController {
  public async store({ request, auth }: HttpContextContract) {
    const { followingId } = await request.validate(StoreValidator)
    const user = await User.findOrFail(followingId)
    //ADICIONA(attach()) o usuário que seguiu como um seguidor:
    await user.related('followers').attach([auth.user!.id])
  }
}
