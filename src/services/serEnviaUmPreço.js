import api from "../config/configApi"

export const enviaUmPreco = async (produtoid) => {
    const valueToken = localStorage.getItem("token")
    const headers = {
        'headers': {
            'Authorization': 'Bearer ' + valueToken
        }
    }
     await api.put('/produtoslojas/enviaumproduto/'+produtoid,headers)
     .then((response)=>{console.log(response)})
     .catch(()=>{})
    return
}