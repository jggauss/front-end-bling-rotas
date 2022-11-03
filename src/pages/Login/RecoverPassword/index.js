import api from "../../../config/configApi";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom"



export const RecoverPassword = (e) => {

    const [user, setUser] = useState({
        email: ""
    })

    const [status, setStatus] = useState({
        type: "",
        mensagem: "",
        loading: false
    })

    const valueInput = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });

    const recoverPass = async e => {
        e.preventDefault()
        const headers = {
            'Content-Type': 'application/json'
        }
        await api.post('login/recover-password', user, headers)
            .then((response) => {
                setStatus({
                    type: "success",
                    mensagem: response.data.mensagem
                })
            })
            .catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "error",
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type: "error",
                        mensagem: "Tente mais tarde"
                    })
                }
            })

    }


    return (
        <div>
            <div className="d-flex">
                <div className="container-login">
                    <div className="wrapped-login">
                        <div className="title">
                            <h1>Recupera Senha</h1>
                        </div>

                        <div className="alert-content-adm">
                            {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                            {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
                            {status.type === "success" ? (<Navigate to="/" state={status} />) : ""}
                        </div>
                        <form onSubmit={recoverPass} className="form-login">
                            <div className="row">
                                <label>E-mail</label>
                                <input type="text " name="email" placeholder="Digite seu melhor e-mail" onChange={valueInput} ></input><br />
                            </div>
                            <div className="row button">
                                <button type="submit" className="button-login">Enviar</button>
                            </div>
                            <div className="signup-link">
                                <Link to='/login/cadastrar' className="link-pg-login">Cadastrar</Link>
                                - Lembrou a senha <Link to='/' className="link-pg-login">Clique aqui</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}