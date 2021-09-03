const fileCategories = ['avatar', 'post'] as const //<- Não deixa seus valores serem alterados
/* Limita as escolhas de categoria apenas para as que 
são definidas ACIMA, na array de fileCategories 😁😎: */
type FileCategory = typeof fileCategories[number]

export { fileCategories, FileCategory }
