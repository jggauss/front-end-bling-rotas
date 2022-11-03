import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import { ExibeData } from "../../services/exibeData";
import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import { callApi } from "../../services/servCallCategorias";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";

export const ProdutosLoja = () => {
    var { state } = useLocation();
    const { loja, name } = useParams()
    var [marca, setMarca] = useState('Selecione Marca')

    var [data, setData] = useState([])
    var [listaSel, setListaSel] = useState([])
    var [marcado, setMarcado] = useState(false)
    var [percent, setPercent] = useState(0)
    var [market, setMarket] = useState(name)
    var [idLoja, setIdLoja] = useState("")
    var [tipo, setTipo] = useState("Todos")
    var [promocao, setPromocao] = useState("Todos")
    var [desconto, setDesconto] = useState("Todos")
    var [situacao, setSituacao] = useState("Ativo")
    var [pesquisa, setPesquisa] = useState("")

    const [page, setPage] = useState("")
    const [lastPage, setLastPage] = useState("")

    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const options = [
        { value: 'Simples', label: 'Simples' },
        { value: 'Composto', label: 'Composto' },
        { value: 'Todos', label: 'Todos' }
    ]
    const escolhePromocao = [
        { value: 'Todos', label: 'Todos' },
        { value: 'Promocao', label: 'Promoção' }
    ]
    const escolheDesconto = [
        { value: 'Todos', label: 'Todos' },
        { value: 'Desconto', label: 'Desconto/Acréscimo' }
    ]
    const escolheSituacao = [
        { value: 'Todos', label: 'Todos' },
        { value: 'Ativo', label: 'Ativo' },
        { value: 'Inativo', label: 'Inativo' }
    ]


    var mostra = marca + tipo + pesquisa + promocao + situacao + marcado + desconto
    let listaSelecionados = []
    localStorage.setItem("listaSelecionados", listaSelecionados)
    const getProdutos = async (page) => {
        mostra = marca + tipo + pesquisa + promocao + situacao + marcado
        if (page === undefined) {
            page = 1
        }
        setPage(page)
        setMarket(name)
        setIdLoja(loja)


        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/produtoslojas/produtosloja/" + page + "/" + loja + "/" + marca + "/" + tipo + "/" + promocao + "/" + situacao + "/" + desconto, headers)
            .then((response) => {
                setData(response.data.produtosPorLoja)
                setLastPage(response.data.lastPage)
                var listaA = response.data.produtosPorLoja
                var listaB = []
                for (let i = 0; i < listaA.length; i++) {
                    listaB.push(listaA[i].produtoid)
                }

                setListaSel(listaB)
                // if (listaA.length === 0) {
                //     setStatus({
                //         type: "error",
                //         mensagem: "Nenhum produto encontrado para esta loja"
                //     });
                // }
                
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: "Erro. Nenhum produto encontrado. Tente mais tarde"
                    })
                } else {
                    setStatus({
                        type: "error",
                        mensagem: "Erro. Tente mais tarde"
                    })
                }
            })

        if (pesquisa.length > 0) {
            await api.get("/produtoslojas/produtosloja/" + page + "/" + loja + "/" + pesquisa, headers)
                .then((response) => {
                    setData(response.data.produtosPorLoja)
                    setLastPage(response.data.lastPage)
                    if (data.lenght === 0) {
                        setStatus({
                            type: "error",
                            mensagem: "Nenhum produto encontrado"
                        });
                    }
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

    function montaArray(e) {
        var produtoid = e.target.value
        var posicao = listaSelecionados.indexOf(produtoid)
        if (posicao === -1) {
            listaSelecionados.push(produtoid)
        } else { listaSelecionados.splice(posicao, 1) }
        localStorage.setItem("listaSelecionados", listaSelecionados)
        return listaSelecionados
    }

    
    async function salvaOferta(dadosOferta) {
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.put('/produtoslojas/produtoloja/' + loja + "/" + dadosOferta.produtoid, dadosOferta, headers)
            .then((response) => {
                setStatus({
                    type: "success",
                    mensagem: response.data.mensagem,
                });
            })
            .catch((err) => {
                if (err.response) {
                    setStatus({
                        type: "error",
                        mensagem: err.response.data.mensagem,
                    });
                }
            })
            
    }

    async function apagarPromocao(loja) {
        let listaSelecionados = localStorage.getItem('listaSelecionados').split(',')
        for (let i = 0; i < listaSelecionados.length; i++) {
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.get("/produtoslojas/produtoloja/" + loja + "/" + listaSelecionados[i] + "/" + name, headers)
                .then((produto) => {
                    let dadosOferta = {
                        id: produto.data.id,
                        idLojaVirtual: produto.data.idLojaVirtual,
                        idProdutoLoja: produto.data.idProdutoLoja,
                        lojaid: produto.data.lojaid,
                        marca: produto.data.marca,
                        name: produto.data.name,
                        nameCategoria: produto.data.nameCategoria,
                        precoVenda: produto.data.precoVenda,
                        produtoid: produto.data.produtoid,
                        tipoSimplesComposto: produto.data.tipoSimplesComposto,
                        precoOferta: null,
                        inicioOferta: null,
                        inicioOfertaHora: null,
                        fimOferta: null,
                        fimOfertaHora: null
                    }
                   const temp1 = async () => await salvaOferta(dadosOferta)
                   temp1()
                    const dadosPrecificaSel = {
                        produtoid: listaSelecionados[i],
                        loja: loja
                    }
                    const temp2 = async() => await precificaSel(dadosPrecificaSel)
                    temp2()

                }).catch((erro) => { console.log(erro) })
               
        }





        return setStatus({
            type: "exsuccess",
            mensagem: "feito response.data.mensagem",
        })
    }

    async function apagarDescontoAcrescimo(loja) {
        let listaSelecionados = localStorage.getItem('listaSelecionados').split(',')
        for (let i = 0; i < listaSelecionados.length; i++) {
            let dadosOferta = {
                descontoPercent: 0,
                descontoValor: 0,
                acrescimoPercent: 0,
                acrescimoValor: 0,
                produtoid: listaSelecionados[i]
            }
            salvaOferta(dadosOferta)
            const dadosPrecificaSel = {
                produtoid: listaSelecionados[i],
                loja: loja
            }
            await precificaSel(dadosPrecificaSel)

        }
        return setStatus({
            type: "exsuccess",
            mensagem: "feito response.data.mensagem",
        });
    }
    async function precificaSel(dados) {
        const produtoid = dados.produtoid
        const loja = dados.loja
        
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        async function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        await sleep(350);
        await api.post('produtoslojas/precificaumproduto/' + produtoid + "/" + loja, headers)
            .then((response) => {
                console.log("oi salvei no tabelaprodutosloja e vou mandar para o bling abaixo")
                console.log(response)
                
                enviaUmPreco(produtoid)
                return setStatus({
                    type: "exsuccess",
                    mensagem: response.data.mensagem,
                });

            })
            .catch((erro) => {
                return setStatus({
                    type: "error",
                    mensagem: erro.response.data.mensagem,
                });
            })
            

    }

    function limparPesquisas() {
        setMarca("Selecione Marca")
        setSituacao("Ativo")
        setTipo("Todos")
        setPromocao("Todos")
        setDesconto("Todos")
        setPesquisa("")
        getProdutos()
    }
    async function enviaUmPreco(produtoid) {
        console.log("vou enviar este produto " + produtoid)
        setStatus({
            type: "success",
            mensagem: "Produto enviado",
        });
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        async function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        await sleep(350);
        await api.put('produtoslojas/enviaumproduto/' + produtoid + "/" + idLoja, headers)
        .then((response)=>{console.log(response)})
        .catch((err)=>{console.log(err)})
        
    }

    async function enviarSelecionados(idLoja) {
        setStatus({
            type: "success",
            mensagem: "Enviando produtos",
        });
        let listaSelecionados = localStorage.getItem('listaSelecionados').split(',')
        var totalLista = listaSelecionados.length

        for (let i = 0; i < listaSelecionados.length; i++) {
            var percentual = (((i + 1) * 100) / totalLista).toFixed(1)
            setPercent(percentual)

            await enviaUmPreco(listaSelecionados[i])
           
            async function sleep(ms) {
                return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }
            await sleep(350);


        }
        setStatus({
            type: "success",
            mensagem: "Produtos selecionados enviados",
        });
    }

    async function enviaTodos(idLoja) {
        setStatus({
            type: "success",
            mensagem: "Enviando produtos. Este processo pode demorar alguns minutos",
        });
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.get('produtoslojas/produtosloja/pesquisa/' + idLoja, headers)
            .then((listaProdutos) => {
                async function rodaEnviarTodos() {
                    var totalLista = listaProdutos.data.length
                    for (let i = 0; i < listaProdutos.data.length; i++) {
                        var percentual = (((i + 1) * 100) / totalLista).toFixed(1)
                        setPercent(percentual)
                        enviaUmPreco(listaProdutos.data[i].produtoid)

                        function sleep(ms) {
                            return new Promise((resolve) => {
                                setTimeout(resolve, ms);
                            });
                        }
                        await sleep(350);
                    }
                }
                rodaEnviarTodos()
                setStatus({
                    type: "success",
                    mensagem: "Todos os produtos enviados",
                });
            })
            .catch(() => { })
    }
    function marcaTodos(e) {
        var verificaLista = localStorage.getItem("listaSelecionados")

        if (verificaLista.length === 0) {

            localStorage.setItem("listaSelecionados", e)

        } else {

            localStorage.setItem("listaSelecionados", "")


        }


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
                                <h1>Produtos por Loja</h1>
                            </div>

                        </div>
                    </div>

                    <div className="alert-content-adm">
                        {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                        {status.type === "errorVolta" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                        {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
                        {status.type === "exsuccess" ? (<Navigate to={'/buscaloja/' + idLoja} state={status} />) : ""}
                    </div>

                    {/* {percent > 0 ? <span>Percentual preços atualizados no bling {percent} %</span> : ""}
                    {percent === 100 ? " Processo finalizado" : " Salvando dados"} */}

                    <h2>Loja : {market} - {idLoja}</h2>
                    <div className="sub-menu-title">
                        <div className="sub-menu">
                            <Link to={'/produtos/promocao/' + loja + "/" + market}><button type="button" className="pesquisa-title-button">Aplicar Promoção</button></Link>
                            <Link to={'/produtos/descontos/' + loja + "/" + market}><button type="button" className="pesquisa-title-button">Aplicar Desconto/Acréscimo</button></Link>
                            <Link to="#" onClick={() => apagarPromocao(loja)}><button type="button" className="pesquisa-title-button">Apagar Promoção</button></Link>
                            <Link to="#" onClick={() => apagarDescontoAcrescimo(loja)}><button type="button" className="pesquisa-title-button">Apagar Desconto/Acréscimo</button></Link>
                            <Link to="#" onClick={() => enviarSelecionados(idLoja)}><button type="button" className="pesquisa-title-button">Enviar preços selecionados</button></Link>
                            <Link to="#" onClick={() => enviaTodos(idLoja)}><button type="button" className="pesquisa-title-button">Enviar preços de todos os produtos da loja</button></Link>
                        </div>
                    </div>
                    <br />
                    <div className="pesquisa-content">
                        <div className="seleciona-wrapped">
                            <div className="caixa-selecao-juntas">
                                <div className="caixa-selecao-separada">
                                    <label className="seleciona-title">Marca : {marca} </label>
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={callApi}
                                        isSearchable={false}
                                        onChange={(e) => setMarca(e.value)}
                                        value={"Selecione Marca"}
                                        defaultOptions
                                    />

                                    <label className="seleciona-title">Tipo :{tipo}</label>
                                    <Select options={options}
                                        onChange={(e) => setTipo(e.value)}
                                        isSearchable={false}
                                        value={"Todos"} />
                                    <label className="seleciona-title">Listar produtos por situacao:{situacao}</label>
                                    <Select options={escolheSituacao}
                                        onChange={(e) => setSituacao(e.value)}
                                        isSearchable={false}
                                        value={"Todos"} />
                                </div>
                                <div className="caixa-selecao-separada">
                                    <label className="seleciona-title">Listar produtos em promoção :{promocao}</label>
                                    <Select options={escolhePromocao}
                                        onChange={(e) => setPromocao(e.value)}
                                        isSearchable={false}
                                        value={"Todos"} />
                                    <label className="seleciona-title">Listar produtos com Desconto/Acréscimo:{situacao}</label>
                                    <Select options={escolheDesconto}
                                        onChange={(e) => setDesconto(e.value)}
                                        isSearchable={false}
                                        value={"Todos"} />

                                </div>
                            </div>
                            <div className="caixa-selecao-juntas-pesquisa">
                                <div className="pesquisa-wrapped">
                                    <label className="pesquisa-title">Pesquisa</label>
                                    <input className="pesquisa-title-input" type="text" name="pesquisa" placeholder="Pesquisa por nome, SKU ou marca" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}></input>
                                </div>
                                <Link to="#" onClick={() => limparPesquisas()}><button type="button" className="pesquisa-title-button">Limpar Pesquisas</button></Link>
                            </div>
                        </div>
                    </div>
                    <table className="table-list">
                        <thead className="list-head">
                            <tr>
                                <th>{marcado}</th>
                                {/* <th><input name="marcaLinha" type="checkbox"  onChange={(e)=>marcaTodos(listaSel)}/></th> */}
                                <th className="list-head-content">SKU</th>
                                <th className="list-head-content">Nome</th>
                                <th className="list-head-content">Marca</th>
                                <th className="list-head-content">Situação</th>
                                {/* <th>Categoria</th> */}
                                <th className="list-head-content">Tipo</th>
                                <th className="list-head-content">Preço de venda</th>
                                <th className="list-head-content">Preço de promoção</th>
                                <th className="list-head-content">Desconto</th>
                                <th className="list-head-content">Acréscimo</th>
                                <th className="list-head-content">Início promoção</th>
                                {/* <th>Hora Início promoção</th> */}
                                <th className="list-head-content">Fim promoção</th>
                                {/* <th>Hora Fim promoção</th> */}
                                <th className="list-head-content">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="list-body">
                            {data.map((produtos) => (
                                <tr key={produtos.produtoid}>
                                    {produtos.lenght > 0 ? produtos : null}

                                    <td className="list-body-content"><input value={produtos.produtoid} name="marcaLinha" type="checkbox" onChange={montaArray} /></td>
                                    <td className="list-body-content">{produtos.produtoid}</td>
                                    <td className="list-body-content">{produtos.name}</td>
                                    <td className="list-body-content">{produtos.marca}</td>
                                    <td className="list-body-content">{produtos.situacao}</td>
                                    {/* <td>{produtos.nameCategoria}</td> */}
                                    <td className="list-body-content">{produtos.tipoSimplesComposto}</td>
                                    <td className="list-body-content">{produtos.precoVenda.replace('.', ',')}</td>

                                    <td className="list-body-content">{(produtos.precoOferta === null ? '' : produtos.precoOferta.replace('.', ','))}</td>
                                    <td className="list-body-content">{produtos.descontoPercent > 0 ? produtos.descontoPercent.replace('.', ',') + " %" : (produtos.descontoValor > 0 ? "R$ " + produtos.descontoValor.replace('.', ',') : "")}</td>
                                    <td className="list-body-content">{produtos.acrescimoPercent > 0 ? produtos.acrescimoPercent.replace('.', ',') + "%" : (produtos.acrescimoValor > 0 ? "R$ " + produtos.acrescimoValor.replace('.', ',') : "")}</td>
                                    <td className="list-body-content">{ExibeData(produtos.inicioOferta)}</td>
                                    {/* <td>{produtos.inicioOfertaHora}</td> */}
                                    <td className="list-body-content">{ExibeData(produtos.fimOferta)}</td>
                                    {/* <td>{produtos.fimOfertaHora}</td> */}
                                    <td className="alert-info">
                                        <Link to={"/produtoloja/" + idLoja + "/" + produtos.produtoid + "/" + market} className="alert-info">Visualizar</Link>
                                        {/* <Link to="#" onClick={() => enviaUmPreco(produtos.produtoid)}> / Enviar preço</Link> */}
                                    </td>
                                    <td>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    {page !== 1 ? <button type="button" onClick={() => getProdutos(1)}>Primeira</button> : <button type="button" disabled>Primeira</button>}
                    {page !== 1 ? <button type="button" onClick={() => getProdutos(page - 1)}>{page - 1}</button> : ""}
                    <button type="button" disabled>{page}</button>{" "}
                    {page + 1 <= lastPage ? <button type="button" onClick={() => getProdutos(page + 1)}>{page + 1}</button> : ""}
                    {page !== lastPage ? <button type="button" onClick={() => getProdutos(lastPage)}>Última</button> : <button type="button" disabled>Última</button>}
                </div>
            </div>
        </div>
    )
}