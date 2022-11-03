import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom"
import api from "../../config/configApi";
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";


export const ConfirmaBuscarProdutos = () => {
    var [bloco, setBloco] =useState(0)
    var[percent,setPercent] = useState(0)


    var { state } = useLocation();
    
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
   
    const buscaProdutos = async () => {
      console.log("Oi vou buscar geral")
      const valueToken = localStorage.getItem("token")

      //pega os produtos ativos e depois os inativos

      var situacao = ""
      let  contaBloco = 0
      for (let sit = 0; sit < 2; sit++) {
          if (sit === 0) { situacao = "A" }
          if (sit === 1) { situacao = "I" }

          //pega 100 produtos de cada vez 100 vezes até o break
          for (var i = 0; i < 100; i++) {
              contaBloco= contaBloco+1
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
                  if(todosProdutos.length<99){break}
              } catch (error) {
              }
          }
      }
      setStatus({
          type: "success",
          mensagem: "Todos os produtos da loja foram baixados do Bling"
      })
  
      
    };


    async function precificaSalva(todosProdutos) {
        //aqui monta  e salva
        
        let tamanho = todosProdutos.length
        for (let a = 0; a < tamanho; a++) {
            setPercent(a)
            const dadosProduto= todosProdutos[a]
            const valueToken = localStorage.getItem("token")
            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + valueToken
                }
            }
            await api.post('/produtos/encontraesalva',(dadosProduto), headers)
                .then(() => {})
                .catch(() => { })
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
                                <h1 className="sub-menu-title">Confirma Buscar Produtos no Bling?</h1>
                            </div>
                        </div>
                    </div>
                    {bloco===0?<span className="alert-danger">Você deseja atualizar todos os produtos e seus respectivos custos no Bling? Esta operação pode demorar alguns minutos.</span>:""}

                    <div className="alert-content-adm">
                        {bloco>0?<p className="alert-info">Blocos de 100 produtos ativos e inativos baixados : {bloco} - Percentual baixado deste bloco :{percent+1} %</p>:bloco===100?<p className="alert-success">Todos os produtos foram baixados :{percent+1} %</p>:""}
                        {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
                        {status.type === "success" ? <p className="alert-info"> {status.mensagem}</p> : ""}
                        {status.type === "exsuccess" ? <p className="alert-success"> {status.mensagem}</p> : ""}
                    </div>
                    <div className="table-list">
                        <div className="item-sub-menu">
                            <Link to="#" onClick={() => buscaProdutos()}><button type="button" className="pesquisa-title-button">Confirma</button></Link>
                            <Link to={'/produtos'}><button type="button" className="pesquisa-title-button">Cancelar</button></Link>
                        </div>
                        <br />
                       
                    </div>
                </div>
            </div>
        </div>
    )
}