import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import moment from "moment";


export const AplicarPromocao = () => {
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
    const dataHoje = new Date()

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
                    mensagem: "Erro. Nenhum item selecionado.Marque os itens que deseja incluir na promoção antes de aplicar a promoção",
                });
            }
            setExibeLista(localStorage.getItem("listaSelecionados").replace(/,/g, "  /  "))
            setNumeros(numeros)
        }
        getPromocao()
    }, [loja])
    
    const montaPromo = async (e) => {
        e.preventDefault()
        if (numeros.descPercentual === 0 && numeros.descReal === 0) {
            setStatus({
                type: "error",
                mensagem: "Erro. Pelo menos um tipo de desconto deve ser preenchido",
            });
            return
        }
        if (numeros.inicioOferta === '' || numeros.fimOferta === '') {
            setStatus({
                type: "error",
                mensagem: "Erro. Data de início e fim devem ser preenchidas",
            });
            return
        }
        if (moment(numeros.inicioOferta).format("DD/MM/YYY") < moment(dataHoje).format("DD/MM/YYYY")) {
            setStatus({
                type: "error",
                mensagem: "Erro. Data de início da promoção menor que a data de hoje",
            });
            return
        }
        if (moment(numeros.fimOferta).format("DD/MM/YYY") <= moment(numeros.inicioOferta).format("DD/MM/YYY")) {
            setStatus({
                type: "error",
                mensagem: "Erro. Data de início da promoção menor que a data do fim",
            });
            return
        }
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
                    let valorDescPerc = (produto.data.precoVenda * (numeros.descPercentual / 100))
                    let valorFinalPromocao = Number(produto.data.precoVenda) - Number(valorDescPerc) - Number(numeros.descReal)
                    dadosOferta.id = produto.data.id
                    dadosOferta.idLojaVirtual = produto.data.idLojaVirtual
                    dadosOferta.idProdutoLoja = produto.data.idProdutoLoja
                    dadosOferta.lojaid = produto.data.lojaid
                    dadosOferta.marca = produto.data.marca
                    dadosOferta.name = produto.data.name
                    dadosOferta.namecategoria = produto.data.namecategoria
                    dadosOferta.precoVenda = produto.data.precoVenda
                    dadosOferta.produtoid = produto.data.produtoid
                    dadosOferta.tipoSimplesComposto = produto.data.tipoSimplesComposto
                    dadosOferta.precoOferta = valorFinalPromocao
                    dadosOferta.inicioOferta = moment(numeros.inicioOferta).format("YYYY-MM-DD")
                    // dadosOferta.inicioOfertaHora = numeros.inicioOfertaHora
                    dadosOferta.fimOferta = moment(numeros.fimOferta).format("YYYY-MM-DD")
                    // dadosOferta.fimOfertaHora = numeros.fimOfertaHora
                    dadosOferta.descontoPercent = numeros.descontoPercent
                    dadosOferta.descontoValor = numeros.descontoValor
                    dadosOferta.acrescimoPercent = numeros.acrescimoValor

                    if (dadosOferta.fimOferta < dadosOferta.inicioOferta) {
                        setStatus({
                            type: "error",
                            mensagem: "Data de início maior que a data de fim da oferta"
                        });
                    }
                    salvaOferta(dadosOferta)
                    enviaUmPreco(listaProdutos[i])
                    
                }).catch((erro) => {
                    console.log(erro)
                })
        }
        localStorage.removeItem("listaSelecionados")
        
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

    return (
        <div>
            <h1>Aplicar Promoção</h1>
            <Link to='/home'>Home </Link>{" / "}
            <Link to={'/pegaTodosProdutos/categoria/' + loja}>Produtos por categoria </Link>{" / "}
            <Link to={'/produtosloja/' + loja}> Produtos por Marca </Link>{" / "}
            <Link to={'/produtosloja/pesquisa/' + loja}> Produtos por Nome </Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
            <hr />
            <h2>Loja :{market1}</h2>
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "errorVolta" ? (<Navigate to={'/produtosloja/' + loja + "/" + market} state={status} />) : ""}
            {status.type === "success" ? (<Navigate to={'/buscaloja/' + loja} state={status} />) : ""}
           

            <br />
            <form onSubmit={montaPromo}>
                Promoção<br />
                <label>Desconto em percentual : </label>
                <input type="text" name="descPercentual" placeholder="Desconto em percentual" value={numeros.descPercentual} onChange={valueInput}></input>
                <label> e/ou Desconto em valor : </label>
                <input type="text" name="descReal" placeholder="Desconto em Reais" value={numeros.descReal} onChange={valueInput}></input><br />
                <label>Data início da promoção : </label>
                <input type="date" name="inicioOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} ></input>
                {/* <label>Hora início da promoção : </label>
                <input type="time" name="inicioOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$"  ></input><br /> */}
                <label>Data fim da promoção : </label>
                <input type="date" name="fimOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input><br />
                {/* <label>Hora fim da promoção : </label>
                <input type="time" name="fimOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$"   ></input> */}
                <button type="submit">Enviar Promoção</button>
            </form><br />

            <span>SKU dos Produtos selecionados : {exibeLista}</span>


        </div>

    )
}