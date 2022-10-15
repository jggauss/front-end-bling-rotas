import api from "../config/configApi"

export const servPrecificaLoja = async (idLoja) => {
    console.log("cheguei aqui. vou charmar api para precicifiar")
    await api.post('/produtoslojas/precos/'+idLoja)
    .then(()=>{})
    .catch(()=>{})
    return
}