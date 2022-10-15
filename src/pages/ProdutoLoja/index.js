import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import { FormataData } from "../../services/formataData";
import { FormataDataHoje } from "../../services/formataDataHoje";
export const ProdutoLoja = () => {
    const { loja, id } = useParams()
    var { state } = useLocation();
    var [market, setMarket] = useState("")
    var [idLoja,setIdLoja] = useState('')
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    var [dados, setDados] = useState([])
    var [numeros, setNumeros] = useState({
        precoOferta: 0,
        inicioOferta: "",
        inicioOfertaHora:null ,
        fimOferta: "",
        fimOfertaHora:null
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
    
    const nomeLoja = async (loja) => {
        await api.get("/lojas/lojabling/" + loja)
            .then((dadosLoja) => {
                setMarket(dadosLoja.data.name)
                setIdLoja(dadosLoja.data.id)
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
    const valueInput2 = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(/\D[^,]\D/g,'') });
    const valueInput = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value });
    const getLoja = async (e) => {
        await api.get("/produtoslojas/produtoloja/" + loja + "/" + id)
            .then((produto) => {
                nomeLoja(loja)
                
                setDados({
                    name:produto.data.name,
                    precoVenda:produto.data.precoVenda,
                    marca:produto.data.marca
                })
                setNumeros({
                    precoOferta: dados.precoOferta.replace(".", ","),
                    inicioOferta: FormataData(dados.inicioOferta),
                    fimOferta: FormataData(dados.fimOferta)
                })
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem
                    })

                }
            })
    }
    useEffect(() => {
        getLoja()
    }, [dados.lojaid])
    const editaProduto = async (e) => {
        e.preventDefault()
        dados.precoOferta = Number(numeros.precoOferta.replace(",", "."))
        dados.inicioOferta = FormataData(numeros.inicioOferta)
        dados.inicioOfertaHora = numeros.inicioOfertaHora
        dados.fimOferta = FormataData(numeros.fimOferta)
        dados.fimOfertaHora = numeros.fimOfertaHora
        const dataHoje = FormataDataHoje(new Date())
        if (FormataData(dados.precoOferta > 0) && dados.inicioOferta !== "<empty string>") {
            if (FormataData(dados.inicioOferta) < FormataDataHoje(dataHoje)) {
                setStatus({
                    type: "error",
                    mensagem: "Erro. Data início da promoção menor que data de hoje ou data em branco",
                });
                return
            }
            if (dados.fimOferta <= dados.inicioOferta && dados.fimOferta !== "") {
                setStatus({
                    type: "error",
                    mensagem: "Erro. dados fim da promoção menor ou igual que início da promoção",
                });
                return
            }
        } else {
            setStatus({
                type: "error",
                mensagem: "Erro. Promoção não tem data de início",
            });
            return
        }
        await api.put('/produtoslojas/produtoloja/' + loja + "/" + id, dados)
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
            <h1>Consulta produto na loja </h1>
            <Link to='/home'>Home</Link>{" / "}
            <Link to='/produtos'>Produtos</Link>{" / "}
            <Link to='/buscalojas'>Lojas</Link>{" / "}
            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? (<Navigate to={'/produtosloja/' + idLoja} state={status} />) : ""}
            <form onSubmit={editaProduto}>
                <h2>Loja : {market}</h2>
                
                Nome : {dados.name}
                <br />
                Preço de venda : {dados.precoVenda}
                <br />
                Marca : {dados.marca} <br /><br />
                <label>Preço de promoção : </label>
                <input type="text" name="precoOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput2} value={numeros.precoOferta} ></input>
                <br />
                <label>Data início da promoção : </label>
                <input type="date" name="inicioOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} value={(numeros.inicioOferta)}></input>
                <label>Hora início da promoção : </label>
                <input type="time" name="inicioOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input>
                <br />
                <label>Data fim da promoção : </label>
                <input type="date" name="fimOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} value={(numeros.fimOferta)}></input>
                <label>Hora fim da promoção : </label>
                <input type="time" name="fimOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} value={numeros.fimOfertaHora} ></input>
                <br />
                <br />
                <button type="submit">Alterar</button>
                <br /><br />
            </form>
        </div>
    )
}