
import React,{useState} from "react";
import {Link} from "react-router-dom"
import api from "../../../config/configApi";

import * as yup from 'yup';


export const LoginCadatrar = ()=>{
    const [status, setStatus] = useState({
        type:  "",
        mensagem:  "",
      });

      const [user, setUser] = useState({
        name: "",
        email: "",
        password:"",
        apkey:""
    });
    const valueInput = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });


      const addUser = async (e) => {
        e.preventDefault()
        if(!(await validate())) return
        const dadosUser = {...user}

        if(dadosUser.password!==dadosUser.password2){
            setStatus({
                type:"error",
                mensagem:"Erro. Senhas devem ser iguais"
            })
            return

        }
        await api.get('/login/user/'+(dadosUser.email))
            .then(()=>{
                setStatus({
                    type:"success",
                    mensagem:"Usuário cadastrado com sucesso"
                })
            })
            .catch(()=>{
                setStatus({
                    type:"error",
                    mensagem:"Erro. Usuário já existe."
                })
            })
            
        await api.post('/login/cadastrar',dadosUser)
          .then(()=>{
            setStatus({
                type:"success",
                mensagem:"Usuário cadastrado com sucesso"
            })
                
          })
          .catch(()=>{})
          
      }

      

      async function validate(){
        let schema = yup.object().shape({
            apikey: yup.string("Nescessário preencher a api key 1").required("Nescessário preencher a api key 1"),
            password: yup.string("Nescessário preencher a senha").required("Nescessário preencher a senha").min(6,"Erro. A senha deve ter mais do que 6 caracteres"),
            email: yup.string("Nescessário preencher o email").required("Nescessário preencher o email"),
            name: yup.string("Nescessário preencher o nome").required("Nescessário preencher o nome"),
            
            
            
          });
          try{
            await schema.validate({
                name: user.name,
                email:user.email,
                apikey:user.apikey,
                password:user.password,
                
            })
            return true
          } catch (err){
            setStatus({
                type:'error',
                mensagem:err.errors
            })
            return false
          }
      }


    return (
            <div>
                <h1>Cadastrar Usuário</h1>
                 <Link to='/home'>Home </Link>{" / "}
                 <Link to='/produtos'>Produtos</Link>{" / "}
                 <Link to='/buscalojas'>Lojas</Link>{" / "}
                 <Link to='/pedidos'>Pedidos</Link>{" / "}
                 <Link to='/'>Login</Link>{" / "}
                 
                 <hr/>
                 {status.type === "error" ?<p> {status.mensagem}</p> : ""}
                 {status.type === "success" ?<p> {status.mensagem}</p> : ""}       

                 <form onSubmit={addUser}>
                    <label>Nome</label>
                    <input type="text" name="name" placeholder="Nome do seu e-comerce" onChange={valueInput}></input><br/>
                    <label>E-mail</label>
                    <input type="text " name="email" placeholder="Digite seu melhor e-mail" onChange={valueInput}></input><br/>
                    <label>Api Key do Bling</label>
                    <input type="text " name="apikey" placeholder="Digite a chave de api gerada no Bling" onChange={valueInput}></input><br/>
                    
                    <label>Senha</label>
                    <input type="password" name="password" placeholder="Digite sua senha" onChange={valueInput}></input><br/>
                    <label>Repita a Senha</label>
                    <input type="password" name="password2" placeholder="Repetir a senha" onChange={valueInput}></input><br/>

                    <button type="submit">Cadastrar</button>
                 </form>

            </div>

    )
}