
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import { ExibeDataDia } from "../../services/exibeDataDia";
export const PegaUmPedido = () => {
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const { id,loja } = useParams()
    const [market, setMarket] = useState("")
    const [comissaoLoja,setComissaoLoja] = useState(0)
    const [dados, setDados] = useState([])
    const [data, setData] = useState([])
    const [nome, setNome] = useState("")
    
   
    
    async function nomeLoja (loja) {
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
    



    const getPedido = async () => {
        const mercado = nomeLoja(loja)
        
        
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
    useEffect(() => {
        getPedido()
    }, [loja])

    async function mostraNomeProduto(id) {
        await api.get('/produto/' + id)
            .then((response) => {

                setNome(response.data)
            })
            .catch(() => { })
    }


    return (
        <div>
            <h1>Consulta Pedido</h1>
            <Link to='/'>Home </Link>{" / "}
            <Link to='/produtos'>Produtos</Link>{" / "}
            <Link to='/buscalojas'>Lojas</Link>{" / "}
            <Link to='/pedidos'>Pedidos</Link>{" / "}


            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}
            <hr/>
            <h2>Loja : {market}</h2>
            <span>Comissão da loja : {comissaoLoja}</span><br/>
            <span>CNPJ/CPF : </span>{dados.cpfCnpj}<br/>
            <span>Nome : </span>{dados.nomeCliente}<br/>
            <span>Data da compra : </span>{ExibeDataDia(dados.data)}<br/>
            <span>Valor total da venda : </span>{Number(dados.totalVenda).toFixed(2).replace('.', ",")}<br/>
            <span>Valor total dos Produtos : </span>{Number(dados.totalProdutos).toFixed(2).replace('.', ",")}<br/>
            <span>Valor custo dos Produtos : </span>{Number(dados.totalCustoProdutos).toFixed(2).replace('.', ",")}<br/>
            <span>Valor total do desconto : </span>{Number(dados.totalDesconto).toFixed(2).replace('.', ",")}<br/>
            <span>Frete : </span>{Number(dados.valorFrete).toFixed(2).replace('.', ",")}<br/>
            <span>Outras depesas : </span>{Number(dados.outrasDespesas).toFixed(2).replace('.', ",")}<br/>
            <span>Comissão da Loja: </span>{Number((comissaoLoja/100)*dados.totalVenda).toFixed(2).replace('.', ",")}<br/>
            <span>Margem Bruta : </span>{(dados.totalVenda - dados.totalCustoProdutos - dados.outrasDespesas-((comissaoLoja/100)*dados.totalVenda)).toFixed(2).replace('.', ",")}<br />

            <hr />
            <table>
                <thead>
                    <th>Código Bling</th>
                    <th>Nome Produto</th>
                    <th>Preço Venda</th>
                    <th>Custo</th>
                    <th>Desconto item</th>
                    <th>Quantidade</th>
                    <th>Vl produtos</th>
                    <th>Custo</th>
                    <th>Comissão</th>
                    <th>Margem</th>
                    <th>Percentual</th>

                </thead>
                <tbody>
                    {data.map((produto) => (
                        <tr>
                            <td>{produto.codigo}</td>
                            <td>{produto.descricao}</td>
                            <td>{(Number(produto.valorUnidade)).toFixed(2).replace('.', ',')}</td>
                            <td>{(Number(produto.precoCusto)).toFixed(2).replace('.', ',')}</td>
                            <td>{(Number(produto.descontoItem)).toFixed(2).replace('.', ',')}</td>
                            <td>{(Number(produto.quantidade)).toFixed(0)}</td>
                            <td>{(produto.valorUnidade * produto.quantidade).toFixed(2).replace('.', ',')}</td>
                            <td>{(produto.precoCusto * produto.quantidade).toFixed(2).replace('.', ',')}</td>
                            <td>{((comissaoLoja/100)*produto.valorUnidade).toFixed(2).replace(".",",")}</td>
                            <td>{((produto.valorUnidade * produto.quantidade) - ((produto.precoCusto * produto.quantidade)+(comissaoLoja/100)*produto.valorUnidade)) < 0 ? <span className="vermelho">{((produto.valorUnidade * produto.quantidade) - ((produto.precoCusto * produto.quantidade)+(comissaoLoja/100)*produto.valorUnidade)).toFixed(2).replace('.', ',')}</span> : <span className="preto">{((produto.valorUnidade * produto.quantidade) - ((produto.precoCusto * produto.quantidade)+(comissaoLoja/100)*produto.valorUnidade)).toFixed(2).replace('.', ',')}</span>}</td>
                            <td>{((((produto.valorUnidade * produto.quantidade) - ((produto.precoCusto * produto.quantidade)+(comissaoLoja/100)*produto.valorUnidade)) / (produto.valorUnidade * produto.quantidade)) * 100).toFixed(2).replace(".", ",")}%</td>
                            
                        </tr>
                    ))}
                </tbody>

            </table>





        </div>

    )
}