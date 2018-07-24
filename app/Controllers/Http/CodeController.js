'use strict'
const { validate }  = use('Validator')

const Database = use('Database')
const Code = use('App/Models/Code')
class CodeController {

  async store({request, response, auth}){
    const user = await auth.getUser()
    const data = {
        title: request.input('title'),
        body: request.input('body'),
        language: request.input('language'),
        users_id: user.id
      }
      const rules = {
        title: 'required',
        body: 'required',
        language: 'required',
      }
      const validation = await validate(data, rules)
      if(validation.fails()){
        response.status(400)
        return response.send({
          message: validation.messages()
        })
      }
      const check = await Code.create(data)
      if(check){
        response.status(201)
        return response.send({
          message: 'Código guardado com carinho !',
          code: check
        })
      }
  }

  async show({params, response, auth}){
    const user = await auth.getUser()
    if(params.id){
        const code = await Database.from('codes').where('id', params.id).where('users_id', user.id).first()
        try{
            code.body
            response.status(200)
            return response.send({
              code: code
            })
          }catch (error){
            response.status(401)
            return response.send({
              message: 'Eitcha, não achei .-.'
            })
        }
    }else{
      response.status(401)
      return response.send({
        message: 'Informe o ID do código que deseja mostrar !'
      })
    }
  }

  async delete({params, response, auth}){
    const user = await auth.getUser()
    if(params.id){
      const code = await Database.from('codes').where('id', params.id).where('users_id', user.id).del()
      if(code){
        response.status(200)
        return response.send({
          massage: 'Gambiarra, quer dizer código, apagado com sucesso !'
        })
      }else{
        response.status(401)
        return response.send({
          message: 'Eitcha, não achei !'
        })
      }
    }else{
      response.status(401)
      return response.send({
        message: 'Informe o ID do código que deseja deletar !'
      })
    }
  }


  async update({params, response, request, auth}){
    if(!params.id){
      response.status(401)
      return response.send({
        message: 'Informe o ID do código !'
      })
    }
    const user = await auth.getUser()
    const data = {
      title: request.input('title'),
      body: request.input('body'),
      language: request.input('language'),
      users_id: user.id
    }
    const rules = {
      title: 'required',
      body: 'required',
      language: 'required',
    }
    const validation = await validate(data, rules)
    if(validation.fails()){
      response.status(401)
      return response.send({
        message: validation.messages()
      })
    }
    const code = await Database.from('codes').where('id', params.id).where('users_id', user.id).update({
      title: data.title,
      body: data.body,
      language: data.language,
      users_id: data.users_id
    })
    if(code > 0 ){
      response.status(200)
      return response.send({
        message: 'Gambiarra arrumada =)'
      })
    }else{
      response.status(401)
      return response.send({
        message: 'Eitcha, não achei .-.'
      })
    }
  }
}

module.exports = CodeController
