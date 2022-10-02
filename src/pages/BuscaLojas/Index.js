import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import api from "../../config/configApi";
import { servDeleteLoja } from "../../services/servDeleteLoja";
export const BuscaLojas = () => {
    const [lista, setLista] = useState([])
    var { state } = useLocation();
    const [page, setPage] = useState("")
    const [lastPage, setLastPage] = useState("")
    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : "",
    });
    const getLojas = async (page) => {
        if (page === undefined) {
            page = 1
        }
        setPage(page)
        await api.get("/lojas/lojas/" + page)
            .then((response) => {
                setLista(response.data.lojas);
                setLastPage(response.data.lastPage)
            })
            .catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: "Não foram encontradas lojas cadastradas"
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
        getLojas()
    }, [])
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
        <>
            <h1>Lojas</h1>
            <Link to='/'>Home </Link>{" / "}
            <Link to='/buscalojas'>Listar</Link>{" / "}
            <Link to='/criarloja'><button type="button">Criar loja</button></Link>    {" / "}
            <hr />
            {status.type === "error" ? <p>{status.mensagem}</p> : ""}
            {status.type === "success" ? <p> {status.mensagem}</p> : ""}
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Código</th>

                    </tr>
                </thead>

                <tbody>
                    {lista.map((linha) => (
                        <tr key={linha.id}>
                            {linha.length > 0?linha:null}
                            <td>{linha.id}</td>
                            <td>{linha.name}</td>
                            <td>{linha.codigoBling}</td>
                            <td>
                                <Link to={"/buscaloja/" + linha.id}>Visualizar   </Link>
                                <Link to={"/editarloja/" + linha.id}>Editar   </Link>
                                <Link to="#" onClick={() => deleteLoja(linha.id)}>Apagar</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            {page !== 1 ? <button type="button" onClick={() => getLojas(1)}>Primeira</button> : <button type="button" disabled>Primeira</button>}{" "}
            {page !== 1 ? <button type="button" onClick={() => getLojas(page - 1)}>{page - 1}</button> : ""}{" "}
            <button type="button" disabled>{page}</button>{" "}
            {page + 1 <= lastPage ? <button type="button" onClick={() => getLojas(page + 1)}>{page + 1}</button> : ""}{""}
            {page !== lastPage ? <button type="button" onClick={() => getLojas(lastPage)}>Última</button> : <button type="button" disabled>Última</button>}
        </>

    )
}