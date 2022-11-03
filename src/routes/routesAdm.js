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
import { LoginSenha } from "../pages/Login/Senha";
import { RecoverPassword } from "../pages/Login/RecoverPassword";
import { PasswordUpdate } from "../pages/Login/PasswordUpdate";
import { AplicarDesconto } from "../pages/AplicarDesconto.js";
import { DeletaLoja } from "../pages/DeletaLoja";
import { ConfirmaBuscarProdutos } from "../pages/ConfirmaBuscarProdutos";
import { ConfirmarPrecificarLoja } from "../pages/ConfirmaPrecificarLoja";
import { ConfirmarPrecificarTodasLojas } from "../pages/ConfirmaPrecificarTodasLojas";

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
                <Route path='/deletaloja/:loja' element={<CustomRoute redirectTo="/"><DeletaLoja/> /</CustomRoute>} />
                <Route path='/editarloja/:loja' element={<CustomRoute redirectTo="/"><EditaLoja/> /</CustomRoute>} />
                <Route path='/produtos/zerados' element={<CustomRoute redirectTo="/"><BuscaProdutosCustoZero/> /</CustomRoute>} />
                <Route path='/produtos/' element={<CustomRoute redirectTo="/"><MostraProdutos/> /</CustomRoute>} />  
                <Route path='/produto/:id' element={<CustomRoute redirectTo="/"><VerProduto/> /</CustomRoute>} />
                <Route path='/confirmabuscarprodutos' element={<CustomRoute redirectTo="/"><ConfirmaBuscarProdutos/> /</CustomRoute>} />
                <Route path='/produtosloja/:loja/:name' element={<CustomRoute redirectTo="/"><ProdutosLoja/> /</CustomRoute>} />
                <Route path='/produtoloja/:loja/:id/:name' element={<CustomRoute redirectTo="/"><ProdutoLoja/> /</CustomRoute>} />
                
                <Route path='/produtos/promocao/:loja/:market' element={<CustomRoute redirectTo="/"><AplicarPromocao/> /</CustomRoute>} />
                <Route path='/produtos/descontos/:loja/:market' element={<CustomRoute redirectTo="/"><AplicarDesconto/> /</CustomRoute>} />
                <Route path='/pedidos'  element={<CustomRoute redirectTo="/"><PegaTodosPedidos/> /</CustomRoute>} /> 
                <Route path='/pedidos/:id/:loja' element={<CustomRoute redirectTo="/"><PegaUmPedido/> /</CustomRoute>} />
                <Route path='/precificar/:id/:name' element={<CustomRoute redirectTo="/"><ConfirmarPrecificarLoja/> /</CustomRoute>} />
                <Route path='/precificar/todas' element={<CustomRoute redirectTo="/"><ConfirmarPrecificarTodasLojas/> /</CustomRoute>} />

                <Route path="/" element={<Login/>}/>
                <Route path="/login/cadastrar" element={<LoginCadatrar/>}/>
                <Route path="/recover-password" element={<RecoverPassword/>}/>
                <Route path="/update-password/:key" element={<PasswordUpdate/>}/>
                <Route path="/login/alterar" element={<CustomRoute redirectTo="/"><LoginAlterar/> /</CustomRoute>} />
                <Route path="/login/senha" element={<CustomRoute redirectTo="/"><LoginSenha/> /</CustomRoute>} />
                <Route path="/dashboard" element={<CustomRoute redirectTo="/"><Dashboard/> /</CustomRoute>} />
            </Routes>
        </div>
    )
}