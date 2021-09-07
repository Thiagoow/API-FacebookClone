import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { StoreValidator } from 'App/Validators/Follows'

export default class UnfollowController {
  public async store({ request, auth }: HttpContextContract) {
    const { followingId } = await request.validate(StoreValidator)
    const user = await User.findOrFail(followingId)
    //REMOVE(detach()) o usuário que seguiu como um seguidor:
    await user.related('followers').detach([auth.user!.id])
  }
}
