import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import { ExibeData } from "../../services/exibeData";
import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import { callApi } from "../../services/servCallCategorias";

export const ProdutosLoja = () => {
    var { state } = useLocation();
    const { loja } = useParams()
    var [marca, setMarca] = useState('Selecione Marca')
    
    var [data, setData] = useState([])
    var [percent, setPercent] = useState(0)
    var [market, setMarket] = useState("")
    var [idLoja, setIdLoja] = useState("")
    var [tipo, setTipo] = useState("Todos")
    var [promocao, setPromocao] = useState("Todos")
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

    const nomeLoja = async (loja) => {
        await api.get("/lojas/loja/" + loja)
            .then((dadosLoja) => {
                setMarket(dadosLoja.data.name)
                setIdLoja(dadosLoja.data.codigoBling)
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

    var mostra = marca + tipo + pesquisa +  promocao
    let listaSelecionados = []
    localStorage.setItem("listaSelecionados", listaSelecionados)
    const getProdutos = async (page) => {
        if (page === undefined) {
            page = 1
        }
        setPage(page)
        market = nomeLoja(loja)
        await api.get("/produtoslojas/produtosloja/" + page + "/" + loja + "/" + marca + "/" + tipo + "/" + promocao)
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
            await api.get("/produtoslojas/produtosloja/" + page + "/" + loja + "/" + pesquisa)
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
    async function apagarPromocao() {
        let listaSelecionados = localStorage.getItem('listaSelecionados').split(',')
        async function salvaOferta(dadosOferta) {
            await api.put('produtoslojas/produtoloja/' + loja + "/" + dadosOferta.produtoid, dadosOferta)
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
        for (let i = 0; i < listaSelecionados.length; i++) {
            await api.get("produtoslojas/produtoloja/" + loja + "/" + listaSelecionados[i])
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
                    salvaOferta(dadosOferta)
                }).catch(() => { })
        }
        getProdutos()
    }
    function limparPesquisas() {
        setMarca("Selecione Marca")
       
        setTipo("Todos")
        setPromocao("Todos")
        setPesquisa("")
    }
    async function enviaUmPreco(produtoid) {
        setStatus({
            type: "success",
            mensagem: "Produto enviado",
        });
        await api.put('produtoslojas/enviaumproduto/' + produtoid + "/" + idLoja,(req,res)=>
        {try {
            res.status(200)
            return
           } catch (error) {
            res.status(400)
           }}
            
            
        )
       
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
            console.log(listaSelecionados[i])
            enviaUmPreco(listaSelecionados[i])
            //await api.put('/enviaumproduto/' + listaSelecionados[i] + "/" + idLoja)
            //.then(()=>{})
            //.catch(()=>{})
            
            async function sleep(ms) {
                return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }
            await sleep(1015);
            
            
        }
        setStatus({
            type: "success",
            mensagem: "Produtos selecionados enviados",
        });
    }

    async function enviaTodos(idLoja) {
        setStatus({
            type: "success",
            mensagem: "Enviando produtos. Este produtos pode demorar alguns minutos",
        });
        await api.get('produtoslojas/produtosloja/pesquisa/' + idLoja)
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
                        await sleep(1015);
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

   

    return (
        <>
            <h1>Produtos por Loja</h1>
            <Link to='/'>Home </Link>{" / "}
            <Link to={'/produtosloja/' + loja}> Listar Produtos </Link>{" / "}
            <Link to={'/produtosloja/promocao/' + loja}> Produtos com promoção </Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "errorVolta" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}
            {percent > 0 ? <span>Percentual preços atualizados no bling {percent} %</span> : ""}
            {percent === 100 ? " Processo finalizado" : " Salvando dados"}

            <h2>Loja : {market} - {idLoja}</h2>
            <Link to={'/produtos/promocao/' + loja}><button>Aplicar Promoção</button></Link>
            <Link to="#" onClick={() => apagarPromocao()}><button type="button">Apagar Promoção</button></Link>
            <Link to="#" onClick={() => limparPesquisas()}><button type="button">Limpar pesquisas</button></Link>
            <Link to="#" onClick={() => enviarSelecionados(idLoja)}><button type="button">Enviar Preços Selecionados</button></Link>
            <Link to="#" onClick={() => enviaTodos(idLoja)}><button type="button">Enviar Preços todos produtos da loja</button></Link>
            <form>
                <label>Pesquisa</label>
                <input type="text" name="pesquisa" placeholder="Pesquisa por nome, SKU ou marca" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}></input>
            </form>
            <label>Marca : {marca} </label>
            <AsyncSelect
                cacheOptions
                loadOptions={callApi}
                onChange={(e) => setMarca(e.value)}
                value={"Selecione Marca"}
                defaultOptions
            />
           
            <label>Tipo :{tipo}</label>
            <Select options={options}
                onChange={(e) => setTipo(e.value)}
                value={"Todos"} />
            <label>Listar produtos em promoção :{promocao}</label>
            <Select options={escolhePromocao}
                onChange={(e) => setPromocao(e.value)}
                value={"Todos"} />
            <table>
                <thead>
                    <tr>
                        <th><input name="marcaLinha" type="checkbox" /></th>
                        <th>SKU</th>
                        <th>Nome</th>
                        <th>Marca</th>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th>Preço de venda</th>
                        <th>Preço de promoção</th>
                        <th>Início promoção</th>
                        <th>Hora Início promoção</th>
                        <th>Fim promoção</th>
                        <th>Hora Fim promoção</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((produtos) => (
                        <tr key={produtos.produtoid}>
                            {produtos.lenght > 0 ? produtos : null}
                            <td><input value={produtos.produtoid} name="marcaLinha" type="checkbox" onChange={montaArray} /></td>
                            <td>{produtos.produtoid}</td>
                            <td>{produtos.name}</td>
                            <td>{produtos.marca}</td>
                            <td>{produtos.nameCategoria}</td>
                            <td>{produtos.tipoSimplesComposto}</td>
                            <td>{produtos.precoVenda.replace('.', ',')}</td>
                            <td>{(produtos.precoOferta === null ? '' : produtos.precoOferta.replace('.', ','))}</td>
                            <td>{ExibeData(produtos.inicioOferta)}</td>
                            <td>{produtos.inicioOfertaHora}</td>
                            <td>{ExibeData(produtos.fimOferta)}</td>
                            <td>{produtos.fimOfertaHora}</td>
                            <td>
                                <Link to={"/produtoloja/" + idLoja + "/" + produtos.produtoid}>Visualizar</Link>
                                <Link to="#" onClick={() => enviaUmPreco(produtos.produtoid)}> / Enviar preço</Link>
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
        </>
    )
}