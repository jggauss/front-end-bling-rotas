import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Context } from "../../../Context/AuthContext";
import api from "../../../config/configApi";
import { MenuProfile } from "../../../Componet/MenuProfile";
import { Menu } from "../../../Componet/Menu";



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

    const alteraUsuario = async (e) => {
        e.preventDefault()
        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.put('/login/user', user, headers)
            .then((mensagem) => {
                setStatus({
                    type: "success",
                    mensagem: mensagem.data.mensagem
                })
            })
            .catch((erro) => {
                setStatus({
                    type: "error",
                    mensagem: "Erro. Usuário não foi alterado"
                })
            })
    }



    return (
        <div>
            <MenuProfile />
            <div className="content">
                <Menu active="users" />
                <div className="wrapper">
                    <div className="row">
                        <div className="top-content-admin">
                            <div className="title-content">
                                <h1 className="sub-menu-title">Alterar usuário</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                <div className="item-sub-menu">
                                    <Link to='/login/alterar'><button type="button" className="pesquisa-title-button">Alterar</button> </Link>
                                </div>
                                <div className="item-sub-menu">
                                    <Link to="/" onClick={handleLogout}><button type="button" className="pesquisa-title-button">Sair</button> </Link>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="alert-content-adm">
                        {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                        {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
                    </div>
                    <form onSubmit={alteraUsuario} className="texto-wrapped">
                        <p className="texto"><label>Nome : </label></p>
                        <input className="texto" type="text" name="name" value={user.name} placeholder="Nome do seu e-comerce" onChange={valueInput}></input>
                        <p className="texto"><label>E-mail : </label></p>
                        <input className="texto" type="text" name="email" value={user.email} placeholder="Digite seu melhor e-mail" onChange={valueInput}></input>
                        
                        <p className="texto"><label>Api key : </label></p>
                        <input className="texto" type="text" name="apikey" value={user.apikey} placeholder="Digite a chave de api gerada no Bling" onChange={valueInput}></input>
                        
                        <div>
                            <button type="submit" className="pesquisa-title-button">Alterar</button>
                        </div>
                    </form>


                </div>
            </div>
        </div>

    )
}