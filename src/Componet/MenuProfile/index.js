import React from "react";
import { Link } from "react-router-dom";

export const MenuProfile = () => {
    return (
        <nav className="navbar">
            <div className="bars">
                <i className="fa-solid fa-bars"></i>
                <img src= "/logo.png" alt="images/logo.png"className="logo"/>
            </div>
            <div className="item">
                <Link to='/dashboard'  className="fas fa-user"><p className="area-cliente">Área do cliente</p></Link>
            </div>
        </nav>

    )

}