import moment from "moment";
import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";
import api from "../../config/configApi";
import { ExibeData } from "../../services/exibeData";
export const ProdutoLoja = () => {
    const { loja, id, name } = useParams()
    var { state } = useLocation();
    var [market, setMarket] = useState("")
    const [idLoja, setIdLoja] = useState(loja)
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const [buscaPrecoCusto, setBuscaPrecoCusto] = useState("")
    var [dados, setDados] = useState([])
    var [numeros, setNumeros] = useState({
        precoOferta: 0,
        inicioOferta: "",
        inicioOfertaHora: null,
        fimOferta: "",
        fimOfertaHora: null
    });
    // let dadosOferta={
    //     id: '',
    //     idLojaVirtual: '',
    //     idProdutoLoja: '',
    //     lojaid: '',
    //     marca: '',
    //     name: '',
    //     namecategoria: '',
    //     precoVenda: 0,
    //     produtoid: '',
    //     tipoSimplesComposto: '',
    //     precoOferta: 0,
    //     inicioOferta: new Date(),
    //     inicioOfertaHora:null ,
    //     fimOferta: new Date(),
    //     fimOfertaHora:null 
    // }



    const valueInput2 = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(/\D[^,]\D/g, '') });
    const valueInput = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value });


    const getLoja = async (e) => {
        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/produtoslojas/produtoloja/" + loja + "/" + id + "/" + name, headers)
            .then((produto) => {
                setMarket(name)
                setDados({
                    name: produto.data.name,
                    precoVenda: produto.data.precoVenda,
                    precoOferta: produto.data.precoOferta,
                    marca: produto.data.marca
                })
                setNumeros({

                    precoOferta: produto.data.precoOferta.replace(".", ","),
                    inicioOferta: ExibeData(produto.data.inicioOferta),
                    fimOferta: ExibeData(produto.data.fimOferta)
                })
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem
                    })

                }
            })
        await api.get("/produtos/produto/"+id,headers)
        .then((response)=>{
            setBuscaPrecoCusto(response.data.precoCusto)

        })
        .catch(()=>{})
    }

    useEffect(() => {

        getLoja()
    }, [dados.inicioOferta])
    const editaProduto = async (e) => {
        e.preventDefault()
        dados.precoOferta = Number(numeros.precoOferta) || undefined//tem um replace aqui para tirar o ponto e colocar a vírgula
        dados.inicioOferta = (numeros.inicioOferta) || undefined
        dados.inicioOfertaHora = numeros.inicioOfertaHora
        dados.fimOferta = (numeros.fimOferta) || undefined
        dados.fimOfertaHora = numeros.fimOfertaHora
        dados.acrescimoValor = numeros.acrescimoValor
        dados.acrescimoPercent = numeros.acrescimoPercent
        dados.descontoPercent = numeros.descontoPercent
        dados.descontoValor = numeros.descontoValor


        const dataHoje = moment(new Date()).format("DD/MM/YYYY")
        //faz consistência entre as datas
        if ((dados.precoOferta > 0) && dados.inicioOferta !== "<empty string>") {
            if (moment(dados.inicioOferta).format("DD/MM/YYYY") < dataHoje) {
                setStatus({
                    type: "error",
                    mensagem: "Erro. Data início da promoção menor que data de hoje ou data em branco",
                });
                return
            }
            if (moment(dados.fimOferta).format("DD/MM/YYYY") <= moment(dados.inicioOferta).format("DD/MM/YYYY") && dados.fimOferta !== "") {
                setStatus({
                    type: "error",
                    mensagem: "Erro. dados fim da promoção menor ou igual que início da promoção",
                });
                return
            }
        }
        if (dados.precoOferta > 0 && dados.inicioOferta === "") {
            setStatus({
                type: "error",
                mensagem: "Erro. Promoção não tem data de início",
            });
            return
        }
        //faz consistência entre desconto e acréscimo
        if (dados.descontoPercent > 0 || dados.descontoValor > 0) {
            if (dados.acrescimoPercent > 0 || dados.acrescimoValor > 0) {
                setStatus({
                    type: "error",
                    mensagem: "Erro. Se concedeu um desconto não pode dar acréscimo e vice-versa",
                });
                return
            }
        }
        if (dados.descontoPercent > 100) {
            setStatus({
                type: "error",
                mensagem: "Erro. Desconto maior que 100 % do preço do itém",
            });
            return
        }
        if (dados.descontoValor > dados.precoVenda) {
            setStatus({
                type: "error",
                mensagem: "Erro. Desconto em valor maior do que o preço de venda do intém",
            });
            return
        }


        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.put('/produtoslojas/produtoloja/' + loja + "/" + id, dados, headers)
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

    return (
        <div>
            <MenuProfile />
            <div className="content">
                <Menu active="users" />
                <div className="wrapper">
                    <div className="row">
                        <div className="top-content-admin">
                            <div className="title-content">
                                <h1 className="sub-menu-title">Consulta produto na loja </h1>
                            </div>

                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to='/produtos'><button type="button" className="pesquisa-title-button">Produtos</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/buscalojas'><button type="button" className="pesquisa-title-button">Lojas</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="alert-content-adm">
                        {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                        {status.type === "success" ? (<Navigate to={'/produtosloja/' + idLoja + "/" + name} state={status} />) : ""}
                    </div>
                    <div className="texto-wrapped">
                        <p className="texto"><h2>Loja : {market}</h2></p>

                        <p className="texto">Nome : {dados.name}</p>

                        <p className="texto">Preço de venda : {dados.precoVenda}</p>
                        <p className="texto">Preço de custo : {buscaPrecoCusto}</p>
                        <p className="texto">Margem Bruta : {(((Number(dados.precoVenda)/Number(buscaPrecoCusto))*100).toFixed(2)).replace(".",",") } %</p>
                        <p className="texto">Marca : {dados.marca}</p>
                        <p className="texto">Conceder desconto % : {dados.descontoPercent}</p>

                        <p className="texto">Conceder desconto Valor : {dados.descontoValor}</p>

                        <p className="texto">Aplicar acréscimo % : {dados.acrescimoPercent} </p>

                        <p className="texto">Aplicar acréscimo valor : {dados.acrescimoValor} </p>


                        <p className="texto">Preço de promoção : {dados.precoOferta} </p>


                        <p className="texto">Data início da promoção : </p>{numeros.inicioOferta}

                        {/* <p>Hora início da promoção : </p>
                                    <input type="time" name="inicioOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input>*/}

                        <p className="texto">Data fim da promoção : </p>{(numeros.fimOferta)}

                        {/* <p>Hora fim da promoção : </p>
                                    <input type="time" name="fimOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} ></input> */}

                    </div>



                </div>
            </div>
        </div>
    )
}