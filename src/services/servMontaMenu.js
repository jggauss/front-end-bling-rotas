
export const montaTexto =(menuMarcas)=> {
    let linha = [{
        value:"",
        label:""
    }]
    let menuMontato = [""]
    let contador = menuMarcas.data.marcas.count
    
     for (let i = 0; i < contador; i++) {
         let valor = (menuMarcas.data.marcas.rows[i].marca)
         linha[i]={
            value:valor,
            label:valor
         }
         
        menuMontato.push(linha[i])
     }
     menuMontato.shift()
     
     let linhaZerada = {value:'Selecione Marca', label:'Selecione Marca'}
     menuMontato.splice(0,0,linhaZerada)
     return menuMontato
}
