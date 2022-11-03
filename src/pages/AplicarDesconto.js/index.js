import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import moment from "moment";
import { MenuProfile } from "../../Componet/MenuProfile";
import { Menu } from "../../Componet/Menu";

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
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(",",".")})
        
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
                    dadosOferta.descontoPercent = Number(numeros.descontoPercent)
                    dadosOferta.descontoValor = Number(numeros.descontoValor)
                    dadosOferta.acrescimoPercent = Number(numeros.acrescimoPercent).toFixed(2)
                    dadosOferta.acrescimoValor = Number(numeros.acrescimoValor).toFixed(2)
                    salvaOferta(dadosOferta)
                    
                    enviaUmPreco(listaProdutos[i])
                }).catch((erro) => {
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
        await api.put('produtoslojas/enviaumproduto/' + produtoid + "/" + loja,headers)
        .then(()=>{})
        .catch(()=>{})
       
    }





    async function salvaOferta(dadosOferta) {

        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.put('/produtoslojas/produtoloja/' + loja + "/" + dadosOferta.produtoid, dadosOferta, headers)
            .then(() => {})
            .catch(() => {})
    }

    const montaDesconto = async (e) => {
        e.preventDefault()
        if (numeros.descPercentual > 0 || numeros.descontoValor > 0) {
            if (numeros.acrescimoPercent > 0 || numeros.acrescimoValor > 0) {

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
             <MenuProfile />
            <div className="content">
                <Menu active="users" />
                <div className="wrapper">
                    <div className="row">
                        <div className="top-content-admin">
                            <div className="title-content">
                                <h1 className="sub-menu-title" >Aplicar Desconto/Acréscimo</h1>
                            </div>

                        </div>
                    </div>
            
            <h2 className="texto-realcado">Loja :{market1}</h2>
            <div className="alert-content-adm">
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "errorVolta" ? (<Navigate to={'/produtosloja/' + loja + "/" + market} state={status} />) : ""}
            {status.type === "success" ? (<Navigate to={'/buscaloja/' + loja } state={status} />) : ""}
            </div>
            <form onSubmit={montaDesconto}>
            <p className="texto-realcado">Desconto/Acréscimo</p>
                <label className="texto">Conceder desconto % : </label>
                <input className="texto" type="text" name="descontoPercent" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input><br />
                <label className="texto">Conceder desconto Valor : </label>
                <input className="texto" type="text" name="descontoValor" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input><br />
                <label className="texto">Aplicar acréscimo % : </label>
                <input  className="texto"type="text" name="acrescimoPercent" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} ></input><br />
                <label className="texto">Aplicar acréscimo valor : </label>
                <input className="texto" type="text" name="acrescimoValor" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}></input><br />
                <button  className="pesquisa-title-button" type="submit">Enviar Desconto</button>
            </form>
            <br />
            <span className="texto">SKU dos Produtos selecionados : {exibeLista}</span>
        </div>
        </div>
        </div>
    )
}