import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import AsyncSelect from 'react-select/async';
import api from "../../config/configApi";
import { callLojas } from "../../services/servCallCategorias"
import { ExibeData } from "../../services/exibeData"
import { Menu } from "../../Componet/Menu";
import { MenuProfile } from "../../Componet/MenuProfile";
const moment = require('moment')


export const PegaTodosPedidos = () => {
  var { state } = useLocation();
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });
  const [data, setData] = useState([])
  const dataHoje = moment(new Date()).format("DD/MM/YYYY")
  const inicioData = moment(dataHoje).subtract(2, 'days').format("DD/MM/YYYY")
  const [inicioIntervalo, setInicioIntervalo] = useState(inicioData)
  const [fimIntervalo, setFimIntervalo] = useState(dataHoje)
  const [page, setPage] = useState("")
  const [loja, setLoja] = useState("")
  const [lastPage, setLastPage] = useState("")
  const [pedidos, setPedidos] = useState({
    cpfCnpj: '',
    nomeCliente: '',
    data: '',
    valorFrete: '',
    outrasDespesas: '',
    totalProdutos: '',
  })


  useEffect(() => {
    const getPedidos = async () => {
      let idLoja = loja.replace(/\D/g, '')
      const valueToken = localStorage.getItem("token")
      const headers = {
        'headers': {
          'Authorization': 'Bearer ' + valueToken
        }
      }
      await api.get("/pedidos/pedidos/listar/" + idLoja, headers)
        .then((response) => {

          setPage(page)
          setData(response.data)
          setLastPage(response.data.lastPage)
        }).catch((err) => {
          if (err.response) {
            setStatus({
              type: 'false',
              mensagem: err.response.data.mensagem
            })
          } else {
            setStatus({
              type: "true",
              mensagem: "Erro. Tente mais tarde"
            })
          }
        })
    }

    getPedidos()
  }, [loja])


  async function listarPedidos() {
    //setInicioIntervalo(inicioData)
    let inicioFim = {
      inicioIntervalo: moment(inicioIntervalo).format("DD/MM/YYYY"),
      fimIntervalo: moment(fimIntervalo).format("DD/MM/YYYY")
    }

    const valueToken = localStorage.getItem("token")
    const headers = {
      'headers': {
        'Authorization': 'Bearer ' + valueToken
      }
    }

    await api.post("/pedidos/pedidos", inicioFim, headers)
      .then((response) => {
        let qtdRegistros = response.data.length
        for (let i = 0; i <= qtdRegistros; i++) {
          let item = response.data[i]

          setPedidos(
            {
              cpfCnpj: item.pedido.cliente.cnpj,
              nomeCliente: item.pedido.cliente.nome,
              data: item.pedido.data,
              valorFrete: item.pedido.valorfrete,
              outrasDespesas: item.pedido.outrasdespesas,
              totalProdutos: item.pedido.totalprodutos,
              totalCustoProdutos: item.pedido.totalCustoProdutos,
              totalDesconto: item.pedido.totalDesconto
            })

        }
      })
      .catch(() => {
      })
  }

  const valueInputInicio = (e) =>
    setInicioIntervalo(e.target.value)

  const valueInputfim = (e) =>
    setFimIntervalo(e.target.value)

  function MargemPedido(pedidos) {

    return (((pedidos.totalProdutos) - (pedidos.totalCustoProdutos) - (pedidos.outrasDespesas)).toFixed(2)).replace('.', ',')
  }

  function PercentualPedido(pedidos) {

    return ((((pedidos.totalProdutos) - (pedidos.totalCustoProdutos) - (pedidos.outrasDespesas)) * 100) / Number(pedidos.totalProdutos)).toFixed(1).replace(".", ",")
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
                <h1 className="sub-menu-title">Pedidos</h1>
              </div>
            </div>
            
          </div>
          
          


          <div className="sub-menu-title">
          <div className="pesquisa-content">
            <div className="seleciona-wrapped">
              <span className="texto">Escolha uma loja abaixo</span>
              <div className="seleciona-caixa-selecao">

                <div className="seleciona-caixa">
                  <AsyncSelect
                    cacheOptions
                    loadOptions={callLojas}
                    onChange={(e) => setLoja(e.value)}
                    value={"Selecione Loja"}
                    defaultOptions
                  />
                </div>
              </div>
            </div>
          </div> 
            <div className="caixa-selecao-juntas" >
              <label className="texto-realcado"><h3>Loja : {loja} </h3></label>
            </div>
            <div className="sub-menu">

              <span className="texto">Intervalo</span>

              <label className="texto">Início </label>
              <input className="texto" type="date" name="inicioIntervalo" value={inicioIntervalo} onChange={valueInputInicio}></input>
              <label className="texto"> Fim </label>
              <input className="texto" type="date" name="fimIntervalo" value={fimIntervalo} onChange={valueInputfim}></input>



              <div className="sub-menu-title">
                <div className="sub-menu"></div>
                <div className="item-sub-menu"></div>
                <Link to="#" onClick={() => listarPedidos()}><button type="button" className="pesquisa-title-button">Buscar todos Pedidos do intervalo</button><br /></Link>

              </div>
            </div>
          </div>

          <div className="alert-content-adm">
            {status.type === "error" ? <p className="alert-danger"> {status.mensagem}</p> : ""}
            {status.type === "success" ? <p className="alert-success"> {status.mensagem}</p> : ""}
          </div>

          <table className="table-list">
            <thead className="list-head">
              <th className="list-head-content">Data</th>
              <th className="list-head-content">CNPJ</th>
              <th className="list-head-content">Nome</th>
              <th className="list-head-content">Situação</th>
              <th className="list-head-content">Valor Produtos</th>
              <th className="list-head-content">Custo produtos</th>
              <th className="list-head-content">Desconto</th>
              <th className="list-head-content">Frete</th>
              <th className="list-head-content">Outras</th>
              <th className="list-head-content">Margem</th>
              <th className="list-head-content">Perc</th>
              <th className="list-head-content">Ação</th>
            </thead>
            <tbody className="list-body">
              {data.map((pedidos) => (
                <tr key={pedidos.numeroPedidoLoja}>
                  <td className="list-body-content">{ExibeData(pedidos.data)}</td>
                  <td className="list-body-content">{pedidos.cpfCnpj}</td>
                  <td className="list-body-content">{pedidos.nomeCliente}</td>
                  <td className="list-body-content">{pedidos.situacao}</td>
                  <td className="list-body-content">{(Number(pedidos.totalProdutos).toFixed(2)).replace('.', ',')}</td>
                  <td className="list-body-content">{(Number(pedidos.totalCustoProdutos).toFixed(2)).replace('.', ',')}</td>
                  <td className="list-body-content">{(Number(pedidos.totalDesconto).toFixed(2)).replace('.', ',')}</td>
                  <td className="list-body-content">{(Number(pedidos.valorFrete).toFixed(2)).replace('.', ',')}</td>
                  <td className="list-body-content">{(Number(pedidos.outrasDespesas).toFixed(2)).replace('.', ',')}</td>
                  <td className="list-body-content">{MargemPedido(pedidos)}</td>
                  <td className="list-body-content">{PercentualPedido(pedidos)}%</td>
                  {lastPage}
                  <td className="list-body-content">
                    <div className="alert-primary">
                      <Link to={"/pedidos/" + pedidos.numeroPedidoLoja + "/" + pedidos.idLojaVirtual} className="alert-primary">Visualizar</Link>
                    </div>
                  </td>
                </tr>

              ))}

            </tbody>
          </table>
        </div>
      </div >
    </div >
  )
}