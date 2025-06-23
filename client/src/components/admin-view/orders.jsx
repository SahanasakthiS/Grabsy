import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card'
import { Table, TableHeader,TableHead, TableRow, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import AdminOrderDetailsView from './order-details';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersByUserId, getOrderDetails } from '@/store/shop/order-slice';
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice';
import { Badge } from '@/components/ui/badge';


function AdminOrdersView(){

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const {orderList, orderDetails} = useSelector(state => state.adminOrder)
    const dispatch = useDispatch();

    function handleFetchOrderDetails(getId){
        dispatch(getOrderDetailsForAdmin(getId))
    }

    useEffect(()=>{
        dispatch(getAllOrdersForAdmin())
    },[dispatch])

    console.log(orderDetails,'order')

    useEffect(()=>{
        if(orderDetails !== null) setOpenDetailsDialog(true)
    },[orderDetails])
    return(
        <Card>
            <CardHeader>
                <CardTitle>All History</CardTitle>
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
                                <Dialog open={openDetailsDialog} 
                                 onOpenChange={()=>{
                                   setOpenDetailsDialog(false);
                                  dispatch(resetOrderDetails())
                                }}
                                >
                                    <Button
                                     onClick={()=> handleFetchOrderDetails(orderItem?._id)} 
                                     >View Details</Button>
                                    <AdminOrderDetailsView orderDetails={orderDetails} />
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

export default AdminOrdersView;