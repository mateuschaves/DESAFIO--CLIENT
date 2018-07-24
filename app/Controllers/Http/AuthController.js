'use strict'

const User = use('App/Models/User')
const Database      = use('Database')

const { validate }  = use('Validator')

class AuthController {
  // Registra um usuário.
  async register({ request, response }){
    // Recebe os campos passados na requisição.
    const data = request.only(['username', 'email', 'password'])
    if(!request.input('username') && !request.input('email') && !request.input('password')){
        response.status(400)
        return response.send({
          message: 'Preencha todos os campos !'
        })
    }
    // Criando uma regra de validação para os campos.
    const rules = {
        username: 'required',
        email: 'required|email|unique:users,email',
        password: 'required'
    }
    // Validando os campos.
    const validation = await validate( data , rules)
    if(validation.fails()){
      response.status(400)
      response.send({
        error: validation.messages()
      })
    }
    // Contando os  usuários com o mesmo username informado.
    const check_username = await Database.from('Users').where({
        username: data.username
    }).getCount()
    // Contando os usuários com o mesmo email informado.
    const check_email = await Database.from('Users').where({
        email: data.email
    }).getCount()
    // Verificando se existe algum usuário com o username ou email igual ao informado.
    if(check_email > 0 || check_username > 0){
      response.status(400)
      response.send({
        error: 'Usuário ou Email já cadastrado !'
      })
    }else{
        // Criando o usuário.
        const user = await User.create(data)
        response.status(201)
        response.send({
          user:user
        })
    }
}

 // Autentica um usuário já cadastrado.
 async authenticate({ request, auth, response }){
  // Recebe os campos passados na requisição.
  const data = request.only(['email', 'password'])
  // Criando uma regra de validação para os campos.
  const rules = {
      email: 'required|email',
      password: 'required'
  }
  //Validando os campos.
  const validation = await validate(data, rules)
  // Verificando se a validação foi bem sucedida.
  if(!validation.fails()){
      // Fazendo a autenticação e obtendo o token de acesso.
      const token = await auth.attempt(data.email, data.password)
      // Buscando o usuário pelo email.
      const user = await Database.table('users').where('email', data.email).first()
      // Retornando o token de acesso.
      response.status(200)
      response.send(token)
  }else{
      // Mensagem de erro, a validação falhou.
      response.status(400)
      reponse.send({
        error: validation.messages()
      })
  }
}

}

module.exports = AuthController
