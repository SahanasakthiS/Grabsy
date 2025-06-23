import ProductFilter from "@/components/shopping-view/filter";
import { DropdownMenu,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";
import { sortOptions } from "@/config";
import { useDebugValue, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function createSearchParamsHelper(filterParams){
    const queryParams = [];

    for(const [key,value] of Object.entries(filterParams)){
        if(Array.isArray(value) && value.length >0){
        const paramValue = value.join(',')

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)

        }
    }

    return queryParams.join('&')
}

function ShoppingListing(){

    const dispatch = useDispatch()
    const {productList, productDetails} = useSelector(state=> state.shopProducts)
    const {cartItems} = useSelector(state=> state.shopCart)
    const {user} = useSelector(state=>state.auth)
    const [filters, setFilters] =useState({});
    const [sort,setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams()
    const [openDetailsDialog, setOpenDetailsDialog]= useState(false)
    const {toast} = useToast();

    const categorySearchParam = searchParams.get('category')

    function handleSort(value){
        console.log(value);
        setSort(value);
    }

    function handleFilter(getSectionId, getCurrentOptions){

        let cpyFilters = {...filters};
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if(indexOfCurrentSection === -1){
            cpyFilters={
                ...cpyFilters,
                [getSectionId]: [getCurrentOptions]
            }
        }else{
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOptions)

            if(indexOfCurrentOption===-1) cpyFilters[getSectionId].push(getCurrentOptions)
            
            else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1)
        }
        
     
        setFilters(cpyFilters)
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    }

    function handleGetProductDetail(getCurrentProductId){
        console.log(getCurrentProductId);
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    function handleAddToCart(getCurrentProductId, getTotalStock){
        console.log(cartItems);

        let getCartItems = cartItems.items || [];

        if(getCartItems.length){
            const indexOfCurrentItem = getCartItems.findIndex(item=>item.productId === getCurrentProductId);
            if(indexOfCurrentItem> -1){
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if(getQuantity + 1 > getTotalStock){
                    toast({
                        title: `Only ${getQuantity} can be added for this item`,
                        variant: 'destructive'
                    })

                    return;
                }

            }
        }

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
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem("filters")) || {})
    },[categorySearchParam])

    useEffect(()=>{
        if(filters && Object.keys(filters).length > 0){
            const createQueryString = createSearchParamsHelper(filters)
            setSearchParams(new URLSearchParams(createQueryString))
        }
    },[filters])

    //fetchlist of products
    useEffect(()=>{
        if(filters !== null && sort !== null)
        dispatch(fetchAllFilteredProducts({filterParams: filters,sortParams: sort}))
    },[dispatch, sort, filters])

    useEffect(()=>{
        if(productDetails!==null) setOpenDetailsDialog(true)
    },[productDetails])

 


    return <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <ProductFilter filters={filters} handleFilter={handleFilter}/>
        <div className="bg-backgroud w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-lg font-extrabold">All Products</h2>
                <div className="flex items-center justify-end w-full">
                    <span className="text-muted-foreground mr-10">{productList?.length} Products</span>
                    <div className="relative z-20">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <ArrowUpDownIcon className="h-6 w-6"/>
                            <span>Sort by</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] z-50 bg-white shadow-md rounded-md border">
                        <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                            {
                                sortOptions.map(sortItem=> <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}
                                className="cursor-pointer px-3 py-2 hover:bg-gray-100 data-[state=checked]:bg-gray-200 data-[state=checked]:font-semibold rounded-md transition-all">{sortItem.label}</DropdownMenuRadioItem>)
                            }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
                </div>
                
            </div>
        
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:drid-cols-4 gap-4 p-4">
                {
                    productList && productList.length > 0 ?
                    productList.map(productItem=>
                    <ShoppingProductTile handleGetProductDetail={handleGetProductDetail} product={productItem}  handleAddToCart={handleAddToCart}/>) : null
                    }
            </div>

        </div>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
}
export default ShoppingListing;