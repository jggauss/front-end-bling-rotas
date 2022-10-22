import api from "../config/configApi"


export const servEnviaPrecos = async (idLoja) => {
    const valueToken = localStorage.getItem("token")
    const headers = {
        'headers': {
            'Authorization': 'Bearer ' + valueToken
        }
    }
    await api.post('/enviaprecos/:' + idLoja,headers)
        
}