import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import { UserKey, File, Post } from 'App/Models'

export default class User extends BaseModel {
  /* Exibe (dentro de um objeto "meta") qualquer 
  informação extra/não presente nesse módulo, 
  definida por algum controlador:
  public serializeExtras = true
  */
  //Para não termos que usar isso sem personalização
  //em camelCase, e com todos os atributos dentro do objeto
  //'meta', usamos as computed() props 😉

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

  //Um user possui 1 avatar:
  @hasOne(() => File, {
    //Como o arquivo fica salvo na tabela de files, e não de users:
    foreignKey: 'ownerId',
    onQuery: (query) => query.where({ fileCategory: 'avatar' }),
  })
  public avatar: HasOne<typeof File>

  //Um usuário pode ter VÁRIAS postagens:
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  //Seguidores:
  @manyToMany(() => User, {
    /* A tabela pivô/dinâmica que mantém o
    relacionamento de seguidores e usuários é a: */
    pivotTable: 'follows',
    //Chave estrangeira:
    pivotForeignKey: 'following_id',
    //Se relaciona com a chave também estrangeira:
    pivotRelatedForeignKey: 'follower_id',
  })
  public followers: ManyToMany<typeof User>

  //Seguindo:
  @manyToMany(() => User, {
    pivotTable: 'follows',
    //Chave estrangeira:
    pivotForeignKey: 'follower_id',
    //Se relaciona com a chave também estrangeira:
    pivotRelatedForeignKey: 'following_id',
  })
  public following: ManyToMany<typeof User>

  @computed()
  public get numPostagens() {
    return this.$extras.posts_count
  }
  @computed()
  public get numSeguidores() {
    return this.$extras.followers_count
  }
  @computed()
  public get numSeguindo() {
    return this.$extras.following_count
  }

  //Se o user logado está ou não seguindo esse outro user:
  @computed()
  public get seguindo() {
    return this.$extras.isFollowing
  }
}
