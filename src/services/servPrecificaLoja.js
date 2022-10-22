import api from "../config/configApi"

export const servPrecificaLoja = async (idLoja) => {
    const valueToken = localStorage.getItem("token")
    const headers = {
        'headers': {
            'Authorization': 'Bearer ' + valueToken
        }
    }
    await api.post('/produtoslojas/precificaloja/'+idLoja,headers)
    .then(()=>{})
    .catch(()=>{})
    return
}