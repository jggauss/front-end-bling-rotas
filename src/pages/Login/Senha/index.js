import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Context } from "../../../Context/AuthContext";
import api from "../../../config/configApi";
import * as yup from 'yup';
import { MenuProfile } from "../../../Componet/MenuProfile";
import { Menu } from "../../../Componet/Menu";



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
                        password: ""

                    })
                })
                .catch((erro) => { console.log(erro) })
        }
        getuser()
    }, [])


    const { handleLogout } = useContext(Context)

    const alteraSenha = async (e) => {
        e.preventDefault()

        if (!(await validate())) return



        if (user.password !== user.password2) {
            setStatus({
                type: "error",
                mensagem: "Erro. Senhas devem ser iguais"
            })
            return

        }


        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.put('/login/senha', user, headers)

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


    async function validate() {
        let schema = yup.object().shape({
            password: yup.string("Nescessário preencher a senha").required("Nescessário preencher a senha").min(6, "Erro. A senha deve ter mais do que 6 caracteres"),



        });
        try {
            await schema.validate({
                password: user.password,

            })
            return true
        } catch (err) {
            setStatus({
                type: 'error',
                mensagem: err.errors
            })
            return false
        }
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
                                <h1 className="sub-menu-title">Alterar Senha</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to='/login/alterar'><button type="button" className="pesquisa-title-button">Alterar</button>  </Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to="/" onClick={handleLogout}><button type="button" className="pesquisa-title-button">Sair</button>  </Link>
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
                        <form onSubmit={alteraSenha} className="texto-wrapped">

                            <p className="texto"><label>Nome : </label>{user.name}</p>

                            <p className="texto"><label>E-mail : </label>{user.email}</p>

                            <label className="texto">Senha</label>
                            <input className="texto" type="password" name="password" placeholder="Digite sua senha" onChange={valueInput}></input><br />
                            <label className="texto">Repita a Senha</label>
                            <input className="texto" type="password" name="password2" placeholder="Repetir a senha" onChange={valueInput}></input><br />

                            <button type="submit" className="pesquisa-title-button">Alterar</button>
                        </form>


                    </div>
                </div>
            </div >

            )
}