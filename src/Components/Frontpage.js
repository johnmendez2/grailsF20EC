import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Frontpage({ products, addToCart }) {
    const history = useNavigate();
    return (


        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
  <iframe style={{ loading:"lazy", position: "absolute", width: "100%", height: "100%", top: "0", left: "0", border: "none" ,padding: "0",margin: "0"}}
     src="https://www.canva.com/design/DAFd0gDjCMQ/view?embed" allowFullScreen="allowfullscreen" allow="fullscreen">
  </iframe>
  <button style={{ position: 'absolute', left: '50%', top: '65%', transform: 'translate(-50%, -50%)', backgroundColor: '#1e0f2c', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '30px', margin: '4px 2px', cursor: 'pointer' }} onClick={() => {history('/items');}}>Shop Vintage Clothing</button>
  </div>
</div>
    )

}