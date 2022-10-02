import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import { ExibeData } from "../../services/exibeData";
export const PesquisaNome = () => {
    var { state } = useLocation();
    const { loja } = useParams()
    var [data, setData] = useState([])
    var [market, setMarket] = useState("")
    var [pesquisa, setPesquisa] = useState("")
    const [page, setPage] = useState("")
    const [lastPage, setLastPage] = useState("")
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const nomeLoja = async (loja) => {
        await api.get("/lojas/loja/" + loja)
            .then((dadosLoja) => {
                setMarket(dadosLoja.data.name)
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
    //const marketplace= nomeLoja(loja)
    const getProdutos = async (page) => {
        if (page === undefined) {
            page = 1
        }
        setPesquisa(pesquisa)
        setPage(page)
        await api.get("/produtoslojas/produtosloja/" + page + "/" + loja + "/" + pesquisa)
            .then((response) => {
                market = nomeLoja(loja)
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
    useEffect(() => {
        getProdutos()
    }, [pesquisa])
    return (
        <>
            <h1>Produtos em Loja por nome</h1>
            <Link to='/'>Home </Link>{" / "}
            <Link to={'/pegaTodosProdutos/categoria/' + loja}>Produtos por categoria </Link>{" / "}
            <Link to={'/produtosloja/' + loja}> Produtos por Marca </Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}

            <h2>Loja : {market}</h2>
            <form onSubmit={getProdutos}>
                <label>Pesquisa</label>
                <input type="text" name="pesquisa" placeholder="Pesquisa por nome, SKU ou marca" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)}></input>
                <button type="submit">Pesquisar</button>
            </form>
            <table>
                <thead>
                    <tr>
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
                            <td>{produtos.produtoid}</td>
                            <td>{produtos.name}</td>
                            <td>{produtos.marca}</td>
                            <td>{produtos.nameCategoria}</td>
                            <td>{produtos.tipoSimplesComposto}</td>
                            <td>{produtos.precoVenda}</td>
                            <td>{produtos.precoOferta}</td>
                            <td>{ExibeData(produtos.inicioOferta)}</td>
                            <td>{produtos.inicioOfertaHora}</td>
                            <td>{ExibeData(produtos.fimOferta)}</td>
                            <td>{produtos.fimOfertaHora}</td>
                            <td>
                                <Link to={"/produtoloja/" + loja + "/" + produtos.produtoid}>Visualizar</Link>
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