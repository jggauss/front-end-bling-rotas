import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom"
import api from "../../config/configApi";
import { servDeleteLoja } from "../../services/servDeleteLoja";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";


export const DeletaLoja = () => {
    var { loja } = useParams()
    var { state } = useLocation();
    const [dados, setDados] = useState([])
    
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
   
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

    const deleteLoja = async (loja) => {
        const response = await servDeleteLoja(loja);
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

    const Child = () => {
        if (dados.aumentaValorPedidoMinimo === true) {
            return <div>Sim</div>
        }
        return <div>Não</div>
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
                                <h1 className="sub-menu-title">Deletar Loja</h1>
                            </div>
                        </div>
                    </div>
                    <span className="alert-danger">Confirma apagar a loja e todos os registros? Se confirmar os dados não poderão ser recuperados</span>

                    <div className="alert-content-adm">
                        {status.type === "success" ? <p className="alert-success">{status.mensagem}</p> : ("")}
                        {status.type === "error" ? <p className="alert-danger">{status.mensagem}</p> : ("")}
                        {status.type === "success" ? (<Navigate to="/buscalojas" state={status} />) : ("")}
                    </div>
                    <div className="table-list">
                        <div className="item-sub-menu">
                            <Link to="#" onClick={() => deleteLoja(loja)}><button type="button" className="pesquisa-title-button">Confirma</button></Link>
                            <Link to={'/buscalojas/'}><button type="button" className="pesquisa-title-button">Cancelar</button></Link>
                        </div>
                        <br />
                        <div className="texto-wrapped">
                            <h1 className="texto-realcado">Nome : {dados.name}<br /></h1>
                            <p className="texto">Código no Bling : {dados.codigoBling}</p>
                            <p className="texto">Comissão : {dados.comissao}</p>
                            <p className="texto">Margem Bruta : Igual ou acima do valor mínimo acrescentar percentual : {dados.percentAcrescAcimaMinimo}</p>
                            <h2><p className="texto-realcado">Regras de preço</p></h2>
                            <p className="texto">Abaixo do valor mínimo para frete grátis acrescentar valor R$ : {dados.valorAcrescAbaixoMinimo}</p>
                            <p className="texto">Abaixo do valor mínimo para frete grátis acrescentar percentual : {dados.percentAcrescAbaixoMinimo}</p>
                            <h2 className="texto-realcado">Valor para frete grátis : {dados.valorFreteGratis}</h2>
                            <p className="texto">Igual ou acima do valor mínimo para frete grátis acrescentar valor R$ : {dados.valorAcresAcimaMinimo}</p>
                            <p className="texto">Valores frete acima do valor mínimo: (opcionais)</p>
                            <p className="texto">Frete em valor fixo : {dados.valorFixoFreteAcima}</p>
                            <p className="texto">Percentual frete : {dados.valorPercentFreteAcima}</p>
                            <span className="texto">Deseja arredondar para o valor do pedido mínimo em caso de ficar abaixo : <Child /></span>
                            <p className="texto">Valor acima do qual deseja que seja arredondado : {dados.valorAcimaAumentaParaPedidoMinimo}</p>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}