import api from "../config/configApi"
import { montaCategoria } from "./servMontaCategoria"
import { montaLoja } from "./servMontaLoja"
import { montaTexto } from "./servMontaMenu"
export const callCategorias = async (idLoja) => {
    const data = await api.get("/servicos/categorias")
        .then((menuCategorias) => montaCategoria(menuCategorias))
        .catch((err) => {
            // let status={
            //     type: 'error',
            //     mensagem: err.response.data.mensagem
            // }
        })
    return data
}

export const callApi = async (idLoja) => {
    const data = await api.get("/servicos/marcas")
        .then((menuMarcas) => montaTexto(menuMarcas))
        .catch((err) => {
            // let status={
            //     type: 'error',
            //     mensagem: err.response.data.mensagem
            // }
        })
    return data
}


export const callLojas = async () => {
    const data = await api.get("/lojas/lojas")
        .then((menuLojas) => montaLoja(menuLojas))
        .catch((err) => { })
    return data
}
