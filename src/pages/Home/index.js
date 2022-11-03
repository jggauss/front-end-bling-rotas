import React, { useState } from "react";
import { useLocation } from "react-router-dom"
import { Menu } from "../../Componet/Menu";

import { MenuProfile } from "../../Componet/MenuProfile";
export const Home = () => {
  var { state } = useLocation();
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });
  return (
    <div>
      <MenuProfile />
      <div className="content">
        <Menu active="users"/>
        <div className="wrapper">
          <div className="row">
            <div className="to-content-adim">
              <div className="title-content">
                <h1>Home</h1>
              </div>
              {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
              {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}