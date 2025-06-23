import { Button } from "../ui/button";
import { CardContent, Card, CardFooter} from "../ui/card";
import { Label } from "../ui/label";


function AddressCard({addressInfo, handleDeleteAddress,handleEditAddress, setCurrentSelectedAddress, selectedId}){
    return(
        <Card onClick={ setCurrentSelectedAddress ?
            () => 
  setCurrentSelectedAddress(addressInfo)
  : null
}

className={`cursor-pointer border-red-700 ${selectedId?._id === addressInfo?._id ? 'border-green-900 border-[5px]' : 'border-black'}`}
>
            <CardContent className='grid p-4 gap-4'>
                <Label>Address: {addressInfo?.address}</Label>
                <Label>City: {addressInfo?.city}</Label>
                <Label>Phone: {addressInfo?.phone}</Label>
                <Label>Pincode: {addressInfo?.pincode}</Label>
                <Label>Notes: {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className="p-3 flex justify-between">
                <Button onClick={()=> handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={()=> handleDeleteAddress(addressInfo)} >Delete</Button>
            </CardFooter>
        </Card>
    );
}

export default AddressCard