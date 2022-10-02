export const SomaDias= ()=>{
    var d = new Date()
    var month = ''+(d.getMonth())
    var day = ''+ (d.getDate())
    var year = d.getFullYear()
    if(month.length<2){
        month=0+month
    }
    if(day.length<2){
        day=0+day
    }
    let dataFinal= [day,month,year].join('/')
    if(dataFinal==="31/12/1969"){dataFinal=""}
    
    return dataFinal
}