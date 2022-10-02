export const montaCategoria =(menuCategorias)=> {
    let linha = [{
        value:"",
        label:""
    }]
    let menuMontato = [""]
    let contador = menuCategorias.data.categorias.count
    
     for (let i = 0; i < contador; i++) {
         let valor = (menuCategorias.data.categorias.rows[i].nameCategoria)
         linha[i]={
            value:valor,
            label:valor
         }

         menuMontato.push(linha[i])
     }
     menuMontato.shift()
     let linhaZerada = {value:'Selecione Categoria', label:'Selecione Categoria'}
     menuMontato.splice(0,0,linhaZerada)
     return menuMontato
}
