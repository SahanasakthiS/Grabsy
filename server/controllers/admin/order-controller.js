const Order = require('../../models/Order')

const  getAllOrdersOfAllUsers = async(req,res)=>{
    try{

        const orders = await Order.find({ });

        if(!orders.length){
            res.status(404).json({
                success: false,
                message: 'No order found'
            })
        }

        res.status(200).json({
            success: true,
            data: orders
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occurred!"
        })
    }
}

const  getOrderDetailsForAdmin = async(req,res)=>{
    try{

        const {id} = req.params;
        const order = await Order.findById(id);

        if(!order){
            res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: order
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occurred!"
        })
    }
}

const updateOrderStatus = async(req,res)=>{
    try{

        const {id} = req.params;
        const {orderStatus} =req.body;

        const order = await Order.findById(id);

        if(!order){
            res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        await Order.findByIdAndUpdate(id,{orderStatus})

        res.status(200).json({
            success: true,
            message: 'Order status is updated successfully'
        })
        

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occurred!"
        })
    }
}

module.exports = {getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus}
