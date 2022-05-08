<!--
<div align="center">
<img src="./ReadMeFiles/app.jpg" align="center">
</div>-->

<!-- Japa tests instructions to put in the bash terminal below:

# Rodar os testes unitários e automáticos com o Japa:
$ npm run japa

# Rodar os testes e reinicia-los a cada alteração:
$ npm run japa:watch

 -->

# API com Adonis.js para o projeto -> FacebookClone

<p>Essa API Rest foi feita por: <strong>Thiago Silva Lopes</strong>, em 05/2022.</br>
Tendo como base, as aulas de "Back-end com Adonis", no Bootcamp Full Stack da <a href="https://bootcamp.cataline.io/">Cataline</a>.</br>
Sendo utilizada no projeto -> <a href="https://github.com/Thiagoow/FrontEnd-FacebookClone">
FacebookClone - Clonagem de rede social para integração Front End + Back End</a></p>

## Demo: -------

## Build Setup

Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop) ou apenas o [Docker Compose](https://docs.docker.com/compose/install).

```bash
# Instalar dependências:
$ yarn install

# Criar o container com MySQL:
$ docker-compose up -d

# Criar as tabelas/estruturas na dB:
$ node ace migration:run

# Criar arquivo ".env" na pasta raiz com base no ".env.example"

# Rodar o servidor local:
$ yarn dev

# Fazer o build pra produção e executar o servidor:
$ yarn build
$ yarn start
```
