
import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import api from "../../../config/configApi";
import * as yup from 'yup';



export const PasswordUpdate = (props) => {
  const { key } = useParams()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const updatePassword = async e => {
    e.preventDefault()
    if (!(await validate())) return
    

    await api.put('/login/update-password/'+key,{password})
    .then((response)=>{
      setStatus({
        type:"redsuccess",
        mensagem:response.data.mensagem
      })
    })
    .catch((err)=>{
      if(err.response){
        setStatus({
          type:"error",
          mensagem:err.response.data.mensagem
        })
      }else{
        setStatus({
          type:"error",
          mensagem:"Erro.Tente mais tarde"
        })
      }

    })

  }
  async function validate() {
    let schema = yup.object().shape({
      password: yup.string("Nescessário preencher a senha").required("Nescessário preencher a senha").min(6, "Erro. A senha deve ter mais do que 6 caracteres"),
    });
    try {
      await schema.validate({
        password: password,
      })
      return true
    } catch (err) {
      setStatus({
        type: 'error',
        mensagem: err.errors
      })
      return false
    }
  }




  useEffect(() => {
    const valKey = async () => {
      const headers = {
        'headers': {
          'Content-Type': 'application/json'
        }
      }
      await api.get('/login/val-key-recover-password/' + key, headers)
        .then((response) => {
          return setStatus({
            type: "success",
            mensagem: response.data.mensagem
          })

        })
        .catch((err) => {
          if (err.response) {
            return setStatus({
              type: "error",
              mensagem: err.response.data.mensagem
            })
          } else {
            return setStatus({
              type: "error",
              mensagem: "Tente mais tarde"
            })
          }

        })

    }
    valKey()
  }, [key])

  return (
    <div>
      <h1>Editar a senha</h1>

      {status.type === "error" ? <p> {status.mensagem}</p> : ""}
      {status.type === "success" ? <p> {status.mensagem}</p> : ""}
      {status.type === "error" ? (<Navigate to="/" state={status} />) : ""}
      {status.type === "redsuccess" ? (<Navigate to="/" state={status} />) : ""}

      <form onSubmit={updatePassword}>
        <label>Senha* : </label>
        <input type="password" name="password" placeholder="Senha com no mínimo 6 digitos" onChange={text => setPassword(text.target.value)}></input><br /><br />
        * Campo obrigatório
        <button type="submit">Salvar</button><br /><br />
        Lembrou a senha<Link to='/'>Clique aqui</Link>
      </form>
    </div>
  )
}