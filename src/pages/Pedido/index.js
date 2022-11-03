
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";
import api from "../../config/configApi";
import { ExibeData } from "../../services/exibeData";



export const PegaUmPedido = () => {
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const { id, loja } = useParams()
    const [market, setMarket] = useState("")
    const [comissaoLoja, setComissaoLoja] = useState(0)
    const [dados, setDados] = useState([])
    const [data, setData] = useState([])




    async function nomeLoja(loja) {
        await api.get("/pedidos/pedido/loja/" + loja)
            .then((dadosLoja) => {
                setComissaoLoja(dadosLoja.data.comissao)
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





    useEffect(() => {

        const getPedido = async () => {
            nomeLoja(loja)


            async function buscaItens(id) {
                await api.get('/pedidos/pedido/itens/' + id)
                    .then((responseItens) => {
                        setData(responseItens.data)
                    })
                    .catch(() => { })
            }
            await api.get('/pedidos/pedido/' + id)
                .then((response) => {
                    setDados(response.data)
                })
                .catch(() => { })


            buscaItens(id)
        }



        getPedido()
    }, [loja])
    function MargemBrutaItemPedido(dados) {

        return (dados.totalVenda - dados.totalCustoProdutos - dados.outrasDespesas - ((comissaoLoja / 100) * dados.totalVenda)).toFixed(2).replace('.', ",")
    }

    function ValorProdutosPedido(produto) {
        return ((produto.valorUnidade * produto.quantidade).toFixed(2).replace('.', ','))
    }

    function CustoPedido(produto) {
        return (produto.precoCusto * produto.quantidade).toFixed(2).replace('.', ',')
    }
    function ComissaoPedido(produto) {
        return ((comissaoLoja / 100) * produto.valorUnidade).toFixed(2).replace(".", ",")
    }
    function MargemPedido(produto) {
        return Number((produto.valorUnidade * produto.quantidade) - ((produto.precoCusto * produto.quantidade) + (comissaoLoja / 100) * produto.valorUnidade)).toFixed(2).replace('.', ',')
    }
    function PercentualMargemPedido(produto) {
        return ((((produto.valorUnidade * produto.quantidade) - ((produto.precoCusto * produto.quantidade) + (comissaoLoja / 100) * produto.valorUnidade)) / (produto.valorUnidade * produto.quantidade)) * 100).toFixed(2).replace(".", ",")
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
                                <h1 className="sub-menu-title">Consulta Pedido</h1>
                            </div>
                        </div>
                    </div>
                    <div className="alert-content-adm">
                        {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                        {status.type === "success" ? <p className="alert-success" > {status.mensagem}</p> : ""}
                    </div>
                    <div className="divide-umdecadalado">
                        <p className="texto"><h2 className="texto">Loja : {market}</h2></p>
                        <div>
                            <p className="texto"><span>Data da compra : </span>{ExibeData(dados.data)}</p>
                        </div>

                    </div>
                    <div className="divide-colunas-pedido">
                        <div className="coluna-pedido">
                            <span className="texto"><span>Nome : </span>{dados.nomeCliente}</span>
                        </div>
                        <div className="coluna-pedido">
                            <span className="texto"><span>CNPJ/CPF : </span>{dados.cpfCnpj}</span>


                        </div>
                    </div>
                    <div className="divide-colunas-pedido">

                        <div className="coluna-pedido">
                            <p className="texto"><span>Valor total da venda : </span>{Number(dados.totalVenda).toFixed(2).replace('.', ",")}</p>
                            <p className="texto"><span>Valor total dos Produtos : </span>{Number(dados.totalProdutos).toFixed(2).replace('.', ",")}</p>
                        </div>
                        <div className="coluna-pedido">
                            <p className="texto"><span>Valor custo dos Produtos : </span>{Number(dados.totalCustoProdutos).toFixed(2).replace('.', ",")}</p>
                            <p className="texto"><span>Frete : </span>{Number(dados.valorFrete).toFixed(2).replace('.', ",")}</p>

                        </div>
                        <div className="coluna-pedido">
                            <p className="texto"><span>Outras depesas : </span>{Number(dados.outrasDespesas).toFixed(2).replace('.', ",")}</p>
                            <p className="texto"><span>Comissão da Loja: </span>{Number((comissaoLoja / 100) * dados.totalVenda).toFixed(2).replace('.', ",")}</p>
                        </div>

                        <div className="coluna-pedido">
                            <p className="texto"><span>Valor total do desconto : </span>{Number(dados.totalDesconto).toFixed(2).replace('.', ",")}</p>
                            <p className="texto"><span>Margem Bruta : </span>{MargemBrutaItemPedido(dados)}</p>
                        </div>


                        <div className="coluna-pedido">

                        </div>
                    </div>

                    <table className="table-list">
                        <thead className="list-head">
                            <th className="list-head-content">Código Bling</th>
                            <th className="list-head-content">Nome Produto</th>
                            <th className="list-head-content">Preço Venda</th>
                            <th className="list-head-content">Custo</th>
                            <th className="list-head-content">Desconto item</th>
                            <th className="list-head-content">Quantidade</th>
                            <th className="list-head-content">Vl produtos</th>
                            <th className="list-head-content">Custo</th>
                            <th className="list-head-content">Comissão</th>
                            <th className="list-head-content">Margem</th>
                            <th className="list-head-content">Percentual</th>

                        </thead>
                        <tbody className="list-body">
                            {data.map((produto) => (
                                <tr key={produto.codigo}>
                                    <td className="list-body-content">{produto.codigo}</td>
                                    <td className="list-body-content">{produto.descricao}</td>
                                    <td className="list-body-content">{(Number(produto.valorUnidade)).toFixed(2).replace('.', ',')}</td>
                                    <td className="list-body-content">{(Number(produto.precoCusto)).toFixed(2).replace('.', ',')}</td>
                                    <td className="list-body-content">{(Number(produto.descontoItem)).toFixed(2).replace('.', ',')}</td>
                                    <td className="list-body-content">{(Number(produto.quantidade)).toFixed(0)}</td>
                                    <td className="list-body-content">{ValorProdutosPedido(produto)}</td>
                                    <td className="list-body-content">{CustoPedido(produto)}</td>
                                    <td className="list-body-content">{ComissaoPedido(produto)}</td>
                                    <td className="list-body-content">{(MargemPedido(produto)) < 0 ? <span className="vermelho">{MargemPedido(produto)}</span> : <span className="preto">{MargemPedido(produto)}</span>}</td>
                                    <td className="list-body-content">{PercentualMargemPedido(produto)}%</td>

                                </tr>
                            ))}
                        </tbody>

                    </table>



                </div>
            </div>
        </div>

    )
}