import api from "../config/configApi"

export const servPrecificaLoja = async (idLoja) => {
    await api.post('/produtoslojas/precos/'+idLoja)
    .then(()=>{})
    .catch(()=>{})
    return
}