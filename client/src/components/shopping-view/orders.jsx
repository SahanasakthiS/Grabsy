import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader,TableHead, TableRow, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "@/components/ui/badge";

function ShoppingOrders(){

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const dispatch = useDispatch();
    const {user}  = useSelector(state=>state.auth)
    const {orderList, orderDetails}  = useSelector(state=>state.shopOrder)

    function handleFetchOrderDetails(getId){
        dispatch(getOrderDetails(getId))
    }

    useEffect(()=>{
        if(orderDetails !== null) setOpenDetailsDialog(true)
    })

    useEffect(()=>{
        dispatch(getAllOrdersByUserId(user?.id))
    },[dispatch])

    console.log(orderDetails, "OrderDetails")
    return(
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Id</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order status</TableHead>
                            <TableHead>Order price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {
                                orderList && orderList.length > 0?
                                orderList.map(orderItem=> <TableRow>
                            <TableCell>{orderItem?._id}</TableCell>
                            <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                            <TableCell>
                                <Badge className={`py-1 px-3 ${orderItem?.orderStatus === 'confirmed' ? 'bg-green-500' : orderItem?.orderStatus === 'rejected' ? 'bg-red-600'  : 'bg-black'}`}>{orderItem?.orderStatus}</Badge> 
                            </TableCell>
                            <TableCell>${orderItem?.totalAmount}</TableCell>
                            <TableCell>
                                <Dialog open={openDetailsDialog} onOpenChange={()=>{
                                    setOpenDetailsDialog(false);
                                    dispatch(resetOrderDetails())
                                }}>
                                    <Button onClick={()=> handleFetchOrderDetails(orderItem?._id)} >View Details</Button>
                                    <ShoppingOrderDetailsView orderDetails={orderDetails} />
                                </Dialog>
                            </TableCell>
                        </TableRow>):
                                null
                            }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
    );
}

export default ShoppingOrders;