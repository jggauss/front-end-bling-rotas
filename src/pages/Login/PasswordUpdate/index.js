
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
       <div className="d-flex">
                <div className="container-login">
                    <div className="wrapped-login">
                        <div className="title">
      <h1>Editar a senha</h1>
      </div>
      <div className="alert-content-adm">
        {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
        {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
        {status.type === "error" ? (<Navigate to="/" state={status} />) : ""}
        {status.type === "redsuccess" ? (<Navigate to="/" state={status} />) : ""}
      </div>
      <form onSubmit={updatePassword} className="form-login">
      <div className="row">
        <label>Senha* : </label>
        <input type="password" name="password" placeholder="Senha com no mínimo 6 digitos" onChange={text => setPassword(text.target.value)}></input><br /><br />
      </div>
      
        * Campo obrigatório
      <div className="signup-link">
        <button type="submit" className="pesquisa-title-button">Salvar</button><br /><br />
      </div>
      <div className="signup-link">
        Lembrou a senha<Link to='/' className="link-pg-login">Clique aqui</Link>
        </div>
      </form>
    </div>
    </div>
    </div>
    </div>
  )
}