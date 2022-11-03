import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import api from "../../config/configApi";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";
export const BuscaLojas = () => {
    const [lista, setLista] = useState([])
    var { state } = useLocation();
    const [page, setPage] = useState("")
    var [bloco, setBloco] = useState(0)
    const [lastPage, setLastPage] = useState("")
    var [totalPercent, setTotalPercent] = useState(0)
    var [total, setTotal] = useState(0)
    var [percentualev, setPercentualev] = useState(0)
    const [percent, setPercent] = useState({
        tamanho: 0,
        percent: 0
    })


    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const getLojas = async (page) => {
        setPercentualev(0)
        if (page === undefined) {
            page = 1
        }
        setPage(page)
        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.get("/lojas/lojas/" + page, headers)
            .then((response) => {
                setLista(response.data.lojas);
                setLastPage(response.data.lastPage)
            })
            .catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: "Não foram encontradas lojas cadastradas"
                    })
                } else {
                    setStatus({
                        type: "error",
                        mensagem: "Erro. Tente mais tarde"
                    })
                }
            })
    }
    useEffect(() => {
        getLojas()
    }, [])

    async function precificatodas() {

        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        const temp = await api.get('/lojas/lojas', headers)
        const dadosLojas = temp.data
        const tudo = await api.get('/produtos/produtos', headers)
        const todosProdutos = tudo.data
        var contador = 0
        for (let i = 0; i < dadosLojas.length; i++) {
            var codigoBling = dadosLojas[i].codigoBling

            var lojaCompleta = dadosLojas[i]
            for (let a = 0; a < todosProdutos.length; a++) {
                contador = contador + 1
                let multiplo = dadosLojas.length * todosProdutos.length
                let percentual = ((contador * 100) / multiplo)
                setTotal(multiplo)
                setTotalPercent(percentual)

                var produto = todosProdutos[a].codigo
                var parametros = {
                    produto: produto,
                    codigoBling: codigoBling,
                    loja: lojaCompleta,
                    produtoCompleto: todosProdutos[a]

                }
                await espera(50)
                await precificaLojaConta(parametros)

                async function espera(ms) {
                    return await new Promise((resolve) => {
                        setTimeout(resolve, ms);
                    });
                }
            }

        }

    }

    async function precificaLojaConta(parametros) {
       
        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await espera(50)
        async function espera(ms) {
            return await new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        await api.post('/produtoslojas/precificalojaconta/' + parametros.codigoBling, (parametros), headers)
            .then((response) => { })
            .catch((err) => {
            })
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
                                <h1 className="sub-menu-title">Lojas</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to='/buscalojas'><button type="button" className="pesquisa-title-button">Listar</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/criarloja'><button type="button" className="pesquisa-title-button">Criar Loja</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/precificar/todas'><button type="button" className="pesquisa-title-button">Precificar todas as Lojas</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="alert-content-adm">
                        {status.type === "error" ? <p className="alert-danger">{status.mensagem}</p> : ""}
                        {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
                    </div>
                    <table className="table-list">
                        <thead className="list-head">
                            <tr>
                                <th className="list-head-content">Id</th>
                                <th className="list-head-content">Nome</th>
                                <th className="list-head-content">Código</th>
                                <th className="list-head-content">Ação</th>

                            </tr>
                        </thead>

                        <tbody className="list-body">
                            {lista.map((linha) => (
                                <tr key={linha.id}>
                                    {linha.length > 0 ? linha : null}
                                    <td className="list-body-content">{linha.id}</td>
                                    <td className="list-body-content">{linha.name}</td>
                                    <td className="list-body-content">{linha.codigoBling}</td>
                                    <td className="list-body-content">

                                        <div className="list-body-content">
                                            <div className="list-body-content-separa">
                                                <Link to={"/buscaloja/" + linha.codigoBling} className="alert-success">Visualizar</Link >
                                                <Link to={"/precificar/" + linha.codigoBling + "/"+linha.name} className="alert-info">Precificar Loja</Link >
                                                <Link to={"/editarloja/" + linha.codigoBling} className="alert-primary">Editar</Link>
                                                <Link to={"/deletaloja/" + linha.codigoBling} className="alert-danger">Apagar</Link>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {page !== 1 ? <button type="button" onClick={() => getLojas(1)}>Primeira</button> : <button type="button" disabled>Primeira</button>}{" "}
                    {page !== 1 ? <button type="button" onClick={() => getLojas(page - 1)}>{page - 1}</button> : ""}{" "}
                    <button type="button" disabled>{page}</button>{" "}
                    {page + 1 <= lastPage ? <button type="button" onClick={() => getLojas(page + 1)}>{page + 1}</button> : ""}{""}
                    {page !== lastPage ? <button type="button" onClick={() => getLojas(lastPage)}>Última</button> : <button type="button" disabled>Última</button>}
                </div>
            </div>
        </div>
    )
}