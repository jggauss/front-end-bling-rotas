import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
import { FormataData } from "../../services/formataData";
import api from "../../config/configApi";
import { FormataDataHoje } from "../../services/formataDataHoje";

export const AplicarPromocao = () => {
    const { loja } = useParams()
    var [market, setMarket] = useState("")
    const [exibeLista,setExibeLista]=useState([])
    const [numeros, setNumeros] = useState({
        descPercentual: 0,
        descReal: 0,
        inicioOferta: "",
        fimOferta: "",
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
        inicioOfertaHora:'' ,
        fimOferta: new Date(),
        fimOfertaHora:'' 
    })
    var { state } = useLocation();
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const dataHoje = new Date()

    const valueInput = (e) => {
        setNumeros({ ...numeros, [e.target.name]: e.target.value.replace(/\D[^,]\D/g,'') })
    };

   


    const nomeLoja = async (loja) => {
        await api.get("/loja/" + loja)
            .then((dadosLoja) => {
                setMarket(dadosLoja.data.name)
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

    const getPromocao = async (e) => {
        let verificaListaVazia =  localStorage.getItem("listaSelecionados")
        if(verificaListaVazia===""){
            setStatus({
                type: "errorVolta",
                mensagem: "Erro. Nenhum item selecionado.Marque os itens que deseja incluir na promoção antes de aplicar a promoção",
            });
    
        }
    
        setExibeLista(localStorage.getItem("listaSelecionados").replace(/,/g,"  /  "))
        nomeLoja(loja)
        setNumeros(numeros)
    }

    useEffect(() => {
        getPromocao()
    }, [numeros.fimOferta])

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
        if (FormataData(numeros.inicioOferta) < FormataDataHoje(dataHoje)) {
            setStatus({
                type: "error",
                mensagem: "Erro. Data de início da promoção menor que a data de hoje",
            });
            return
        }
        if (FormataData(numeros.fimOferta) <= FormataData(numeros.inicioOferta)) {
            setStatus({
                type: "error",
                mensagem: "Erro. Data de início da promoção menor que a data do fim",
            });
            return
        }
        setStatus({
            type: "success",
            mensagem: "Promoção cadastrada com sucesso",
        });
        var listaProdutos = localStorage.getItem("listaSelecionados").split(',')
        async function salvaOferta(dadosOferta){
            await api.put('/produtoloja/' + loja + "/" + dadosOferta.produtoid, dadosOferta)
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
        for(let i= 0; i< listaProdutos.length; i++){
            await api.get("/produtoloja/" + loja + "/" + listaProdutos[i])
                .then((produto) => {
                    let valorDescPerc = (produto.data.precoVenda * (numeros.descPercentual / 100))
                    let valorFinalPromocao = Number(produto.data.precoVenda) - Number(valorDescPerc) - Number(numeros.descReal)
                        dadosOferta.id= produto.data.id
                        dadosOferta.idLojaVirtual= produto.data.idLojaVirtual
                        dadosOferta.idProdutoLoja= produto.data.idProdutoLoja
                        dadosOferta.lojaid= produto.data.lojaid
                        dadosOferta.marca= produto.data.marca
                        dadosOferta.name= produto.data.name
                        dadosOferta.namecategoria= produto.data.namecategoria
                        dadosOferta.precoVenda= produto.data.precoVenda
                        dadosOferta.produtoid= produto.data.produtoid
                        dadosOferta.tipoSimplesComposto= produto.data.tipoSimplesComposto
                        dadosOferta.precoOferta= valorFinalPromocao
                        dadosOferta.inicioOferta= FormataData(numeros.inicioOferta)
                        dadosOferta.inicioOfertaHora= numeros.inicioOfertaHora
                        dadosOferta.fimOferta= FormataData(numeros.fimOferta)
                        dadosOferta.fimOfertaHora= numeros.fimOfertaHora
                    salvaOferta(dadosOferta)
                }).catch(() => {})
        }
        localStorage.clear()
       
    }




    return (
        <div>
            <h1>Aplicar Promoção</h1>
            <Link to='/'>Home </Link>{" / "}
            <Link to={'/pegaTodosProdutos/categoria/' + loja}>Produtos por categoria </Link>{" / "}
            <Link to={'/produtosloja/' + loja}> Produtos por Marca </Link>{" / "}
            <Link to={'/produtosloja/pesquisa/' + loja}> Produtos por Nome </Link>{" / "}
            <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
            <hr />
            <h2>Loja :{market}</h2>
            {status.type === "error" ? <p> {status.mensagem}</p> : ""}
            {status.type === "errorVolta" ? (<Navigate to={'/produtosloja/' + loja} state={status} />) : ""}
            {status.type === "success" ? (<Navigate to={'/buscaloja/' + loja} state={status} />) : ""}

            <label>Desconto em percentual : </label>
            <input type="text" name="descPercentual" placeholder="Desconto em percentual" value={numeros.descPercentual} onChange={valueInput}></input>
            <label> e/ou Desconto em valor : </label>
            <input type="text" name="descReal" placeholder="Desconto em Reais" value={numeros.descReal} onChange={valueInput}></input><br />


            <form onSubmit={montaPromo}>
                <label>Data início da promoção : </label>
                <input type="date" name="inicioOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput} ></input>
                <label>Hora início da promoção : </label>
                <input type="time" name="inicioOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$"  ></input><br />
                <label>Data fim da promoção : </label>
                <input type="date" name="fimOferta" pattern="^[0-9]*[.,]?[0-9]*$" onChange={valueInput}  ></input>
                <label>Hora fim da promoção : </label>
                <input type="time" name="fimOfertaHora" pattern="^[0-9]*[.,]?[0-9]*$"   ></input>
                <button type="submit">Enviar promocao</button>
            </form><br/>

            <span>SKU dos Produtos selecionados : {exibeLista}</span>


        </div>

    )
}