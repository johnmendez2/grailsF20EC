import React from 'react'
import {BrowserRouter as Router, Link, Route, Routes, useNavigate} from 'react-router-dom'
import {Home} from './Components/Home'
import {Login} from './Components/Login'
import {Signup} from './Components/Signup'
import  NotFound  from './Components/NotFound'
import { AddProducts } from './Components/AddProducts'
import { Cart } from './Components/Cart'
import Productpage from './Components/Productpage'
import Frontpage from './Components/Frontpage'
import FAQ from './Components/FAQS'
import grails from './logo.png'

function App() {
  return (
        <div>
          <Routes>
        <Route exact path="/" element = {<Frontpage></Frontpage>}/>
        <Route exact path="/items" element = {<Home></Home>}/>
        <Route path="/signup" element={<Signup></Signup>}/>
        <Route path="/login" element={<Login></Login>}/>
        <Route path="/addproducts" element={<AddProducts></AddProducts>}/>
        <Route path="/cart" element={<Cart></Cart>}/>
        <Route path="/product" element={<Productpage></Productpage>}/>
        <Route path="/FAQ" element={<FAQ></FAQ>}/>
        <Route component={NotFound}/>
        </Routes>
        </div>

    
  );
}

export default App
