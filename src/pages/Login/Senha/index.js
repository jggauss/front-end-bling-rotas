import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Context } from "../../../Context/AuthContext";
import api from "../../../config/configApi";
import * as yup from 'yup';



export const LoginSenha = () => {

    const [status, setStatus] = useState({
        type: "",
        mensagem: "",
    });

    const [user, setUser] = useState({
        email: "",
        name: "",
        password: "",

    });

    const valueInput = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });

    useEffect(() => {
        const getuser = async () => {
            
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.get('/login/user', headers)
                .then((response) => {
                    setUser({
                        email: response.data.email,
                        name: response.data.name,
                        password:""

                    })
                })
                .catch((erro) => { console.log(erro) })
        }
        getuser()
    }, [])


    const { handleLogout } = useContext(Context)

    const alteraSenha = async (e)=>{
        e.preventDefault()

        if(!(await validate())) return
        


        if(user.password!==user.password2){
            setStatus({
                type:"error",
                mensagem:"Erro. Senhas devem ser iguais"
            })
            return

        }


        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers':{
            'Authorization':'Bearer '+ valueToken
            }
        }
        await api.put('/login/senha',user,headers)
        
        .then((mensagem)=>{
            setStatus({
            type:"success",
            mensagem: mensagem.data.mensagem
        })})
        .catch((erro)=>{
            setStatus({
                type:"error",
                mensagem: "Erro. Usuário não foi alterado"
            })
        })
    }


    async function validate(){
        let schema = yup.object().shape({
            password: yup.string("Nescessário preencher a senha").required("Nescessário preencher a senha").min(6,"Erro. A senha deve ter mais do que 6 caracteres"),
            
            
            
          });
          try{
            await schema.validate({
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
            <h1>Alterar Senha

            </h1>
            <Link to='/home'>Home </Link>{" / "}
            <Link to='/login/alterar'>Alterar</Link>{" / "}
            <Link to="/" onClick={handleLogout}>Sair</Link>

            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}

            <form onSubmit={alteraSenha}>

                <label>Nome : </label>{user.name}<br/>

                <label>E-mail : </label>{user.email}<br/>

                <label>Senha</label>
                    <input type="password" name="password" placeholder="Digite sua senha" onChange={valueInput}></input><br/>
                    <label>Repita a Senha</label>
                    <input type="password" name="password2" placeholder="Repetir a senha" onChange={valueInput}></input><br/>

                    <button type="submit">Alterar</button>
            </form>




        </div>

    )
}