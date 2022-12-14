import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom"
import api from "../../config/configApi";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";


export const BuscaLoja = () => {
    var { loja, name } = useParams()
    var { state } = useLocation();
    const [dados, setDados] = useState([])

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
                        id: response.data.id,
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
                            mensagem: "Loja n??o encontrada. Tente mais tarde",
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



    const Child = () => {
        if (dados.aumentaValorPedidoMinimo === true) {
            return <div>Sim</div>
        }
        return <div>N??o</div>
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
                                <h1 className="sub-menu-title">Visualizar Loja</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to={"/buscaloja/" + loja}><button type="button" className="pesquisa-title-button">Visualizar</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to={"/editarloja/" + loja}><button type="button" className="pesquisa-title-button">Editar</button> </Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to={"/deletaloja/" + loja}><button type="button" className="pesquisa-title-button">Apagar</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/buscalojas'><button type="button" className="pesquisa-title-button">Listar Lojas</button> </Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to={'/produtosloja/' + loja + "/" + dados.name}><button type="button" className="pesquisa-title-button">Listar Produtos</button> </Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/criarloja'><button type="button" className="pesquisa-title-button">Criar Loja</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to={'/precificar/' +loja + "/"+ dados.name}><button type="button" className="pesquisa-title-button">Precificar Loja</button></Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="alert-content-adm">
                        {status.type === "success" ? <p className="alert-success">{status.mensagem}</p> : ("")}
                        {status.type === "error" ? <p className="alert-danger">{status.mensagem}</p> : ("")}
                    </div>
                    <div className="table-list">


                        <div className="texto-wrapped">
                            <h1 className="texto-realcado">Nome : {dados.name}<br /></h1>
                            <p className="texto">C??digo no Bling : {dados.codigoBling}</p>
                            <p className="texto">Comiss??o : {dados.comissao}</p>
                            <p className="texto">Margem Bruta : Igual ou acima do valor m??nimo acrescentar percentual : {dados.percentAcrescAcimaMinimo}</p>
                            <h2><p className="texto-realcado">Regras de pre??o</p></h2>
                            <p className="texto">Abaixo do valor m??nimo para frete gr??tis acrescentar valor R$ : {dados.valorAcrescAbaixoMinimo}</p>
                            <p className="texto">Abaixo do valor m??nimo para frete gr??tis acrescentar percentual : {dados.percentAcrescAbaixoMinimo}</p>
                            <h2 className="texto-realcado">Valor para frete gr??tis : {dados.valorFreteGratis}</h2>
                            <p className="texto">Igual ou acima do valor m??nimo para frete gr??tis acrescentar valor R$ : {dados.valorAcresAcimaMinimo}</p>
                            <p className="texto">Valores frete acima do valor m??nimo: (opcionais)</p>
                            <p className="texto">Frete em valor fixo : {dados.valorFixoFreteAcima}</p>
                            <p className="texto">Percentual frete : {dados.valorPercentFreteAcima}</p>
                            <span className="texto">Deseja arredondar para o valor do pedido m??nimo em caso de ficar abaixo : <Child /></span>
                            <p className="texto">Valor acima do qual deseja que seja arredondado : {dados.valorAcimaAumentaParaPedidoMinimo}</p>
                            {verifica === true ? <div className="c-loader"></div> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}