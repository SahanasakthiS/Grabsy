import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { deleteCartItem, UpdateCartItemQty } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({cartItem}){
    console.log(cartItem);
    const {user}= useSelector(state=>state.auth)
    const {cartItems} = useSelector(state=> state.shopCart)
    const {productList} = useSelector(state=> state.shopProducts)

    const dispatch = useDispatch();
    const {toast} =useToast();

    function handleUpdateQuantity(getCartItem, typeOfAction){

      if(typeOfAction == 'plus'){
        let getCartItems = cartItems.items || [];

        if(getCartItems.length){
            const indexOfCurrentCartItem = getCartItems.findIndex(item=>item.productId === getCartItem?.productId);

            const getCurrentProductIndex = productList.findIndex(product=> product._id=== getCartItem?.productId)
            const getTotalStock = productList[getCurrentProductIndex].totalStock

            if(indexOfCurrentCartItem> -1){
                const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                if(getQuantity + 1 > getTotalStock){
                    toast({
                        title: `Only ${getQuantity} can be added for this item`,
                        variant: 'destructive'
                    })

                    return;
                }

            }
        }
      }

        dispatch(UpdateCartItemQty({
            userId: user?.id,
            productId : getCartItem?.productId,
            quantity: typeOfAction==='plus' ? getCartItem?.quantity+1 : getCartItem?.quantity-1
        })).then(data =>{
            if(data?.payload.success){
                toast({
                    title : 'cart Item updated successfully'
                })
            }
        })
    }

    function handleCartItemDelete(getCartItem){
        dispatch(deleteCartItem({userId: user?.id, productId: getCartItem?.productId}))
        .then(data =>{
            if(data?.payload.success){
                toast({
                    title : 'cart Item deleted successfully'
                })
            }
        })
    }


    return (
  <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
    {/* Left: Image + title + quantity */}
    <div className="flex gap-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex flex-col justify-between">
        <h3 className="font-extrabold text-sm sm:text-base">{cartItem?.title}</h3>
        <div className="flex items-center mt-2 gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
    </div>

    {/* Right: Total + Trash icon */}
    <div className="flex flex-col items-end justify-between h-full">
      <p className="font-semibold text-sm sm:text-base">
        ${(
          (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
          cartItem?.quantity
        ).toFixed(2)}
      </p>
      <Trash
        onClick={() => handleCartItemDelete(cartItem)}
        className="cursor-pointer text-red-500 mt-2"
        size={20}
      />
    </div>
  </div>
);

}

export default UserCartItemsContent;