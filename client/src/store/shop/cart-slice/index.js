import axios from "axios";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState={
    cartItems:[],
    isLoading: false
}

export const addToCart = createAsyncThunk('cart/addToCart', async({userId, productId,quantity})=>{

    const response = await axios.post('http://localhost:5000/api/shop/cart/add',
        {
        userId, productId, quantity
        }
    )

    return response.data
})

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async(userId)=>{

    const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`,

    )

    return response.data
})

export const deleteCartItem = createAsyncThunk('cart/deleteCartItems', async({userId, productId})=>{

    const response = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`,
        
    )

    return response.data
})

export const UpdateCartItemQty= createAsyncThunk('cart/UpdateCartItemQty', async({userId, productId,quantity})=>{

    const response = await axios.put('http://localhost:5000/api/shop/cart/update-cart',
        {
        userId, productId, quantity
        }
    )

    return response.data
})

const shoppingCartSlice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducer: {},
    extraReducers: (builder) =>{
        builder.addCase(addToCart.pending, (state)=>{
            state.isLoading= false
        }).addCase(addToCart.fulfilled, (state,action)=>{
            state.isLoading= false,
            state.cartItems= action.payload.data
        }).addCase(addToCart.rejected, (state)=>{
            state.isLoading= false,
            state.cartItems= []
        }).addCase(fetchCartItems.pending, (state)=>{
            state.isLoading= false
        }).addCase(fetchCartItems.fulfilled, (state,action)=>{
            state.isLoading= false,
            state.cartItems= action.payload.data
        }).addCase(fetchCartItems.rejected, (state)=>{
            state.isLoading= false,
            state.cartItems= []
        }).addCase(UpdateCartItemQty.pending, (state)=>{
            state.isLoading= false
        }).addCase(UpdateCartItemQty.fulfilled, (state,action)=>{
            state.isLoading= false,
            state.cartItems= action.payload.data
        }).addCase(UpdateCartItemQty.rejected, (state)=>{
            state.isLoading= false,
            state.cartItems= []
        }).addCase(deleteCartItem.pending, (state)=>{
            state.isLoading= false
        }).addCase(deleteCartItem.fulfilled, (state,action)=>{
            state.isLoading= false,
            state.cartItems= action.payload.data
        }).addCase(deleteCartItem.rejected, (state)=>{
            state.isLoading= false,
            state.cartItems= []
        })

    }
        
})

export default shoppingCartSlice.reducer;