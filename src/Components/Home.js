import React,{useState, useEffect} from 'react'
import {Navbar} from './Navbar'
import  Products  from './Products'
import { auth,fs } from '../Config/config';
import { useNavigate } from 'react-router-dom';
import { IndividualFilteredProduct } from './IndividualFilteredProducts';
import '../index.css';
export const Home = (props) => {
    const history = useNavigate();
    function GetUserUid(){
        const [uid, setUid]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    setUid(user.uid);
                }
            })
        },[])
        return uid;
    }

    const uid = GetUserUid();

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

    console.log(user);

    const [products, setProducts] = useState([]);

    const getProducts = async ()=>{
        const products = await fs.collection('ProductsF20EC').get();
        const productsArray = [];
        for (var snap of products.docs){
            var data = snap.data();
            data.ID = snap.id;
            productsArray.push({
                ...data
            })
            if(productsArray.length === products.docs.length){
                setProducts(productsArray);
            }
        }
    }

    useEffect(()=>{
        getProducts();
    },[])

    let Product;
    const addToCart = (product)=>{
        console.log(product)
        if(uid!==null){
            // console.log(product);
            Product=product;
            Product['qty']=1;
            Product['TotalProductPrice']=Product.qty*Product.price;
            fs.collection('Cart ' + uid).doc(product.ID).set(Product).then(()=>{
                console.log('successfully added to cart');
            })

        }
        else{
            history('/login');
        }
        
    }
    // state of totalProducts
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

    // categories list rendering using span tag
    const [spans]=useState([
        {id:'All', text: 'All'},
        {id: 'Vintage', text: 'Vintage'},
        {id: 'Sportswear', text: 'Sportswear'},
        {id: 'Designer', text: 'Designer'},
        {id: 'Dresses', text: 'Dresses'},           
    ])

    // active class state
    const [active, setActive]=useState('');

    // category state
    const [category, setCategory]=useState('');

    // handle change ... it will set category and active states
    const handleChange=(individualSpan)=>{
        setActive(individualSpan.id);
        setCategory(individualSpan.text);
        filterFunction(individualSpan.text);
    }

    // filtered products state
    const [filteredProducts, setFilteredProducts]=useState([]);

    // filter function
    const filterFunction = (text)=>{
        if(products.length>1){
            const filter=products.filter((product)=>product.league===text);
            setFilteredProducts(filter);
        }
        else{
            console.log('no products to filter')
        } 
    }

    // return to all products
    const returntoAllProducts=()=>{
        setActive('');
        setCategory('');
        setFilteredProducts([]);
    }




    return (
        <>
            <Navbar user={user} totalProducts={totalProducts}/>           
            <br></br>
            <div>
  {/* <iframe loading="lazy" style={{position: "absolute", width: "100%", height: "100%", top: "0", left: "0", border: "none" ,padding: "0",margin: "0"}}
    src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFdNP1BwZ8&#x2F;view?embed" allowFullScreen="allowfullscreen" allow="fullscreen">
  </iframe> */}
</div>
{/* <a href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFdNP1BwZ8&#x2F;view?utm_content=DAFdNP1BwZ8&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">White, Green, and Blue Photographic Fashion Retail Website</a> */}
            <div className='container-fluid filter-products-main-box'>
                <div className='filter-box' >
                    {/* <h6>Filter by category</h6>
                    {spans.map((individualSpan,index)=>(
                        <span key={index} id={individualSpan.id}
                        onClick={()=>handleChange(individualSpan)}
                        className={individualSpan.id===active ? active:'deactive'}>{individualSpan.id}</span>
                    ))} */}

                    <div class="dropdown">
                    <button class="dropbtn">Filter by Category</button>
                    <div class="dropdown-content">
                        {spans.map((individualSpan,index)=>(
                            <a key={index} id={individualSpan.id}
                            onClick={()=>handleChange(individualSpan)}
                            className={individualSpan.id===active ? active:'deactive'}>{individualSpan.id}</a>
                        ))}
                    </div>
                    </div>
                </div>
                {filteredProducts.length > 0&&(
                  <div className='my-products'>
                      <a className="return" href="javascript:void(0)" onClick={returntoAllProducts} >Return to All Products</a>
                      <div className='products-box'>
                          {filteredProducts.map(individualFilteredProduct=>(
                              <IndividualFilteredProduct key={individualFilteredProduct.ID}
                              individualFilteredProduct={individualFilteredProduct}
                              addToCart={addToCart}/>
                          ))}
                      </div>
                  </div>  
                )}
                {filteredProducts.length < 1&&(
                    <>
                        {products.length > 0&&(
                            <div className='my-products'>
                                <div className='products-box'>
                                    <Products products={products} addToCart={addToCart}/>
                                </div>
                            </div>
                        )}
                        {products.length < 1&&(
                            <div className='my-products please-wait'>Please wait...</div>
                        )}
                    </>
                )}
            </div>       
        </>
    )
}
