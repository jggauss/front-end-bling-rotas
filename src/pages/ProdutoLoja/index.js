import moment from "moment";
import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import api from "../../config/configApi";
import { ExibeData } from "../../services/exibeData";
export const ProdutoLoja = () => {
    const { loja, id,name } = useParams()
    var { state } = useLocation();
    var [market, setMarket] = useState("")
    const [idLoja,setIdLoja] =useState(loja)
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
    
    
   
    const valueInput2 = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(/\D[^,]\D/g,'') });
    const valueInput = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value });
    

        const getLoja = async (e) => {
            var valueToken = localStorage.getItem("token")
        const headers = {
            'headers':{
            'Authorization':'Bearer '+ valueToken
            }
        }

            await api.get("/produtoslojas/produtoloja/" + loja + "/" + id +"/"+name,headers)
                .then((produto) => {
                    setMarket(name)
                    setDados({
                        name:produto.data.name,
                        precoVenda:produto.data.precoVenda,
                        precoOferta:produto.data.precoOferta,
                        marca:produto.data.marca
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
        }

    useEffect(() => {
        
        getLoja()
    }, [dados.inicioOferta])
    const editaProduto = async (e) => {
        e.preventDefault()
        dados.precoOferta = Number(numeros.precoOferta)||undefined//tem um replace aqui para tirar o ponto e colocar a vírgula
        dados.inicioOferta = (numeros.inicioOferta)||undefined
        dados.inicioOfertaHora = numeros.inicioOfertaHora
        dados.fimOferta = (numeros.fimOferta)||undefined
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
        if(dados.precoOferta>0 && dados.inicioOferta ===""){
            setStatus({
                         type: "error",
                         mensagem: "Erro. Promoção não tem data de início",
                     });
                     return
        }
        //faz consistência entre desconto e acréscimo
        if(dados.descontoPercent>0 || dados.descontoValor>0 ){
            if(dados.acrescimoPercent>0 || dados.acrescimoValor>0){
                setStatus({
                    type: "error",
                    mensagem: "Erro. Se concedeu um desconto não pode dar acréscimo e vice-versa",
                });
                return
            }
        }
        if(dados.descontoPercent>100){
            setStatus({
                type: "error",
                mensagem: "Erro. Desconto maior que 100 % do preço do itém",
            });
            return
        }
        if(dados.descontoValor>dados.precoVenda){
            setStatus({
                type: "error",
                mensagem: "Erro. Desconto em valor maior do que o preço de venda do intém",
            });
            return
        }


        var valueToken = localStorage.getItem("token")
        const headers = {
            'headers':{
            'Authorization':'Bearer '+ valueToken
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
            <h1>Consulta produto na loja </h1>
            <Link to='/home'>Home</Link>{" / "}
            <Link to='/produtos'>Produtos</Link>{" / "}
            <Link to='/buscalojas'>Lojas</Link>{" / "}
            <hr />
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "success" ? (<Navigate to={'/produtosloja/' + idLoja +"/"+name } state={status} />) : ""}
            <form onSubmit={editaProduto}>
                <h2>Loja : {market}</h2>
                
                Nome : {dados.name}
                <br />
                Preço de venda : {dados.precoVenda}
                <br />
                Marca : {dados.marca} <br /><br />
                <label>Conceder desconto % : </label>
                <input type="text" name="descontoPercent" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput2}  ></input><br/>
                <label>Conceder desconto Valor : </label>
                <input type="text" name="descontoValor" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput2}  ></input><br/>
                <label>Aplicar acréscimo % : </label>
                <input type="text" name="acrescimoPercent" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput2} ></input><br/>
                <label>Aplicar acréscimo valor : </label>
                <input type="text" name="acrescimoValor" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput2}></input><br/>
                <br/>
                <label>Preço de promoção : </label>
                <input type="text" name="precoOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput2} ></input>
                <br />
                <label>Data início da promoção : </label>{numeros.inicioOferta}<span> Alterar para </span>
                <input type="date" name="inicioOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} ></input>
                {/* <label>Hora início da promoção : </label>
                <input type="time" name="inicioOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input>*/}
                <br /> 
                <label>Data fim da promoção : </label>{(numeros.fimOferta)}<span> Alterar para </span>
                <input type="date" name="fimOferta" pattern="^[0-9]*[.,]?[0-9]*$"  onChange={valueInput} ></input>
                {/* <label>Hora fim da promoção : </label>
                <input type="time" name="fimOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} ></input> */}
                <br />
                <br />
                <button type="submit">Alterar</button>
                <br /><br />
            </form>
        </div>
    )
}