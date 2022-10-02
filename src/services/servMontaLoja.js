export const montaLoja = (menuLojas) => {
    let linha = [{
        value: "",
        label: ""
    }]
    let menuMontato = [""]
    let contador = menuLojas.data.length
    for (let i = 0; i < contador; i++) {
        let valor = (menuLojas.data[i].codigoBling)+" - "+(menuLojas.data[i].name)
        linha[i] = {
            value: valor,
            label: valor
        }
        menuMontato.push(linha[i])
    }
    menuMontato.shift()

    let linhaZerada = { value: 'Selecione Loja', label: 'Selecione Loja' }
    menuMontato.splice(0, 0, linhaZerada)

    return menuMontato
}
