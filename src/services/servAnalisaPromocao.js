import { FormataData } from "./formataData";

export const AnalisaPromocao = (dados) => {

    console.log(dados)
    var status = {
        type:'',
        mensagem:''
    }
    const dataHoje = new Date()

    if (dados.inicioOferta !== "<empty string>") {
        if (dados.inicioOferta < FormataData(dataHoje)) {
            status = ({
                type: "error",
                mensagem: "Erro. Data início da promoção menor que data de hoje ou data em branco",
            });

            return status
        }
        if (dados.fimOferta <= dados.inicioOferta && dados.fimOferta !== "") {
            status = ({
                type: "error",
                mensagem: "Erro. dados fim da promoção menor ou igual que início da promoção",
            });

            return status
        }
    } else {
        status = ({
            type: "error",
            mensagem: "Erro. Promoção não tem data de início",
        });

        return status
    }
    status = ({
        type: "error",
        mensagem: "Erro. Promoção não tem data de início",
    });
}