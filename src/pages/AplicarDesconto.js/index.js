import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import moment from "moment";

export const AplicarDesconto = () => {
    const { loja, market } = useParams()
    var [market1, setMarket1] = useState(market)
    const [exibeLista, setExibeLista] = useState([])
    const [numeros, setNumeros] = useState({
        descPercentual: 0,
        descReal: 0,
        inicioOferta: "",
        fimOferta: "",
        acrescimoPercent: 0,
        acrescimoValor: 0,
        descontoPercent: 0,
        descontoValor: 0
    });
    const [dadosOferta, setDadosOferta] = useState({
        id: '',
        idLojaVirtual: '',
        idProdutoLoja: '',
        lojaid: '',
        marca: '',
        name: '',
        namecategoria: '',
        precoVenda: 0,
        produtoid: '',
        tipoSimplesComposto: '',
        precoOferta: 0,
        inicioOferta: new Date(),
        inicioOfertaHora: '',
        fimOferta: new Date(),
        fimOfertaHora: ''
    })
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });

    const valueInput = (e) => {
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(/\D[^,]\D/g, '') })
    };
    const name = market
    useEffect(() => {
        const getPromocao = async (e) => {
            let verificaListaVazia = localStorage.getItem("listaSelecionados")
            if (verificaListaVazia === "") {
                setStatus({
                    type: "errorVolta",
                    mensagem: "Erro. Nenhum item selecionado.Marque os itens que deseja incluir desconto antes de aplicar o desconto",
                });
            }
            setExibeLista(localStorage.getItem("listaSelecionados").replace(/,/g, "  /  "))
            setNumeros(numeros)
        }
        getPromocao()
    }, [loja])

    async function preparaOferta(numeros) {
        var listaProdutos = localStorage.getItem("listaSelecionados").split(',')
        console.log("entrei no prepara oferta e olha o listaprodutos " + listaProdutos)
        for (let i = 0; i < listaProdutos.length; i++) {
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.get("/produtoslojas/produtoloja/" + loja + "/" + listaProdutos[i] + "/" + name, headers)
                .then((produto) => {
                    dadosOferta.id = produto.data.id
                    dadosOferta.idLojaVirtual = produto.data.idLojaVirtual
                    dadosOferta.idProdutoLoja = produto.data.idProdutoLoja
                    dadosOferta.lojaid = produto.data.lojaid
                    dadosOferta.marca = produto.data.marca
                    dadosOferta.name = produto.data.name
                    dadosOferta.namecategoria = produto.data.namecategoria
                    dadosOferta.precoVenda = ((Number(produto.data.precoVenda) * (1 - (Number(numeros.descontoPercent) / 100)) * (1 + (Number(numeros.acrescimoPercent) / 100))) + Number(numeros.acrescimoValor) - Number(numeros.descontoValor))
                    dadosOferta.produtoid = produto.data.produtoid
                    dadosOferta.tipoSimplesComposto = produto.data.tipoSimplesComposto
                    dadosOferta.precoOferta = produto.data.precoOferta
                    dadosOferta.inicioOferta = undefined
                    //dadosOferta.inicioOfertaHora = numeros.inicioOfertaHora
                    dadosOferta.fimOferta = undefined
                    //dadosOferta.fimOfertaHora = numeros.fimOfertaHora
                    dadosOferta.descontoPercent = numeros.descontoPercent
                    dadosOferta.descontoValor = numeros.descontoValor
                    dadosOferta.acrescimoPercent = numeros.acrescimoPercent
                    dadosOferta.acrescimoValor = numeros.acrescimoValor
                    salvaOferta(dadosOferta)
                    
                    enviaUmPreco(listaProdutos[i])






                }).catch((erro) => {
                    console.log(erro)
                })
                
        }
        localStorage.removeItem("listaSelecionados")
    }

    async function enviaUmPreco(produtoid) {
        setStatus({
            type: "success",
            mensagem: "Produto enviado",
        });
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers':{
            'Authorization':'Bearer '+ valueToken
            }
        }
        await api.put('produtoslojas/enviaumproduto/' + produtoid + "/" + loja,headers,(req,res)=>
        {try {
            res.status(200)
            return
           } catch (error) {
            res.status(400)
           }}
            
            
        )
       
    }





    async function salvaOferta(dadosOferta) {
        console.log("entrei no salvaoferta")
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        console.log(loja + "   " + dadosOferta.produtoid + "  ")
        console.log(dadosOferta)
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

    const montaDesconto = async (e) => {
        e.preventDefault()
        if (numeros.descPercentual > 0 || numeros.descontoValor > 0) {
            if (numeros.acrescimoPercent > 0 || numeros.acrescimoValor > 0) {
                console.log("Se concedeu um desconto não pode dar acréscimo")
                setStatus({
                    type: "error",
                    mensagem: "Erro. Se concedeu um desconto não pode dar acréscimo e vice-versa",
                });
                return
            }
        }
        if (numeros.descontoPercent > 100) {
            setStatus({
                type: "error",
                mensagem: "Erro. Desconto maior que 100 % do preço do itém",
            });
            return
        }
        preparaOferta(numeros)
    }

    return (
        <div>
            <h1>Aplicar Descontos / Acréscimo</h1>
            <Link to='/home'>Home </Link>{" / "}
            <Link to={'/pegaTodosProdutos/categoria/' + loja}>Produtos por categoria </Link>{" / "}
            <Link to={'/produtosloja/' + loja}> Produtos por Marca </Link>{" / "}
            <Link to={'/produtosloja/pesquisa/' + loja}> Produtos por Nome </Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
            <hr />
            <h2>Loja :{market1}</h2>
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "errorVolta" ? (<Navigate to={'/produtosloja/' + loja + "/" + market} state={status} />) : ""}
            {status.type === "success" ? (<Navigate to={'/buscaloja/' + loja } state={status} />) : ""}
            <form onSubmit={montaDesconto}>
                Desconto<br />
                <label>Conceder desconto % : </label>
                <input type="text" name="descontoPercent" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input><br />
                <label>Conceder desconto Valor : </label>
                <input type="text" name="descontoValor" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input><br />
                <label>Aplicar acréscimo % : </label>
                <input type="text" name="acrescimoPercent" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} ></input><br />
                <label>Aplicar acréscimo valor : </label>
                <input type="text" name="acrescimoValor" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}></input><br />
                <button type="submit">Enviar Desconto</button>
            </form>
            <br />
            <span>SKU dos Produtos selecionados : {exibeLista}</span>
        </div>
    )
}