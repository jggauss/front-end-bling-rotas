import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";

import api from "../../config/configApi";

export const VerProduto = () => {
    var id = useParams()

    const [status, setStatus] = useState({
        type: "",
        mensagem: "",
    });
    const [dados, setDados] = useState([]);

    useEffect(() => {

        const getProduto = () => {
            var od = id.id
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            api.get("/produtos/produto/" + od, headers)

                .then((response) => {
                    setDados(response.data)

                })

                .catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: "error",
                            mensagem: err.response.data.mensagem,
                        });
                    } else {
                        setStatus({
                            type: "error",
                            mensagem: "Erro. Tente mais tarde",
                        });
                    }
                })

        }
        getProduto()
    }, [id.id])


    return (
        <div>
            <MenuProfile />
            <div className="content">
                <Menu active="users" />
                <div className="wrapper">
                    <div className="row">
                        <div className="top-content-admin">
                            <div className="title-content">
                                <h1 className="sub-menu-title">Produto</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to='/pegaTodosProdutos'><button type="button" className="pesquisa-title-button">Busca todos Produtos no Bling</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/produtos/zerados'><button type="button" className="pesquisa-title-button">Produtos com Custo Zero</button></Link>
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
                        <p className="texto">SKU : {dados.codigo}</p>
                        <p className="texto" >Nome : {dados.name}</p>
                        <p className="texto">Id no Bling : {dados.idBling}</p>
                        <p className="texto">Situação : {dados.situacao}</p>
                        <p className="texto">Preço de custo : {dados.precoCusto}</p>
                        <p className="texto">Marca : {dados.marca}</p>
                        <p className="texto ">Fornecedor : {dados.nomeFornecedor}</p>
                    </div>
                </div>
            </div>
        </div>

    )
}