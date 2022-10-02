import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import AsyncSelect from 'react-select/async';
import api from "../../config/configApi";

import { callLojas } from "../../services/servCallCategorias"
import { ExibeDataDia } from "../../services/exibeDataDia"
import { ExibeData } from "../../services/exibeData"
import { SomaDias } from "../../services/servSomaDias";

export const PegaTodosPedidos = () => {
  var { state } = useLocation();
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });
  
  const [data, setData] = useState([])
  const dataHoje = new Date()
  const inicioData = ()=> SomaDias()
  const [inicioIntervalo, setInicioIntervalo] = useState(inicioData)
  
  
  const [fimIntervalo, setFimIntervalo] = useState(dataHoje)
  const [page, setPage] = useState("")
  const [loja, setLoja] = useState("Selecione Loja")
  const [lastPage, setLastPage] = useState("")
  const [pedidos, setPedidos] = useState({
    cpfCnpj: '',
    nomeCliente: '',
    data: '',
    valorFrete: '',
    outrasDespesas: '',
    totalProdutos: '',

  })

  const [verifica, setVerifica] = useState(false)
 
  const getPedidos = async () => {
    setLoja(loja)
    let idLoja = loja.replace(/\D/g, '')
    await api.get("/pedidos/pedidos/listar/" + idLoja)
      .then((response) => {

        setPage(page)
        setData(response.data)
        setLastPage(response.data.lastPage)
      }).catch((err) => {
        if (err.response) {
          setStatus({
            type: 'error',
            mensagem: err.response.data.mensagem
          })
        } else {
          setStatus({
            type: "error",
            mensagem: "Erro. Tente mais tarde"
          })
        }
      })
  }
  useEffect(() => {
    getPedidos()
  }, [loja])
  
  
  async function listarPedidos() {
    setVerifica(true)
    setInicioIntervalo(inicioData)

    let inicioFim = {
      inicioIntervalo:ExibeData(inicioIntervalo),
      fimIntervalo:ExibeDataDia(fimIntervalo)
    }
    await api.post("/pedidos/pedidos",inicioFim)
      .then((response) => {
        let qtdRegistros = response.data.length
        for (let i = 0; i <= qtdRegistros; i++) {
          let item = response.data[i]

          pedidos.cpfCnpj = item.pedido.cliente.cnpj
          pedidos.nomeCliente = item.pedido.cliente.nome
          pedidos.data = item.pedido.data
          pedidos.valorFrete = item.pedido.valorfrete
          pedidos.outrasDespesas = item.pedido.outrasdespesas
          pedidos.totalProdutos = item.pedido.totalprodutos
          pedidos.totalCustoProdutos = item.pedido.totalCustoProdutos
          pedidos.totalDesconto = item.pedido.totalDesconto

        }

        setVerifica(false)

      })
      .catch(() => {

      })
    

  }

  const valueInputInicio = (e)=>
  setInicioIntervalo(e.target.value)

  const valueInputfim = (e)=>
  setFimIntervalo(e.target.value)

  function resultadoMargem(){
    
  }

  return (
    <div>
      <h1>Pedidos</h1>
      <Link to='/'>Home </Link>{" / "}
      <Link to='/produtos'>Produtos</Link>{" / "}
      <Link to='/buscalojas'>Lojas</Link>{" / "}
      <Link to='/pedidos'>Pedidos</Link>{" / "}
      <br/>
      <span>Intervalo</span><br/>
      
      <label>Início </label>
      <input type="date" name="inicioIntervalo" value={inicioIntervalo} onChange={valueInputInicio}></input>
      <label> Fim </label>
      <input type="date" name="fimIntervalo" value={fimIntervalo} onChange = {valueInputfim}></input>
      <Link to="#" onClick={() => listarPedidos()}><button type="button">Buscar todos Pedidos do intervalo</button><br /></Link>
      <br/>
      <label>Loja : {loja} </label>
      <AsyncSelect
        cacheOptions
        loadOptions={callLojas}
        onChange={(e) => setLoja(e.value)}
        value={"Selecione Loja"}
        defaultOptions
      />
      <hr />
      {status.type === "error" ? <p> {status.mensagem}</p> : ""}
      {status.type === "success" ? <p> {status.mensagem}</p> : ""}
      
      {verifica === true ? <div className="c-loader"></div> : <div className="exibe"></div>}
      <tabe>
        <thead>
          <th>Data</th>
          <th>CNPJ</th>
          <th>Nome</th>
          <th>Situação</th>
          <th>Valor Produtos</th>
          <th>Custo produtos</th>
          <th>Desconto</th>
          <th>Frete</th>
          <th>Outras</th>
          <th>Margem</th>
          <th>Perc</th>
        </thead>
        <tbody>
          {data.map((pedidos) => (
            <tr key={pedidos.numeroPedidoLoja}>
              <td>{ExibeData(pedidos.data)}</td>
              <td>{pedidos.cpfCnpj}</td>
              <td>{pedidos.nomeCliente}</td>
              <td>{pedidos.situacao}</td>
              <td>{(Number(pedidos.totalProdutos).toFixed(2)).replace('.',',')}</td>
              <td>{(Number(pedidos.totalCustoProdutos).toFixed(2)).replace('.',',')}</td>
              <td>{(Number(pedidos.totalDesconto).toFixed(2)).replace('.',',')}</td>
              <td>{(Number(pedidos.valorFrete).toFixed(2)).replace('.',',')}</td>
              <td>{(Number(pedidos.outrasDespesas).toFixed(2)).replace('.',',')}</td>
              <td>{(((pedidos.totalProdutos)-(pedidos.totalCustoProdutos)-(pedidos.outrasDespesas)).toFixed(2)).replace('.',',')}</td>
              <td>{((((pedidos.totalProdutos)-(pedidos.totalCustoProdutos)-(pedidos.outrasDespesas))*100)/Number(pedidos.totalProdutos)).toFixed(1).replace(".",",")}%</td>
              
              <td>
                <div>
                  <Link to={"/pedidos/" + pedidos.numeroPedidoLoja + "/" + pedidos.idLojaVirtual}>Visualizar</Link>
                </div>
              </td>
            </tr>

          ))}

        </tbody>
      </tabe>




    </div>

  )
}