

export const MargemPedido = function (pedidos){
    
    return (((pedidos.totalProdutos)-(pedidos.totalCustoProdutos)-(pedidos.outrasDespesas)).toFixed(2)).replace('.',',')
}
module.exports = MargemPedido

