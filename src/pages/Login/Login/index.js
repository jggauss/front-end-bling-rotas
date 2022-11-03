
import React, { useContext, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom"
import { MenuProfile } from "../../../Componet/MenuProfile";
import api from "../../../config/configApi"
import { Context } from "../../../Context/AuthContext.js";

export const Login = () => {
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const { authenticated, signIn } = useContext(Context)
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const valueInput = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });



    const login = async (e) => {
        e.preventDefault()
        const headers = {
            'Content-Type': 'application/json',
            
        }



        await api.post('/login', user, { headers })
            .then((response) => {

                setStatus({
                    type: "success",
                    mensagem: "Login realizado com sucesso"
                })
                localStorage.setItem("token", response.data.token)

                signIn(true)
            })
            .catch(() => {
                setStatus({
                    type: "error",
                    mensagem: "Erro. Login falhou."
                })
            })




    }


    return (
        <div>
            <MenuProfile />
            <div className="content">
                <div className="wrapper">
                    <div className="banner-divide-imagem">
                        <div className="banner-tela-principal">
                            <img src="banner.jpg" alt="images/banner.jpg" />
                        </div>
                        <div className="banner-tela-principal">
                            <img src="banner3.jpg" alt="images/banner3.jpg" />
                        </div>
                    </div>
                    <div className="d-flex-login">
                        <div className="container-login">
                            <div className="wrapped-login">
                                <div className="title">
                                    <h1>Login</h1>
                                </div>
                                <div className="alert-content-adm">
                                    {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                                    {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
                                    {status.type === "success" ? (<Navigate to="/home" state={status} />) : ""}
                                </div>

                                <form onSubmit={login} className="form-login">
                                    <div className="row">
                                        <i className="fas fa-user"></i>
                                        <input type="text " name="email" placeholder="Digite seu melhor e-mail" onChange={valueInput}></input>
                                    </div>
                                    <div className="row">
                                        <i className="fa-solid fa-lock"></i>
                                        <input type="password" name="password" placeholder="Digite sua senha" onChange={valueInput}></input>
                                    </div>

                                    <div className="row button">
                                        <button type="submit" className="button-login">Login</button>
                                    </div>
                                    <div className="signup-link">
                                        <Link to='/login/cadastrar' className="link-pg-login">Cadastrar Usuário</Link>{" - "}
                                        <Link to='/recover-password' className="link-pg-login">Recuperar senha</Link>
                                    </div>

                                </form>
                            </div>
                        </div>

                        <div className="container-login">
                            <div className="wrapped-login">
                                <div className="title">
                                    <h1>Agilidade</h1>
                                </div>
                                <div className="form-login">
                                    <div className="texto-tela-principal">
                                        <p>Coloque suas regras e precifique os produtos no Bling testando</p>
                                    </div>
                                    <div className="texto-tela-principal">
                                        <p>Regras de preços personalizadas para cada loja</p>
                                    </div>
                                    <div className="texto-tela-principal">
                                        <p>Tela de rentabilidade por pedido</p>
                                    </div>
                                    <div className="texto-tela-principal">
                                        <p>Seus preços atualizados rapidamente</p>
                                    </div>

                                    <div className="signup-link">
                                        <Link to='#' className="link-pg-login">Contratar</Link>{" - "}
                                        <Link to='#' className="link-pg-login">Recuperar senha</Link>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}