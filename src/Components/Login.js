import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import './styles.css';
import { auth } from '../Config/config';
import {useNavigate} from 'react-router-dom';

export const Login = () => {

    const history = useNavigate();

    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const xorCipher = (str, key) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
          result += String.fromCharCode(key ^ str.charCodeAt(i));
        }
        return result;
      };

    const handleLogin=(e)=>{
        e.preventDefault();
        // console.log(email, password);
        const encryptedPassword = xorCipher(password, 42); // Encrypt the password using the XOR cipher
        console.log(encryptedPassword)
        auth.signInWithEmailAndPassword(email,encryptedPassword).then(()=>{
            setSuccessMsg('Login Successfull. You will now automatically get redirected to Home page');
            setEmail('');
            setPassword('');
            setErrorMsg('');
            setTimeout(()=>{
                setSuccessMsg('');
                history('/items');
            },3000)
        }).catch(error=>setErrorMsg(error.message));
    }

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1 id='txt'>Login</h1>
            <hr></hr>
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            <form className='form-group' autoComplete="off"
            onSubmit={handleLogin}>               
                <label id='label1'>Email</label>
                <input type="email" className='form-control' required
                onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br></br>
                <label id='label1'>Password</label>
                <input type="password" className='form-control' required
                onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br></br>
                <div className='btn-box'>
                    <span id='label2'>Don't have an account Sign Up
                    <Link id='label1' to="/signup" className='link'> Here</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>LOGIN</button>
                </div>
            </form>
            {errorMsg&&<>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>                
            </>}
        </div>
    )
}
