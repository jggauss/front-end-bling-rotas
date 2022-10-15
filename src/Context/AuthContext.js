import React,{createContext, useEffect, useState} from "react";
import api from "../config/configApi.js";
const Context = createContext()

function AuthProvider({children}){

    const [ authenticated, setAuthenticated] = useState(false)
    const [ loadind, setLoading]= useState(true)
    useEffect(()=>{
        const getLogin= async() =>{
            const token = localStorage.getItem("token")
            if(token && valUser()){
                api.defaults.headers.Authorization = `Bearer ${(token)}`
                setAuthenticated(true)
            }
            setLoading(false)
        }
        getLogin()
    },[])


    const valUser = async()=>{
        const valueToken = localStorage.getItem("token")
        const headers = {
            'headers':{
            'Authorization':'Bearer '+ valueToken
            }
        }
        
        await api.get("/val-token", headers)
        .then((response)=>{
            return true
        })
        .catch(()=>{
            setAuthenticated(false)
            //localStorage.removeItem("token");
            //api.defaults.headers.Authorization = undefined;
            return false
        })
    }


    async function signIn(sit){
        return setAuthenticated(true)

    }

    async function handleLogout(sit){
        setAuthenticated(false)
        localStorage.removeItem("token")
        api.defaults.Authorization = undefined
    }

    if(loadind){
        return <h1>Carregando</h1>
    }

    return(
        <Context.Provider value={{authenticated,signIn, handleLogout}}>
            {children}
        </Context.Provider>
    )
}

export {Context, AuthProvider}
