import { BabyIcon, ChevronLeftIcon,ChevronRightIcon, CloudLightning, Infinity, Check, Leaf, Sparkle, Hexagon, ShirtIcon,HeartHandshake, UmbrellaIcon, WatchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import bannerOne from '../../assets/new.jpg'
import bannerTwo from '../../assets/b-2.avif'
import bannerThree from '../../assets/new1.jpg'
import { CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '@/store/shop/products-slice';
import { fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from './product-tile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from '@/store/common-slice';


  const categoriesWithIcon = [
       
            { id: "men", label : "Men", icon: ShirtIcon},
            { id: "women", label : "Women", icon: CloudLightning},
            { id: "kids", label : "Kids", icon: BabyIcon},
            { id: "accessories", label : "Accessories", icon: WatchIcon},
            { id: "footwear", label : "Footwear", icon: UmbrellaIcon},
        
        ]

    const brandWithIcon = [
        {id: "nike", label: "Nike", icon: Check},
        {id: "adidas", label: "Adidas", icon: Leaf},
        {id: "puma", label: "Puma", icon: Sparkle},
        {id: "levi", label: "Levi", icon: Hexagon },
        {id: "zara", label: "Zara", icon: HeartHandshake},
        {id: "h&m", label: "H&M", icon: Infinity},
    ]


function ShoppingHome(){

    const [currentSlide, setCurrentSlide]= useState(0);
    const {productList, productDetails} = useSelector(state=>state.shopProducts)
    const { featureImageList } = useSelector(state => state.commonFeature) 
    const [openDetailsDialog, setOpenDetailsDialog]= useState(false)
    const {user} = useSelector(state=>state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();


    function handleNavigateToListingPage(getCurrentItem, section){
        sessionStorage.removeItem('filters');
        const currentFilter ={
            [section] : [getCurrentItem.id]
        }

        sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        navigate(`/shop/listing`)
    }

     function handleGetProductDetail(getCurrentProductId){
            dispatch(fetchProductDetails(getCurrentProductId))
        }

    function handleAddToCart(getCurrentProductId){
        console.log(getCurrentProductId)
        dispatch(addToCart({userId: user?.id,productId: getCurrentProductId, quantity: 1}))
        .then(data => {
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id))
                toast({
                    title : 'Product is added to cart',
                })
            }
        })
    }

    useEffect(()=>{
        if(productDetails!==null) setOpenDetailsDialog(true)
    },[productDetails])

    useEffect(()=>{

        const timer = setInterval(()=>{
            setCurrentSlide(prevSlide=> (prevSlide+1) % featureImageList.length)
        },3000)

        return ()=> clearInterval(timer)
    },[featureImageList])

    useEffect(()=>{
        dispatch(fetchAllFilteredProducts({filterParams : {}, sortParams: 'price-lowtohigh'}))
    },[dispatch])

    console.log(productList, 'productList')

    useEffect(()=>{
        dispatch(getFeatureImages())
    },[dispatch])
  
    return(
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                {
                    featureImageList && featureImageList.length > 0 ?featureImageList.map((slide,index)=> (<img
                    src={slide?.image}
                    key={index}
                    className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-100`}
                    />)) : null
                }
                <Button variant="outline" size="icon" 
                onClick= {()=> setCurrentSlide(prevSlide=> (prevSlide-1 + featureImageList.length) % featureImageList.length)}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/88">
                    <ChevronLeftIcon className='w-4  h-4'/>
                </Button>
                 <Button variant="outline" size="icon" 
                 onClick= {()=> setCurrentSlide(prevSlide=> (prevSlide+1 + featureImageList.length) % featureImageList.length)}
                 className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/88">
                    <ChevronRightIcon className='w-4  h-4'/>
                </Button>
            </div>
            <section className='py-12 bg-grey-50'>
                <p className='text-center font-extrabold text-[70px] mb-4'>Grab it! Love it! Own it!</p>
                <div className='container mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-8'>Shop By category</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {
                            categoriesWithIcon.map(categoryItem=> 
                            <Card onClick={()=>handleNavigateToListingPage(categoryItem, 'category')} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <categoryItem.icon className='w-12 h-12 mb-4 text-primary'/>
                                    <span className='font-bold'>{categoryItem.label}</span>

                                </CardContent>

                            </Card>)
                        }
                    </div>
                </div>
            </section>

            <section className='py-12 bg-grey-50'>
                <div className='container mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-8'>Shop By Brand</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                        {
                            brandWithIcon.map(brandItem=> 
                            <Card onClick={()=>handleNavigateToListingPage(brandItem, 'brand')} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <brandItem.icon className='w-12 h-12 mb-4 text-primary'/>
                                    <span className='font-bold'>{brandItem.label}</span>

                                </CardContent>

                            </Card>)
                        }
                    </div>
                </div>
            </section>

            <section className='py-12'>
                   <div className='container mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-8'>Feature products</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {
                            productList && productList.length > 0 ?
                            productList.map(productItem => <ShoppingProductTile 
                                handleGetProductDetail={handleGetProductDetail}
                                handleAddToCart={handleAddToCart}
                                product={productItem}/>)
                            :null
                        }
                    </div>
                    </div>     
            </section>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    );
}
export default ShoppingHome;