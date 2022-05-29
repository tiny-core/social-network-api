import Drive from '@ioc:Adonis/Core/Drive'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import UpdateValidator from 'App/Validators/Users/Authenticated/Main/UpdateValidator'

export default class MainController {
  public async show({ auth, response }: HttpContextContract) {
    const user = auth.user!

    await user.load('profile')

    response.ok(user)
  }

  public async update({ auth, request }: HttpContextContract) {
    const { username, password, profile } = await request.validate(UpdateValidator)

    const user = auth.user!

    await User.updateOrCreate({ id: user.id }, { username, password })
    await user.related('profile').updateOrCreate({}, { ...profile })
  }

  public async destroy({ auth }: HttpContextContract) {
    const user = auth.user!

    await auth.logout()

    await user.load('profile')

    if (await Drive.exists(user.profile.avatar)) await Drive.delete(user.profile.avatar)

    await user.delete()
  }
}
