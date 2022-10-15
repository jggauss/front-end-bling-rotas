import React,{ useContext,  useState} from "react";
import {Link} from "react-router-dom"
import { Context } from "../../../Context/AuthContext";
import api from "../../../config/configApi";



export const Dashboard = ()=>{
    const [status, setStatus] = useState({
        type:  "",
        mensagem:  "",
      });

    

      
      const {  handleLogout } = useContext(Context)
      
    return (
            <div>
                <h1>Dashboard</h1>
                 <Link to='/home'>Home </Link>{" / "}
                 <Link to='/login/alterar'>Alterar</Link>{" / "}
                 <Link to="/" onClick={handleLogout}>Sair</Link>
                 
                 <hr/>
                 {status.type === "error" ?<p> {status.mensagem}</p> : ""}
                 {status.type === "success" ?<p> {status.mensagem}</p> : ""}       

                 
                    <label>Nome</label><br/>
                    
                    <label>E-mail</label><br/>
                    
                    <label>Api key</label>
                    
                    
                    
                 

            </div>

    )
}