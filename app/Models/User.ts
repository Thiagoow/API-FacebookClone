import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { UserKey } from 'App/Models'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({
    autoCreate: true,
    //Formatando data e hora para um formato mais legível:
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    //Formatando data e hora para um formato mais legível:
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  /* Um usuário pode ter várias keys (hasMany), pq ele pode
  estar fazendo mais de uma ação na dB ao msm tempo 😊😉 */
  @hasMany(() => UserKey)
  public keys: HasMany<typeof UserKey>
}
