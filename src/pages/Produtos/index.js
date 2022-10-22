import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import api from "../../config/configApi";
import AsyncSelect from 'react-select/async';
import { callApi } from "../../services/servCallCategorias";

export const MostraProdutos = () => {
    var { state } = useLocation();
    var [marca, setMarca] = useState('Selecione Marca')
    var categoria = 'g'
    const [data, setData] = useState([])
    const [page, setPage] = useState("")
    var [pesquisa, setPesquisa] = useState("")
    const [lastPage, setLastPage] = useState("")
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });

    
    let listaSelecionados = []
    localStorage.setItem("listaSelecionados", listaSelecionados)
    let mostra = marca + pesquisa
    const getProdutos = async (page) => {
        if (page === undefined) {
            page = 1
        }
               
        setPage(page)
        if (pesquisa.length === 0) {
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.get("/produtos/produtos/" + page + "/" + marca + "/" + categoria, headers)
                .then((response) => {
                    setPage(page)
                    setData(response.data.produtos)
                    setLastPage(response.data.lastPage)
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem
                        })
                    } else {
                        setStatus({
                            type: "error",
                            mensagem: "Erro. Tente mais tarde"
                        })
                    }
                })
        }
        if (pesquisa.length > 0) {
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.get("/produtos/produtos/" + page + "/" + pesquisa, headers)
                .then((response) => {
                    setPage(page)
                    setData(response.data.produtosPorLoja)
                    setLastPage(response.data.lastPage)
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem
                        })
                    } else {
                        setStatus({
                            type: "error",
                            mensagem: "Erro. Tente mais tarde"
                        })
                    }
                })
        }
    }
    useEffect(() => {
        
        getProdutos()
    },[mostra])

    function limparPesquisas() {
        setMarca("Selecione Marca")

        //setTipo("Todos")
        setPesquisa("")
        //'input:checkbox'.prop("checked", false)
    }

    function montaArray(e) {
        var produtoid = e.target.value
        var posicao = listaSelecionados.indexOf(produtoid)
        if (posicao === -1) {
            listaSelecionados.push(produtoid)
        } else { listaSelecionados.splice(posicao, 1) }
        localStorage.setItem("listaSelecionados", listaSelecionados)
        return listaSelecionados
    }
    async function buscaProdutos() {
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.post('/produtos/pegatodosprodutos', headers)
            .then(() => {
            })
            .catch(() => {
            })
        
    }

    async function precificaSelecionados(){
        var lista = localStorage.getItem("listaSelecionados",listaSelecionados).split(",")
        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers':{
            'Authorization':'Bearer '+ valueToken
            }
        }
        await api.post("/produtos/precifica/selecionado",lista, headers)
        setStatus({
            type: 'success',
            mensagem: "Produtos atualizados"
        })

        
    }



    return (
        <>
            <h1>Produtos</h1>
            <Link to='/home'>Home </Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
            <Link to="#" onClick={() => buscaProdutos()}><button type="button">Busca produtos no Bling</button></Link>
            <Link to="#" onClick={() => precificaSelecionados()}><button type="button">Precifica selecionados</button></Link>

            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}

            <form>
                <label>Pesquisa</label>
                <input type="text" name="pesquisa" placeholder="Pesquisa por nome, SKU ou marca" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}></input>
            </form>
            <Link to="#" onClick={() => limparPesquisas()}><button type="button">Limpar pesquisas</button></Link><br />

            <label>Marca : {marca} </label>
            <AsyncSelect
                cacheOptions
                loadOptions={callApi}
                onChange={(e) => setMarca(e.value)}
                value={setMarca}
                defaultOptions
            />


            <table>
                <thead>
                    <tr>
                        <th><input name="marcaLinha" type="checkbox" /></th>
                        <th>SKU</th>
                        <th>Nome</th>
                        <th>Preço de custo</th>
                        <th>Marca</th>
                        <th>Situação</th>
                        <th>Categoria</th>
                        <th>Fabricante</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((produtos) => (
                        <tr key={produtos.codigo}>
                            {produtos.length > 0 ? data : null}
                            <td><input value={produtos.codigo} name="marcaLinha" type="checkbox" onChange={montaArray} /></td>
                            <td>{produtos.codigo}</td>
                            <td>{produtos.name}</td>
                            <td>{produtos.precoCusto}</td>
                            <td>{produtos.marca}</td>
                            <td>{produtos.situacao}</td>
                            <td>{produtos.nameCategoria}</td>
                            <td>{produtos.nomeFornecedor}</td>
                            <td>
                                <div>
                                    <Link to={"/produto/" + produtos.codigo}>Visualizar</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />
            {page !== 1 ? <button type="button" onClick={() => getProdutos(1)}>Primeira</button> : <button type="button" disabled>Primeira</button>} {" "}
            {page !== 1 ? <button type="button" onClick={() => getProdutos(page - 1)}>{page - 1}</button> : ""} {" "}
            <button type="button" disabled>{page}</button>{" "}
            {page + 1 <= lastPage ? <button type="button" onClick={() => getProdutos(page + 1)}>{page + 1}</button> : ""} {""}
            {page !== lastPage ? <button type="button" onClick={() => getProdutos(lastPage)}>Última</button> : <button type="button" disabled>Última</button>}
        </>

    )
}