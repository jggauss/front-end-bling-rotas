import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

import api from "../../config/configApi";

export const VerProduto = () => {
    var id = useParams()
    
    const [status, setStatus] = useState({
        type:  "",
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
            api.get("/produtos/produto/" + od,headers)

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
        <>
            <h1>Produto</h1>
            <Link to='/home'>Home </Link>{" / "}
            
            <Link to='/pegaTodosProdutos'>Busca Todos os Produtos </Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}

            
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}
            
            <hr />
            SKU : {dados.codigo}
            <br />
            Nome : {dados.name}
            <br />
            Id no Bling : {dados.idBling}
            <br />
            Situação : {dados.situacao}
            <br />
            Preço de custo : {dados.precoCusto}
            <br />
            Marca : {dados.marca}
            <br />
            Fornecedor : {dados.nomeFornecedor}
            <br />
            <hr/>
        </>

    )
}