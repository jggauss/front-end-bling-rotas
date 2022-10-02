import React  from "react";
import {Routes, Route } from 'react-router-dom';
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
import { PesquisaNome } from "../pages/PesquisaNome";
import { AplicarPromocao } from "../pages/AplicarPromocao.js";
import { PegaTodosPedidos } from "../pages/Pedidos";
import { PegaUmPedido } from "../pages/Pedido";
export default function RoutesAdm() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/pegaumproduto/:id' element={<BuscaUmProduto/>}/>
                <Route path='/criarloja' element={<CriarLoja/>}/>
                <Route path='/buscalojas/' element={<BuscaLojas/>}/>
                <Route path='/buscaloja/:loja' element={<BuscaLoja/>}/>
                <Route path='/editarloja/:loja' element={<EditaLoja/>}/>
                <Route path='/produtos/zerados' element={<BuscaProdutosCustoZero/>}/>
                <Route path='/produtos/' element={<MostraProdutos/>}/>
                <Route path='/produto/:id' element={<VerProduto/>}/>
                
                <Route path='/produtosloja/:loja' element={<ProdutosLoja/>}/>
                <Route path='/produtoloja/:loja/:id' element={<ProdutoLoja/>}/>
                <Route path='/produtosloja/pesquisa/:loja' element={<PesquisaNome/>}/>
                <Route path='/produtos/promocao/:loja' element={<AplicarPromocao/>}/>
                <Route path='/pedidos' element={<PegaTodosPedidos/>}/>
                <Route path='/pedidos/:id/:loja' element={<PegaUmPedido/>}/>
            </Routes>
        </div>
    )
}