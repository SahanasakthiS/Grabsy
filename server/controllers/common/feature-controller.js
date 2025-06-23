const Feature= require('../../models/Feature')

const addFeatureImage= async(req, res)=>{
    try{

        const {image} = req.body

        const featuresImages = new Feature({
            image
        })

        await featuresImages.save()

        res.status(201).json({
            success: true,
            data: featuresImages
        })

    }catch(e){
        console.log(e);
        res.status(400).json({
            success: false,
            message: 'Some error occured'
        })
    }
}

const getFeatureImage= async(req, res)=>{
    try{

        const images= await Feature.find({})

        res.status(201).json({
            success: true,
            data: images
        })

    }catch(e){
        console.log(e);
        res.status(400).json({
            success: false,
            message: 'Some error occured'
        })
    }
}

const deleteFeatureImage = async (req, res) => {
    try {
        const { id } = req.params;
        await Feature.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Feature image deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error deleting feature image'
        });
    }
};

module.exports = {addFeatureImage, getFeatureImage, deleteFeatureImage}