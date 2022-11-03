import React from "react";
import { Link } from "react-router-dom";

export const Menu = () => {
    return (
        <div className="sidebar">
            <Link to='/home' className="sidebar-nav">Home </Link>
            <Link to='/produtos'className="sidebar-nav">Produtos</Link>
            <Link to='/buscalojas'className="sidebar-nav">Lojas</Link>
            <Link to='/pedidos'className="sidebar-nav">Pedidos</Link>
        </div>
    )

}