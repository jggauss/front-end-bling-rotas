import api from "../config/configApi"

export const servDeleteLoja = async (idLoja) => {

    var status = false
    const valueToken = localStorage.getItem("token")
    const headers = {
        'headers': {
            'Authorization': 'Bearer ' + valueToken
        }
    }
    await api.delete("/lojas/loja/" + idLoja,headers)
        .then((response) => {
            status = ({
                type: "success",
                mensagem: response.data.mensagem
            })

        }).catch((err) => {
            if (err.response) {
                status = ({
                    type: "error",
                    mensagem: err.response.data.mensagem
                })
            } else {
                status = ({
                    type: "error",
                    mensagem: "Erro. Tente mais tarde"
                })
            }
        })


    return status
}