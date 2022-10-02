import React, { useEffect,useState } from "react";
import {Link, useParams} from "react-router-dom"
import api from "../../config/configApi";
export const BuscaUmProduto = ()=>{
  const [status, setStatus] = useState({
    type:  "",
    mensagem: "",
  });
    var { id }= useParams()
    
    const [dados, setDados] = useState([]);
    useEffect(()=>{
    const getProduto =()=>{
        api.get("produtos/pegaumproduto/"+id)
        .then((response)=>{
            const dadosBrutos = (response.data)
            const dados = dadosBrutos[0].produto
            //console.log(dados)
            setDados(dados)
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
        getProduto()
    },[id])
    return (
            <div>
                <h1>Busca um produto</h1>
                <Link to='/'>Home </Link>{" / "}
                <Link to='/pegaTodosProdutos'>Busca Todos os Produtos </Link>{" / "}
                <Link to='/buscalojas'>Listar Lojas</Link>{" / "}
                <Link to='/produtos/zerados'>Produtos com custo zero</Link>{" / "}
                <hr/>
                {status.type === "error" ? <p> {status.mensagem}</p> : ""}
                {status.type === "success" ? <p> {status.mensagem}</p> : ""}
                SKU : {dados.id}
                <br/>
                Nome : {dados.descricao}
                <br/>
                Codigo : {dados.codigo}
                <br/>
                Situação : {dados.situacao}
                <br/>
                Preço de custo : {dados.precoCusto}
                <br/>
                Marca : {dados.marca}
                <br/>
                Fornecedor : {dados.nomeFornecedor}
                <br/>
            </div>
    )
}