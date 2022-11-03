import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import api from "../../config/configApi";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";
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
        <div>
            <MenuProfile />
            <div className="content">
                <Menu active="users" />
                <div className="wrapper">
                    <div className="row">
                        <div className="top-content-admin">
                            <div className="title-content">
                                <h1 className="sub-menu-title">Produtos com custo zero</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to='/pegaTodosProdutos'><button type="button" className="pesquisa-title-button">Busca todos Produtos no Bling</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/buscalojas'><button type="button" className="pesquisa-title-button">Listar Lojas</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>Estes produtos estão com seus custos zerados no Bling. Para que o sistema calcule o preço de venda é nescessário que o custo no bling esteja preenchido corretamente. Não foi calculado preço de venda. Se existia um preço anterior no seu Bling ele foi apenas repetido neste sistema sem alteração</p>

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
                </div>
            </div>
        </div>

    )
}