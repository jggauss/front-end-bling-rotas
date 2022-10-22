import React,{ useContext,  useEffect, useState} from "react";
import {Link} from "react-router-dom"
import { Context } from "../../../Context/AuthContext";
import api from "../../../config/configApi";



export const Dashboard = ()=>{
  
    const [status, setStatus] = useState({
        type:  "",
        mensagem:  "",
      });

      const [user, setUser] = useState({
        email: "",
        name:"",
        apikey:"",
        password:"",
        
    });

      useEffect(()=>{
        const getuser = async ()=>{
          const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
          await api.get('/login/user',headers)
          .then((response)=>{
            setUser({
              email:response.data.email,
              name: response.data.name,
              apikey:response.data.apikey

            })
          })
          .catch((erro)=>{console.log(erro)})
        }
        getuser()
      },[])
    
      
      const {  handleLogout } = useContext(Context)
      
    return (
            <div>
                <h1>Dashboard</h1>
                 <Link to='/home'>Home </Link>{" / "}
                 <Link to='/login/alterar'>Alterar</Link>{" / "}
                 <Link to='/login/senha'>Alterar Senha</Link>{" / "}
                 <Link to="/" onClick={handleLogout}>Sair</Link>
                 
                 <hr/>
                 {status.type === "error" ?<p> {status.mensagem}</p> : ""}
                 {status.type === "success" ?<p> {status.mensagem}</p> : ""}       

                 
                    <label>Nome : </label>{user.name}<br/>
                    
                    <label>E-mail : </label>{user.email}<br/>
                    
                    <label>Api key : </label>{user.apikey}<br/>
                    
                    
                    
                 

            </div>

    )
}