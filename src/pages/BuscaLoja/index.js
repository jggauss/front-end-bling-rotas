import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom"
import api from "../../config/configApi";
import { servDeleteLoja } from "../../services/servDeleteLoja";
import { servPrecificaLoja } from "../../services/servPrecificaLoja";



export const BuscaLoja = () => {
    var { loja,name } = useParams()
    var { state } = useLocation();
    const [dados, setDados] = useState([])
    const [aguarde, setAguarde] = useState("")
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const [verifica, setVerifica] = useState(false)
    useEffect(() => {
        const getLoja = async () => {
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.get("/lojas/loja/" + loja, headers)
                .then((response) => {
                    setDados({
                        name: response.data.name,
                        codigoBling: response.data.codigoBling,
                        comissao: response.data.comissao.replace(".", ","),
                        valorAcrescAbaixoMinimo: response.data.valorAcrescAbaixoMinimo.replace(".", ","),
                        percentAcrescAbaixoMinimo: response.data.percentAcrescAbaixoMinimo.replace(".", ","),
                        valorFixoFreteAbaixo: response.data.valorFixoFreteAbaixo.replace(".", ","),
                        valorPercentFreteAbaixo: response.data.valorPercentFreteAbaixo.replace(".", ","),
                        valorFreteGratis: response.data.valorFreteGratis.replace(".", ","),
                        valorAcresAcimaMinimo: response.data.valorAcresAcimaMinimo.replace(".", ","),
                        percentAcrescAcimaMinimo: response.data.percentAcrescAcimaMinimo.replace(".", ","),
                        valorFixoFreteAcima: response.data.valorFixoFreteAcima.replace(".", ","),
                        valorPercentFreteAcima: response.data.valorPercentFreteAcima.replace(".", ","),
                        aumentaValorPedidoMinimo: response.data.aumentaValorPedidoMinimo,
                        valorAcimaAumentaParaPedidoMinimo: response.data.valorAcimaAumentaParaPedidoMinimo.replace(".", ",")
                    })
                })
                .catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: "error",
                            mensagem: "Loja não encontrada. Tente mais tarde",
                        });
                    } else {
                        setStatus({
                            type: "error",
                            mensagem: "Erro. Tente mais tarde",
                        });
                    }
                })
        }
        getLoja()
    }, [loja])

    const deleteLoja = async (idLoja) => {
        const response = await servDeleteLoja(idLoja);
        if (response) {
            setStatus({
                type: "success",
                mensagem: response.mensagem,
            });

        } else {
            setStatus({
                type: "error",
                mensagem: "Erro. Tente mais tarde",
            });
        }
    };

    const precificaLoja = async (idLoja) => {
        setAguarde("Aguarde. Este processo demora alguns minutos")
        setVerifica(true)
        const response = await servPrecificaLoja(idLoja);
        if (response) {
            setStatus({
                type: "success",
                mensagem: "Processo finalizados. Todos os produtos da loja foram baixados",
            });
        }
        setVerifica(false)

        setAguarde("Processo finalizados. Todos os produtos da loja foram baixados")
        BuscaLoja()
    };

    const Child = () => {
        if (dados.aumentaValorPedidoMinimo === true) {
            return <div>Sim</div>
        }
        return <div>Não</div>
    }
    return (
        <>
            <h1>Visualizar Loja</h1>
            <Link to='/home'>Home </Link>{" / "}
            <Link to={"/buscaloja/" + loja}>Visualizar   </Link>{" / "}
            <Link to={"/editarloja/" + loja}>Editar   </Link>{" / "}
            <Link to="#" onClick={() => deleteLoja(loja)}>Apagar</Link>{" / "}
            <Link to='/buscalojas'> Listar Lojas </Link>{" / "}
            <Link to={'/produtosloja/' + loja +"/"+ dados.name}> Listar Produtos </Link>{" / "}


            <Link to='/criarloja'><button type="button">Criar loja</button></Link>{" / "}
            <Link to="#" onClick={() => precificaLoja(loja)}><button type="button">Precificar</button></Link>

            {status.type === "success" ? <p>{status.mensagem}</p> : ("")}
            {status.type === "error" ? <p>{status.mensagem}</p> : ("")}

            <hr />
            {aguarde}
            <h1>Nome : {dados.name}<br /></h1>
            Código no Bling : {dados.codigoBling}<br />
            Comissão : {dados.comissao}<br />
            Margem Bruta : Igual ou acima do valor mínimo acrescentar percentual : {dados.percentAcrescAcimaMinimo}<br />
            <h2><p>Regras de preço</p></h2>
            Abaixo do valor mínimo para frete grátis acrescentar valor R$ : {dados.valorAcrescAbaixoMinimo}<br />
            Abaixo do valor mínimo para frete grátis acrescentar percentual : {dados.percentAcrescAbaixoMinimo}<br />
            <h2>Valor para frete grátis : {dados.valorFreteGratis}</h2>
            Igual ou acima do valor mínimo para frete grátis acrescentar valor R$ : {dados.valorAcresAcimaMinimo}<br />
            <p>Valores frete acima do valor mínimo: (opcionais)</p>
            Frete em valor fixo : {dados.valorFixoFreteAcima}<br />
            Percentual frete : {dados.valorPercentFreteAcima}<br />
            Deseja arredondar para o valor do pedido mínimo em caso de ficar abaixo : <Child />
            Valor acima do qual deseja que seja arredondado : {dados.valorAcimaAumentaParaPedidoMinimo}
            {verifica === true ? <div className="c-loader"></div> : ""}
        </>
    )
}