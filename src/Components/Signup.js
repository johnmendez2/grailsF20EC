import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import './styles.css';
import { auth,fs } from '../Config/config';
import {useNavigate} from 'react-router-dom';
export const Signup = () => {

    const history = useNavigate();

    const [fullName, setFullname]=useState('');
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

    const handleSignup=(e)=>{
        e.preventDefault();
        const encryptedPassword = xorCipher(password, 42); // Encrypt the password using the XOR cipher
        // console.log(fullName, email, password);
        auth.createUserWithEmailAndPassword(email,encryptedPassword).then((credentials)=>{
            console.log(credentials);
            fs.collection('users').doc(credentials.user.uid).set({
                SignupDate: new Date().toLocaleDateString(),
                FullName: fullName,
                Email: email,
                Password: encryptedPassword
            }).then(()=>{
                setSuccessMsg('Signup Successfull. You will now automatically get redirected to Login');
                setFullname('');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(()=>{
                    setSuccessMsg('');
                    history('/login');
                },3000)
            }).catch(error=>setErrorMsg(error.message));
        }).catch((error)=>{
            setErrorMsg(error.message)
        })
    }

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1 id='txt'>Sign Up</h1>
            <hr></hr>
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            <form className='form-group' autoComplete="off" onSubmit={handleSignup}>
                <label id='label1'>Full Name</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setFullname(e.target.value)} value={fullName}></input>
                <br></br>
                <label id='label1'>Email</label>
                <input type="email" className='form-control' required
                 onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br></br>
                <label id='label1'>Password</label>
                <input type="password" className='form-control' required
                 onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br></br>
                <div className='btn-box'>
                    <span id='label2'>Already have an account Login
                    <Link id='label1' to="/login" className='link' style={{color: "white"}}> Here</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>SIGN UP</button>
                </div>
            </form>
            {errorMsg&&<>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>                
            </>}
        </div>
    )
}
