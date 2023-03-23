import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function FAQ({ products, addToCart }) {
    const history = useNavigate();
    return (


        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
  <iframe style={{loading:"lazy" ,position: "absolute", width: "100%", height: "100%", top: "0", left: "0", border: "none" ,padding: "0",margin: "0"}}
     src="https://www.canva.com/design/DAFd7NxKtPQ/view?embed" allowFullScreen="allowfullscreen" allow="fullscreen">
  </iframe>
  <button style={{ position: 'absolute', left: '10%', top: '3%', transform: 'translate(-50%, -50%)', backgroundColor: '#2B192E', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '20px', margin: '4px 2px', cursor: 'pointer' }} onClick={() => {history('/items');}}>Back to site</button>
  </div>
</div>
    )

}

