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
            <h1>Recuperar Senha</h1>


            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? (<Navigate to="/" state={status} />) : ""} 

            <form onSubmit={recoverPass}>

                <label>E-mail</label>
                <input type="text " name="email" placeholder="Digite seu melhor e-mail" onChange={valueInput} ></input><br />

                <button type="submit">Enviar</button>
                <br />

                <Link to='/login/cadastrar'>Cadastrar</Link>
                - Lembrou a senha<Link to='/'>Clique aqui</Link>

            </form>

        </div>

    )
}