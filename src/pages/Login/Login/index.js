
import React,{useContext, useState} from "react";
import {Link,Navigate,useLocation} from "react-router-dom"
import api from "../../../config/configApi"
import { Context } from "../../../Context/AuthContext.js";

export const Login = ()=>{
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
      });
      const  { authenticated, signIn } = useContext(Context)
      const [user, setUser] = useState({
        email: "",
        password:""
    });

      const valueInput = (e) =>
      setUser({ ...user, [e.target.name]: e.target.value });



      const login = async (e) => {
        e.preventDefault()
        const headers = {
            'Content-Type': 'application/json'
        }


        
        await api.post('/login/', user, {headers} )
        .then((response)=>{

            setStatus({
                type:"success",
                mensagem:"Login realizado com sucesso"
            })
            localStorage.setItem("token",response.data.token)
            
            signIn(true)
        })
        .catch(()=>{
            setStatus({
                type:"error",
                mensagem:"Erro. Login falhou."
            })
        })
        
        

        
      }


    return (
            <div>
                <h1>Login</h1>
                 
                 
                 <hr/>
                 {status.type === "error" ?<p> {status.mensagem}</p> : ""}
                 {status.type === "success" ?<p> {status.mensagem}</p> : ""}     
                 {status.type === "success" ? (<Navigate to="/home" state={status} />): ""}  

                 <form onSubmit={login}>
                   
                    <label>E-mail</label>
                    <input type="text " name="email" placeholder="Digite seu melhor e-mail" onChange={valueInput}></input><br/>
                    <label>Senha</label>
                    <input type="password" name="password" placeholder="Digite sua senha" onChange={valueInput}></input><br/>
                    <hr/>
                    
                    <button type="submit">Login</button>
                    
                   <Link to='/login/cadastrar'>Cadastrar Usuário</Link>

                 </form>

            </div>

    )
}