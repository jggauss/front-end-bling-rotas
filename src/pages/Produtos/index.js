import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import api from "../../config/configApi";
import AsyncSelect from 'react-select/async';
import { callApi } from "../../services/servCallCategorias";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";
import { isDisabled } from "@testing-library/user-event/dist/utils";
export const MostraProdutos = () => {
    var { state } = useLocation();
    var [marca, setMarca] = useState('Selecione Marca')
    var categoria = 'g'
    const [data, setData] = useState([])
    const [page, setPage] = useState("")
    var [pesquisa, setPesquisa] = useState("")
    var [bloco, setBloco] =useState(0)
    var[percent,setPercent] = useState(0)
    const [lastPage, setLastPage] = useState("")
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    var [mensagem, setMensagem] = useState("")

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
    }, [mostra])

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

    // async function buscaProdutosBling() {
    //     const valueToken = localStorage.getItem("token")

    //     //pega os produtos ativos e depois os inativos

    //     var situacao = ""
    //     let  contaBloco = 0
    //     for (let sit = 0; sit < 2; sit++) {
    //         if (sit === 0) { situacao = "A" }
    //         if (sit === 1) { situacao = "I" }

    //         //pega 100 produtos de cada vez 100 vezes até o break
    //         for (var i = 0; i < 100; i++) {
    //             contaBloco= contaBloco+1
    //             setBloco(contaBloco)
    //             const headers = {
    //                 'headers': {
    //                     'Authorization': 'Bearer ' + valueToken
    //                 }
    //             }
    //             var dados = {
    //                 situacao: situacao,
    //                 i: i
    //             }
    //             try {
    //                 const cemProdutos = await api.post('/produtos/buscaprodutosbling', (dados), headers)
    //                 const todosProdutos = cemProdutos.data
    //                 await precificaSalva(todosProdutos)
    //                 if(todosProdutos.length<99){break}
    //             } catch (error) {
    //             }
    //         }
    //     }
    //     setStatus({
    //         type: "success",
    //         mensagem: "Todos os produtos da loja foram baixados do Bling"
    //     })
    
    // }

    async function precificaSalva(todosProdutos) {
        //aqui monta  e salva
        
        let tamanho = todosProdutos.length
        for (let a = 0; a < tamanho; a++) {
            setPercent(a)
            const dadosProduto= todosProdutos[a]
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.post('/produtos/encontraesalva',(dadosProduto), headers)
                .then(() => {})
                .catch(() => { })
        }
    }

    async function precificaSelecionados() {
        console.log("olha ai ")
        setStatus({
            type: "success",
            mensagem: "Todos os produtos tiveram o custo atualizados no Bling, precificados por loja e seus preços atualizados em cada loja no Bling",
        });
        
        var lista = localStorage.getItem("listaSelecionados", listaSelecionados).split(",")
        var valueToken = localStorage.getItem("token")
        
        
        

            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
             await api.post("/produtos/precifica/selecionado", lista, headers)
             .then(()=>{
             })
             .catch(()=>{})
             
            
              
        
        setStatus({
            type: "success",
            mensagem: "Todos os produtos tiveram o custo atualizados no Bling, precificados por loja e seus preços atualizados em cada loja no Bling",
        });
        
        
        console.log("sai aqui")
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
                                <h1 className="sub-menu-title" >Produtos</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to='/produtos/zerados'><button type="button" className="pesquisa-title-button">Produtos com custo zero</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/confirmabuscarprodutos'><button type="button" className="pesquisa-title-button">Busca Produtos no Bling</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to="#" onClick={() => precificaSelecionados()}><button type="button" className="pesquisa-title-button">Precifica Selecionados</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="alert-content-adm">
                        {bloco>0?<p className="alert-info">Blocos de 100 produtos ativos e inativos baixados : {bloco} - Percentual baixado deste bloco :{percent+1} %</p>:bloco===100?<p className="alert-success">Todos os produtos foram baixados :{percent+1} %</p>:""}
                        {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                        {status.type === "success" ? <p className="alert-info"> {status.mensagem}</p> : ""}
                        {status.type === "exsuccess" ? <p className="alert-success"> {status.mensagem}</p> : ""}
                    </div>
                    <div className="pesquisa-content">
                        <div className="seleciona-wrapped">
                            <label className="seleciona-title">Marca :  </label>
                            <div className="seleciona-caixa-selecao">
                                <div className="seleciona-caixa">
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={callApi}
                                        isSearchable={false}
                                        options={isDisabled}
                                        onChange={(e) => setMarca(e.value)}
                                        value={setMarca}
                                        defaultOptions
                                    />
                                </div>
                                <p className="pesquisa-title">{marca}</p>

                            </div>
                        </div>
                        <div className="pesquisa-content">
                            <label className="pesquisa-title">Pesquisa :</label>
                            <input className="pesquisa-title-input" type="text" name="pesquisa" placeholder="Pesquisa por nome, SKU ou marca" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}></input>

                            <Link to="#" onClick={() => limparPesquisas()}><button type="button" className="pesquisa-title-button">Limpar pesquisas</button></Link><br />
                        </div>
                    </div>

                    <table className="table-list">
                        <thead className="list-head">
                            <tr>
                                <th><input name="marcaLinha" type="checkbox" /></th>
                                <th className="list-head-content">SKU</th>
                                <th className="list-head-content">Nome</th>
                                <th className="list-head-content">Preço de custo</th>
                                <th className="list-head-content">Marca</th>
                                <th className="list-head-content">Situação</th>
                                <th className="list-head-content">Categoria</th>
                                <th className="list-head-content">Fabricante</th>
                                <th className="list-head-content">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="list-body">
                            {data.map((produtos) => (
                                <tr key={produtos.codigo}>
                                    {produtos.length > 0 ? data : null}
                                    <td className="list-body-content"><input value={produtos.codigo} name="marcaLinha" type="checkbox" onChange={montaArray} /></td>
                                    <td className="list-body-content">{produtos.codigo}</td>
                                    <td className="list-body-content">{produtos.name}</td>
                                    <td className="list-body-content">{produtos.precoCusto.replace(".", ",")}</td>
                                    <td className="list-body-content">{produtos.marca}</td>
                                    <td className="list-body-content">{produtos.situacao}</td>
                                    <td className="list-body-content">{produtos.nameCategoria}</td>
                                    <td className="list-body-content">{produtos.nomeFornecedor}</td>
                                    <td className="list-body-content">
                                        <div className="list-body-content">
                                            <Link to={"/produto/" + produtos.codigo} className="alert-info">Visualizar</Link>
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
                </div>
            </div>
        </div>
    )
}