const reactionsCategories = ['like', 'love', 'haha', 'sad', 'angry'] as const //<- Não deixa seus valores serem alterados
/* Limita as escolhas de categoria apenas para as que 
são definidas ACIMA, na array de fileCategories 😁😎: */
type ReactionsCategories = typeof reactionsCategories[number]

export { reactionsCategories, ReactionsCategories }
