import api from "../config/configApi"

export const PrecificarLojaConta = async (parametros) => {


    var valueToken = localStorage.getItem("token")
    const headers = {
        'headers': {
            'Authorization': 'Bearer ' + valueToken
        }
    }
    await espera(50)
    async function espera(ms) {
        return await new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    await api.post('/produtoslojas/precificalojaconta/' + parametros.codigoBling, (parametros), headers)
        .then((response) => { })
        .catch((err) => {
        })
return

}


