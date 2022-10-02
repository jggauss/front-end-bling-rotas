import api from "../config/configApi"


export const servEnviaPrecos = async (idLoja) => {

    await api.post('/enviaprecos/:' + idLoja)
        
}