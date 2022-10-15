import React  from "react";
import {Routes, Route, Navigate } from 'react-router-dom';
import { MostraProdutos } from "../pages/Produtos";
import { BuscaLoja } from "../pages/BuscaLoja";
import { BuscaLojas } from "../pages/BuscaLojas/Index";
import { BuscaProdutosCustoZero } from "../pages/BuscaProdutosCustoZero";

import { BuscaUmProduto } from "../pages/BuscaUmProduto";
import { CriarLoja } from "../pages/CriarLoja.js";
import { EditaLoja } from "../pages/EditaLoja.js/index.js";
import { Home } from "../pages/Home";
import { VerProduto } from "../pages/VerProduto";

import { ProdutosLoja } from "../pages/ProdutosLoja";
import { ProdutoLoja } from "../pages/ProdutoLoja";

import { AplicarPromocao } from "../pages/AplicarPromocao.js";
import { PegaTodosPedidos } from "../pages/Pedidos";
import { PegaUmPedido } from "../pages/Pedido";
import { Login } from "../pages/Login/Login/index"
import { LoginCadatrar } from "../pages/Login/LoginCadastrar";
import { LoginAlterar } from "../pages/Login/LoginAlterar";
import { Dashboard } from "../pages/Login/Dashboard";


function CustomRoute({ children, redirectTo}){
    const Authenticated = localStorage.getItem("token")
    
    return Authenticated ? children : <Navigate to={redirectTo}/>
 
}




export default function RoutesAdm() {
    return (
        <div>
            <Routes>
                <Route path='/home' element={<Home/>}/>
                <Route path='/pegaumproduto/:id' element={<CustomRoute redirectTo="/"><BuscaUmProduto/> /</CustomRoute>} /> 
                <Route path='/criarloja' element={<CustomRoute redirectTo="/"><CriarLoja/> /</CustomRoute>} />
                <Route path='/buscalojas/'element={<CustomRoute redirectTo="/"><BuscaLojas/> /</CustomRoute>} />
                <Route path='/buscaloja/:loja' element={<CustomRoute redirectTo="/"><BuscaLoja/> /</CustomRoute>} />
                <Route path='/editarloja/:loja' element={<CustomRoute redirectTo="/"><EditaLoja/> /</CustomRoute>} />
                <Route path='/produtos/zerados' element={<CustomRoute redirectTo="/"><BuscaProdutosCustoZero/> /</CustomRoute>} />
                <Route path='/produtos/' element={<CustomRoute redirectTo="/"><MostraProdutos/> /</CustomRoute>} />  
                <Route path='/produto/:id' element={<CustomRoute redirectTo="/"><VerProduto/> /</CustomRoute>} />
                <Route path='/produtosloja/:loja' element={<CustomRoute redirectTo="/"><ProdutosLoja/> /</CustomRoute>} />
                <Route path='/produtoloja/:loja/:id' element={<CustomRoute redirectTo="/"><ProdutoLoja/> /</CustomRoute>} />
                
                <Route path='/produtos/promocao/:loja' element={<CustomRoute redirectTo="/"><AplicarPromocao/> /</CustomRoute>} />
                <Route path='/pedidos'  element={<CustomRoute redirectTo="/"><PegaTodosPedidos/> /</CustomRoute>} /> 
                <Route path='/pedidos/:id/:loja' element={<CustomRoute redirectTo="/"><PegaUmPedido/> /</CustomRoute>} />

                <Route path="/" element={<Login/>}/>
                <Route path="/login/cadastrar" element={<LoginCadatrar/>}/>
                <Route path="/login" element={<CustomRoute redirectTo="/"><LoginAlterar/> /</CustomRoute>} />
                <Route path="/dashboard" element={<CustomRoute redirectTo="/"><Dashboard/> /</CustomRoute>} />
            </Routes>
        </div>
    )
}