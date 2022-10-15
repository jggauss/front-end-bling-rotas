import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom"
import api from "../../config/configApi";
import * as yup from 'yup';
export const CriarLoja = () => {
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
        aumentaValorPedidoMinimo: false,
        valorAcimaAumentaParaPedidoMinimo: ""
    });
    const valueInput2 = (e) =>
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(/\D[^,]\D/g, '') });
    const addLoja = async (e) => {
        e.preventDefault()
        if (!(await validate())) return
        const dadosLoja = { ...user, ...numeros }
        
        await api.post('/lojas/lojas', dadosLoja)
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
    return (
        <>
            <h1>Criar Loja</h1>
            <Link to='/home'>Home </Link>{" / "}
            <Link to='/buscalojas'>Listar Lojas</Link>{" / "}
            <hr />
            {status.type === "error" ? (<p>{status.mensagem}</p>) : ("")}
            {status.type === "success" ? (<Navigate to="/buscalojas" state={status} />) : ("")}
            <form onSubmit={addLoja}>
                <label>Nome* : </label>
                <input type="text" name="name" placeholder="Nome do Marketplace" onChange={valueInput}></input><br />
                <label>Código da loja no Bling* : </label>
                <input type="text" name="codigo" placeholder="Código numérico da loja no Bling" onChange={valueInput}></input><br />
                <label>* % Comissão* : </label>
                <input type="text" name="comissao" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Percentual de comissão pago na loja" onChange={valueInput2} value={numeros.comissao} ></input><br />
                <label>Margem Bruta : Igual ou acima do valor mínimo acrescentar percentual* : </label>
                <input type="text" name="percentAcrescAcimaMinimo" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Percentual" onChange={valueInput2} value={numeros.percentAcrescAcimaMinimo} ></input><br />
                <h2>Regras de preço:</h2>
                <label>Abaixo do valor mínimo para frete grátis acrescentar valor R$ : </label>
                <input type="text" name="valorAcrescAbaixoMinimo" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorAcrescAbaixoMinimo} ></input><br />
                <label>Abaixo do valor mínimo para frete grátis acrescentar percentual : </label>
                <input type="text" name="percentAcrescAbaixoMinimo" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Percentual" onChange={valueInput2} value={numeros.percentAcrescAbaixoMinimo} ></input><br />
                <br />
                <h2><label>Valor para frete grátis : </label>
                <input type="text" name="valorFreteGratis" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorFreteGratis} ></input><br /></h2>
                <label>Igual ou acima do valor mínimo para frete grátis acrescentar valor R$ : </label>
                <input type="text" name="valorAcresAcimaMinimo" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorAcresAcimaMinimo} ></input><br />
                <p>Valores frete acima do valor mínimo: (opcionais)</p>
                <label>Frete em valor fixo : </label>
                <input type="text" name="valorFixoFreteAcima" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorFixoFreteAcima} ></input><br />
                <label>Percentual frete : </label>
                <input type="text" name="valorPercentFreteAcima" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorPercentFreteAcima} ></input><br />
                <br />
                <label>Deseja arredondar para o valor do pedido mínimo em caso de ficar abaixo : </label>
                <div>
                    <input type="checkbox" name="aumentaValorPedidoMinimo" onChange={marcaCheckbox} value={numeros.aumentaValorPedidoMinimo}></input><br />
                </div>
                <label>Valor acima do qual deseja que seja arredondado : </label>
                <input type="text" name="valorAcimaAumentaParaPedidoMinimo" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="Valor em Real" onChange={valueInput2} value={numeros.valorAcimaAumentaParaPedidoMinimo} ></input><br />
                <button type="submit">Cadastrar</button>
                <br /><br />
                * Campos com asterísco são obrigatórios
            </form>
        </>
    )
}