import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import api from "../../config/configApi";

export const BuscaProdutosCustoZero = () => {
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const [dados, setDados] = useState([]);
    useEffect(() => {
        const getProdutos = async () => {
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.get("/produtos/zerados", headers)
                .then((response) => {
                    const dadosBrutos = (response.data)

                    setDados(dadosBrutos)
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
        getProdutos()
    }, [])
    return (
        <>
            <h1>Produtos com custo zero</h1>
            <p>Estes produtos estão com seus custos zerados no Bling. Para que o sistema calcule o preço de venda é nescessário que o custo no bling esteja preenchido corretamente. Não foi calculado preço de venda. Se existia um preço anterior no seu Bling ele foi apenas repetido neste sistema sem alteração</p>
            <Link to='/home'>Home </Link>{" / "}
            <Link to='/pegaTodosProdutos'>Busca Todos os Produtos </Link>{" / "}
            <Link to='/buscalojas'>Listar Lojas</Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
            <hr />
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}
            <table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Id no Bling</th>
                        <th>Nome</th>
                        <th>SKU</th>
                        <th>Situação</th>
                        <th>Preço de Custo</th>
                        <th>Marca</th>
                        <th>Fornecedor</th>
                    </tr>
                </thead>

                <tbody>
                    {dados.map((linha) => (
                        <tr key={linha.codigo}>
                            {linha.length > 0 ? linha : null}
                            <td>{linha.codigo}</td>
                            <td>{linha.idBling}</td>
                            <td>{linha.name}</td>
                            <td>{linha.codigo}</td>
                            <td>{linha.situacao}</td>
                            <td>{linha.precoCusto}</td>
                            <td>{linha.marca}</td>
                            <td>{linha.nomeFornecedor}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}