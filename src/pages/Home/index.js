import React,{useContext, useState} from "react";
import {Link,useLocation} from "react-router-dom"

export const Home = ()=>{
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
      });

      
      


    return (
            <div>
                <h1>Home</h1>
                 <Link to='/home'>Home </Link>{" / "}
                 <Link to='/produtos'>Produtos</Link>{" / "}
                 <Link to='/buscalojas'>Lojas</Link>{" / "}
                 <Link to='/pedidos'>Pedidos</Link>{" / "}
                 <Link to='/dashboard'>Dashboard</Link>{" / "}
                 
                 
                 
                 <hr/>
                 {status.type === "error" ?<p> {status.mensagem}</p> : ""}
                 {status.type === "success" ?<p> {status.mensagem}</p> : ""}                                                      
            </div>

    )
}