import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom"
import api from "../../config/configApi";
import { servDeleteLoja } from "../../services/servDeleteLoja";
import * as yup from 'yup';
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";
export const EditaLoja = (props) => {
    var { loja } = useParams()
    const [status, setStatus] = useState({
        type: "",
        mensagem: "",
    });
    const [user, setUser] = useState({
        name: "",
        codigo: "",

    });

    const valueInput = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });
    const [numeros, setNumeros] = useState({

        comissao: "",
        valorAcrescAbaixoMinimo: "",
        percentAcrescAbaixoMinimo: "",
        valorFixoFreteAbaixo: "",
        valorPercentFreteAbaixo: "",
        valorFreteGratis: "",
        valorAcresAcimaMinimo: "",
        percentAcrescAcimaMinimo: "",
        valorFixoFreteAcima: "",
        valorPercentFreteAcima: "",
        aumentaValorPedidoMinimo: "",
        valorAcimaAumentaParaPedidoMinimo: ""
    });
    const valueInput2 = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(/\D[^,]\D/g, '') });


    const editLoja = async (e) => {
        e.preventDefault()
        if (!(await validate())) return
        numeros.comissao = Number(numeros.comissao.replace(",", "."))
        numeros.valorAcrescAbaixoMinimo = Number(numeros.valorAcrescAbaixoMinimo.replace(",", "."))
        numeros.percentAcrescAbaixoMinimo = Number(numeros.percentAcrescAbaixoMinimo.replace(",", "."))
        numeros.valorFixoFreteAbaixo = Number(numeros.valorFixoFreteAbaixo.replace(",", "."))
        numeros.valorPercentFreteAbaixo = Number(numeros.valorPercentFreteAbaixo.replace(",", "."))
        numeros.valorFreteGratis = Number(numeros.valorFreteGratis.replace(",", "."))
        numeros.valorAcresAcimaMinimo = Number(numeros.valorAcresAcimaMinimo.replace(",", "."))
        numeros.percentAcrescAcimaMinimo = Number(numeros.percentAcrescAcimaMinimo.replace(",", "."))
        numeros.valorFixoFreteAcima = Number(numeros.valorFixoFreteAcima.replace(",", "."))
        numeros.valorPercentFreteAcima = Number(numeros.valorPercentFreteAcima.replace(",", "."))
        numeros.valorAcimaAumentaParaPedidoMinimo = Number(numeros.valorAcimaAumentaParaPedidoMinimo.replace(",", "."))
        var dadosLoja = { ...user, ...numeros }
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.put('/lojas/loja/' + loja, dadosLoja, headers)
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
                } else {
                    setStatus({
                        type: "error",
                        mensagem: "Erro. Tente mais tarde",
                    });
                }
            })
    }
    useEffect(() => {
        const getLoja = async () => {
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api
                .get("/lojas/loja/" + loja, headers)
                .then((response) => {
                    setUser({
                        name: response.data.name,
                        codigo: response.data.codigoBling
                    }
                    )
                    setNumeros({
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

                })
        }
        getLoja()
    }, [loja])
    const marcaCheckbox = async (e) => {
        return numeros.aumentaValorPedidoMinimo = true
    }
    async function validate() {
        let schema = yup.object().shape({
            percentAcrescAcimaMinimo: yup.string("Erro. Margem Bruta deve ser preenchida").required("Erro. Margem Bruta deve ser preenchida"),
            comissao: yup.string("Erro. Comissão deve ser entre 0 e 40%").required("Erro. Comissão deve ser entre 0 e 40%"),
            codigo: yup.string("Erro. O código da loja no Bling dev ser preenchido. Você pode pegá-lo na configuração da loja no Bling")
                .required("Erro. O código da loja no Bling deve ser preenchido. Você pode pegá-lo na configuração da loja no Bling"),
            name: yup.string("Erro. O nome deve ser preenchido.").required("Erro. O nome deve ser preenchido."),
        })

        try {
            await schema.validate({
                name: user.name,
                codigo: user.codigo,
                comissao: numeros.comissao,
                percentAcrescAcimaMinimo: numeros.percentAcrescAcimaMinimo

            })
            return true
        } catch (err) {
            setStatus({
                type: "error",
                mensagem: err.errors,
            });
            return false
        }
    }
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
    return (
        <div>
            <MenuProfile />
            <div className="content">
                <Menu active="users" />
                <div className="wrapper">
                    <div className="row">
                        <div className="top-content-admin">
                            <div className="title-content">
                                <h1 className="sub-menu-title">Editar Loja</h1>
                            </div>
                            <div className="sub-menu-title">
                                <div className="sub-menu">
                                    <div className="item-sub-menu">
                                        <Link to={"/buscaloja/" + loja}><button type="button" className="pesquisa-title-button">Visualizar</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to={"/editarloja/" + loja}><button type="button" className="pesquisa-title-button">Editar</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to="#" onClick={() => deleteLoja(loja)}><button type="button" className="pesquisa-title-button">Apagar</button></Link>
                                    </div>
                                    <div className="item-sub-menu">
                                        <Link to='/buscalojas'><button type="button" className="pesquisa-title-button">Listar Lojas</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="alert-content-adm">
                            {status.type === "error" ? (<p>{status.mensagem}</p>) : ("")}
                            {status.type === "success" ? (<Navigate to="/buscalojas" state={status} />) : ("")}
                            </div>
                        <form onSubmit={editLoja} className="texto-wrapped">
                            <label className="texto">Nome* : </label>
                            <input className="texto" type="text" name="name" placeholder="Nome do Marketplace" value={user.name} onChange={valueInput} ></input><br />
                            <label className="texto">Código da loja no Bling* : </label>
                            <input className="texto" type="text" name="codigo" disabled={true} onChange={valueInput} value={user.codigo}></input>Não é permitido trocar o código da loja no Bling. Caso nescessite apague e faça novo cadastro<br />
                            <label className="texto">% Comissão* : </label>
                            <input className="texto" type="text" name="comissao" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Percentual de comissão pago na loja" onChange={valueInput2} value={numeros.comissao}></input><br />
                            <label className="texto">Margem Bruta : Igual ou acima do valor mínimo acrescentar percentual* : </label>
                            <input className="texto" type="text" name="percentAcrescAcimaMinimo" placeholder="Valor em Percentual" onChange={valueInput2} value={numeros.percentAcrescAcimaMinimo} ></input><br />
                            <h2 className="texto-realcado">Regras de preço:</h2>
                            <label className="texto">Abaixo do valor mínimo para frete grátis acrescentar valor R$ : </label>
                            <input className="texto" type="text" name="valorAcrescAbaixoMinimo" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorAcrescAbaixoMinimo}></input><br />
                            <label className="texto">Abaixo do valor mínimo para frete grátis acrescentar percentual : </label>
                            <input className="texto" type="text" name="percentAcrescAbaixoMinimo" placeholder="Valor em Percentual" onChange={valueInput2} value={numeros.percentAcrescAbaixoMinimo}></input>
                            <br />
                            <h2 className="texto-realcado"><label>Valor para frete grátis : </label></h2>
                            <input className="texto" type="text" name="valorFreteGratis" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorFreteGratis} ></input><br /> 
                            <label className="texto">Igual ou acima do valor mínimo para frete grátis acrescentar valor R$ : </label>
                            <input className="texto" type="text" name="valorAcresAcimaMinimo" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorAcresAcimaMinimo}></input><br />
                            <p>Valores frete acima do valor mínimo: (opcionais)</p>
                            <label className="texto">Frete em valor fixo : </label>
                            <input className="texto" type="text" name="valorFixoFreteAcima" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorFixoFreteAcima}></input><br />
                            <label className="texto">Percentual frete : </label>
                            <input className="texto" type="text" name="valorPercentFreteAcima" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorPercentFreteAcima}></input><br />
                            <label className="texto">Deseja arredondar para o valor do pedido mínimo em caso de ficar abaixo : </label>
                            <input className="texto" type="checkbox" name="aumentaValorPedidoMinimo" onChange={marcaCheckbox} value={numeros.aumentaValorPedidoMinimo}></input><br />
                            <label className="texto">Valor acima do qual deseja que seja arredondado : </label>
                            <input className="texto" type="text" name="valorAcimaAumentaParaPedidoMinimo" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorAcimaAumentaParaPedidoMinimo} ></input><br />
                            <button type="submit" className="pesquisa-title-button">Cadastrar</button>
                            <br /><br />
                            * Campos com asterísco são obrigatórios
                        </form>
                    </div>
                </div>
            </div>
        
    )
}