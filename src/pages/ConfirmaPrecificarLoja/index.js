import React, { useState } from "react";
import { Link, useLocation, Navigate, useParams } from "react-router-dom"
import api from "../../config/configApi";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";


export const ConfirmarPrecificarLoja = () => {
    var [bloco, setBloco] = useState(0)
    const { id, name } = useParams()
    var [percent, setPercent] = useState(0)
    var [percentualev, setPercentualev] = useState(0)

    var { state } = useLocation();

    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });






    async function precificarLoja(loja) {
        setPercentualev(0.1)


        //este bloco atualiza todos os produtos do Bling
        const buscaProdutos = async () => {

            const valueToken = localStorage.getItem("token")

            //pega os produtos ativos e depois os inativos

            var situacao = ""
            let contaBloco = 0
            for (let sit = 0; sit < 2; sit++) {
                if (sit === 0) { situacao = "A" }
                if (sit === 1) { situacao = "I" }

                //pega 100 produtos de cada vez 100 vezes até o break
                for (var i = 0; i < 100; i++) {
                    contaBloco = contaBloco + 1
                    setBloco(contaBloco)
                    const headers = {
                        'headers': {
                            'Authorization': 'Bearer ' + valueToken
                        }
                    }
                    var dados = {
                        situacao: situacao,
                        i: i
                    }
                    try {
                        const cemProdutos = await api.post('/produtos/buscaprodutosbling', (dados), headers)
                        const todosProdutos = cemProdutos.data
                        await precificaSalva(todosProdutos)
                        if (todosProdutos.length < 99) { break }
                    } catch (error) {
                    }
                }
            }
            setStatus({
                type: "success",
                mensagem: "Todos os produtos da loja foram atualizados do Bling"
            })


        };


        async function precificaSalva(todosProdutos) {
            //aqui monta  e salva

            let tamanho = todosProdutos.length
            for (let a = 0; a < tamanho; a++) {
                setPercentualev((a + 1) * 100 / todosProdutos.length)
                const dadosProduto = todosProdutos[a]
                const valueToken = localStorage.getItem("token")
                const headers = {
                    'headers': {
                        'Authorization': 'Bearer ' + valueToken
                    }
                }
                await api.post('/produtos/encontraesalva', (dadosProduto), headers)
                    .then(() => { })
                    .catch(() => { })
            }
        }

        await buscaProdutos()
        //terminei atualizar agora vou precificar

        setPercentualev(0)

        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        const dadosLoja = await api.get('/lojas/lojabling/' + loja, headers)
        const tudo = await api.get('/produtos/produtos', headers)
        const todosProdutos = tudo.data
        setPercent({
            tamanho: todosProdutos.length,
            percent: 0
        })
        var codigoBling = loja
        var tamanho = todosProdutos.length

        for (let i = 0; i < todosProdutos.length; i++) {
            let produto = todosProdutos[i].codigo
            setPercent({
                tamanho: todosProdutos.length,
                percent: ((i + 1) / tamanho) * 100
            })

            let parametros = {
                produto: produto,
                codigoBling: codigoBling,
                loja: dadosLoja.data,
                produtoCompleto: todosProdutos[i],
            }
            //console.log(parametros)
            //aqui manda para a api fazer 

            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.post('/produtoslojas/precificalojaconta/' + loja, (parametros), headers)
                .then((response) => { })
                .catch((err) => { })
            async function espera(ms) {
                return await new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }
            espera(800)
        }
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
                                <h1 className="sub-menu-title">Confirma Precificar todos os Produtos da Loja?</h1>
                            </div>
                        </div>
                    </div>

                    <div className="wrapper">
                        <p className="texto"><h2>Nome : {name}</h2></p>
                        <p className="texto">Loja : {id}</p>
                    </div>


                    {bloco === 0 ? <span className="alert-danger">Você deseja atualizar todos os Produtos, precificar e salvar no Bling? Esta operação pode demorar alguns minutos.</span> : ""}

                    <div className="alert-content-adm">
                        {percentualev > 0 ? <p className="alert-info">Primeira etapa: Atualizando Custos do Bling. Blocos de 100 produtos ativos e inativos baixados : {bloco} - Percentual baixado deste bloco :{percentualev.toFixed(2)} %</p> : bloco === 100 ? <p className="alert-success">Todos os produtos foram baixados :{percentualev.toFixed(2)} %</p> : ""}
                        {percent.percent > 0 ? <p className="alert-info">Total de produtos a verificar {percent.tamanho} - Percentual precificado {percent.percent.toFixed(1)} %</p> : percent.percent === 100 ? <p className="alert-success">Todos os custos atualizados do Bling, produtos precificados, e os preços de venda enviados para o Bling. Total de produtos {percent.tamanho} - Percentual {percent.percent.toFixed(1)} %</p> : ""}

                        {status.type === "success" ? <p className="alert-success">{status.mensagem}</p> : ("")}
                        {status.type === "error" ? <p className="alert-danger">{status.mensagem}</p> : ("")}
                    </div>

                    <div className="wrapper">
                        <div className="table-list">
                            <div className="item-sub-menu">
                                <Link to="#" onClick={() => precificarLoja()}><button type="button" className="pesquisa-title-button">Confirma</button></Link>
                                <Link to={'/buscalojas'}><button type="button" className="pesquisa-title-button">Voltar</button></Link>
                            </div>
                            <br />

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}