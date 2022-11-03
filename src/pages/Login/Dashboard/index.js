import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Context } from "../../../Context/AuthContext";
import api from "../../../config/configApi";
import { MenuProfile } from "../../../Componet/MenuProfile";
import { Menu } from "../../../Componet/Menu";



export const Dashboard = () => {

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

  return (
    <div>
      <MenuProfile />
      <div className="content">
        <Menu active="users" />
        <div className="wrapper">
          <div className="row">
            <div className="top-content-admin">
              <div className="title-content">
                <h1 className="sub-menu-title">Dashboard</h1>
              </div>
              <div className="sub-menu-title">
                <div className="sub-menu">
                  <div className="item-sub-menu">
                    <Link to='/login/alterar'><button type="button" className="pesquisa-title-button">Alterar</button></Link>
                  </div>
                  <div className="item-sub-menu">
                    <Link to='/login/senha'><button type="button" className="pesquisa-title-button">Alterar Senha</button></Link>
                  </div>
                  <div className="item-sub-menu">
                    <Link to="/" onClick={handleLogout}><button type="button" className="pesquisa-title-button">Sair</button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="alert-content-adm">
            {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
          </div>
          <div className="texto-wrapped">
          <p className="texto"><label>Nome : </label>{user.name}</p>
          <p className="texto"><label>E-mail : </label>{user.email}</p>
          <p className="texto"><label>Api key : </label>{user.apikey}</p>
          </div>
        </div>
      </div>

    </div >

  )
}