import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Context } from "../../../Context/AuthContext";
import api from "../../../config/configApi";



export const LoginAlterar = () => {

    const [status, setStatus] = useState({
        type: "",
        mensagem: "",
    });

    const [user, setUser] = useState({
        email: "",
        name: "",
        apikey: "",
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
                    console.log(response)
                    setUser({
                        email: response.data.email,
                        name: response.data.name,
                        apikey: response.data.apikey

                    })
                })
                .catch((erro) => { console.log(erro) })
        }
        getuser()
    }, [])


    const { handleLogout } = useContext(Context)

    const alteraUsuario = async (e)=>{
        e.preventDefault()
        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers':{
            'Authorization':'Bearer '+ valueToken
            }
        }
        await api.put('/login/user',user,headers)
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



    return (
        <div>
            <h1>Alterar usuário

            </h1>
            <Link to='/home'>Home </Link>{" / "}
            <Link to='/login/alterar'>Alterar</Link>{" / "}
            <Link to="/" onClick={handleLogout}>Sair</Link>

            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}

            <form onSubmit={alteraUsuario}>
                <label>Nome : </label>
                <input type="text" name="name" value={user.name} placeholder="Nome do seu e-comerce" onChange={valueInput}></input><br />
                <label>E-mail : </label>
                <input type="text" name="email" value={user.email} placeholder="Digite seu melhor e-mail" onChange={valueInput}></input><br />
                <label>Api key : </label>
                <input type="text" name="apikey" value={user.apikey} placeholder="Digite a chave de api gerada no Bling" onChange={valueInput}></input><br />
                <button type="submit">Alterar</button>
            </form>




        </div>

    )
}