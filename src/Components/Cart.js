import React,{useState, useEffect} from 'react'
import {Navbar} from './Navbar'
import { auth,fs } from '../Config/config';
import { CartProducts } from './CartProducts';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import './styles.css';
import { Modal } from './Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Cart = () => {

    // show modal state
    const [showModal, setShowModal]=useState(false);

    // trigger modal
    const triggerModal=()=>{
        setShowModal(true);
    }

    // hide modal
    const hideModal=()=>{
        setShowModal(false);
    }

    // getting current user function
    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(snapshot=>{
                        setUser(snapshot.data().Name);
                    })
                }
                else{
                    setUser(null);
                }
            })
        },[])
        return user;
    }

    const user = GetCurrentUser();
    // console.log(user);
    
    // state of cart products
    const [cartProducts, setCartProducts]=useState([]);

    // getting cart products from firestore collection and updating the state
    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                    const newCartProduct = snapshot.docs.map((doc)=>({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCartProduct);                    
                })
            }
            else{
                console.log('user is not signed in to retrieve cart');
            }
        })
    },[])

    console.log(user);
    // getting the qty from cartProducts in a seperate array
    const qty = cartProducts.map(cartProduct=>{
        return cartProduct.qty;
    })

    //copy collection method
    async function copyCollection(srcCollectionName, destCollectionName) {
        const documents = await fs.collection(srcCollectionName).get();
        let writeBatch = fs.batch();
        const destCollection = fs.collection(destCollectionName);
        let i = 0;
        for (const doc of documents.docs) {
            writeBatch.set(destCollection.doc(doc.id), doc.data());
            i++;
            if (i > 400) {  // write batch only allows maximum 500 writes per batch
                i = 0;
                console.log('Intermediate committing of batch operation');
                await writeBatch.commit();
                writeBatch = fs.batch();
            }
        }
        if (i > 0) {
            console.log('Firebase batch operation completed. Doing final committing of batch operation.');
            await writeBatch.commit();
        } else {
            console.log('Firebase batch operation completed.');
        }
    }
    // reducing the qty in a single value
    const reducerOfQty = (accumulator, currentValue)=>accumulator+currentValue;

    const totalQty = qty.reduce(reducerOfQty,0);

    // charging payments
    const history = useNavigate();
    const handleToken = async(token)=>{
        //  console.log(token);
        const cart = {name: 'All Products', totalPricewShip}
        const response = await axios.post('http://localhost:8080/checkout',{
            token,
            cart
        })
        console.log(response);
        let {status}=response.data;
        console.log(status);
        if(status==='success'){
            history('/');
            toast.success('Your order has been placed successfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
              
              const uid = auth.currentUser.uid;
              copyCollection('Cart ' + uid, 'PaidCard ' + uid)
              const carts = await fs.collection('Cart ' + uid).get();
              for(var snap of carts.docs){
                  fs.collection('Cart ' + uid).doc(snap.id).delete();
                  
              }
        }
        else{
            alert('Something went wrong in checkout');
        }
     }


    // getting the TotalProductPrice from cartProducts in a seperate array
    const price = cartProducts.map((cartProduct)=>{
        return cartProduct.TotalProductPrice;
    })

    // reducing the price in a single value
    const reducerOfPrice = (accumulator,currentValue)=>accumulator+currentValue;

    const totalPrice = price.reduce(reducerOfPrice,0);
    const totalPricewShip = totalPrice + 20;


    const [totalProducts, setTotalProducts]=useState(0);
     // getting cart products   
     useEffect(()=>{        
         auth.onAuthStateChanged(user=>{
             if(user){
                 fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                     const qty = snapshot.docs.length;
                     setTotalProducts(qty);
                 })
             }
         })       
     },[])  
    return (
        <>
            <Navbar user={user} totalProducts={totalProducts} />           
            <br></br>
            {cartProducts.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Cart</h1>
                    <div className='products-box'>
                        <CartProducts cartProducts={cartProducts}/>
                    </div>
                    <div className='summary-box'>
                        <h5>Cart Summary</h5>
                        <br></br>
                        <div>
                        Total No of Products: <span>{totalQty}</span>
                        </div>
                        <div>
                        Total: <span>$ {totalPrice}</span>
                        </div>
                        <br></br>
                        <StripeCheckout
                            stripeKey='pk_test_51Ml3bpJaWNNkxleDIFl4Cm7Idqllth0S18Aq3747o4qNcTN5jKdoWCdnhSlT0mzvGfpwTUNqCoNtwcsryg4clinW00EMnnRCXG'
                            token={handleToken}
                            billingAddress
                            shippingAddress
                            name='All Products'
                            amount={totalPrice * 100}
                        ></StripeCheckout>
                        <br></br>
                        <button type="submit" className='btn btn-success btn-md' onClick={()=>triggerModal()}>Pay cash on delivery</button>
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div id='label1'>Your cart could use some items!</div>
            ) }
            {showModal===true&&(
                <Modal TotalPrice={totalPrice}
                    hideModal={hideModal}
                />
            )}              
        </>
    )
}