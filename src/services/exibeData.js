const moment = require("moment")
export const ExibeData= (date)=>{
    if(date!=null){
        let dataFinal = moment(date).format("DD/MM/YYYY")
        return dataFinal
    }
    return ''
    
}