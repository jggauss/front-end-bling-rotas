
export function PercentualPedido(pedidos){
    
    return ((((pedidos.totalProdutos)-(pedidos.totalCustoProdutos)-(pedidos.outrasDespesas))*100)/Number(pedidos.totalProdutos)).toFixed(1).replace(".",",")
}
module.exports = PercentualPedido

