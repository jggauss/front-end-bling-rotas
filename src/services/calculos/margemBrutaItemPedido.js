
export function MargemBrutaItemPedido(dados){
    
    return //(dados.totalVenda - dados.totalCustoProdutos - dados.outrasDespesas-((comissaoLoja/100)*dados.totalVenda)).toFixed(2).replace('.', ",")
}
module.exports = MargemBrutaItemPedido

