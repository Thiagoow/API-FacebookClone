import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import { User, File, Comment, Reaction } from 'App/Models'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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

  @column()
  public description: string

  @column({ serializeAs: null }) //<- Oculta da resposta da API
  public userId: number

  //Pertence a UM usuário:
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  //Possui uma mídia:
  @hasOne(() => File, {
    foreignKey: 'ownerId',
    onQuery: (query) => query.where('fileCategory', 'post'),
  })
  public media: HasOne<typeof File>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @computed()
  public get commentsCount() {
    return this.$extras.comments_count
  }

  @hasMany(() => Reaction, { serializeAs: null }) //Não mostra o relacionamento das postagens com usuário
  public reactions: HasMany<typeof Reaction>

  @computed()
  public get countReactions() {
    return {
      //Retorna a quantidade das reações OU 0:
      like: this.$extras.likeCount || 0,
      love: this.$extras.loveCount || 0,
      haha: this.$extras.hahaCount || 0,
      sad: this.$extras.sadCount || 0,
      angry: this.$extras.angryCount || 0,
    }
  }

  //Para exibir qual a reação que o user fez em uma postagem:
  @computed()
  public get activeReaction() {
    /* Se existir uma array de reações e o tamanho dessa 
    array for > 0 -> Pega o tipo da reação dessa array cuja
    qual se encontra na 1º posição, ou se não existir, retorna nulo */
    return this.reactions && this.reactions.length ? this.reactions[0].type : null
  }
}
