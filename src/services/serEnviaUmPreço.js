import api from "../config/configApi"

export const enviaUmPreco = async (produtoid) => {
    console.log("cheguei no envia um preço")
     await api.put('/produtoslojas/enviaumproduto/'+produtoid)
     .then((merda)=>{console.log(merda)})
     .catch(()=>{})
    return
}