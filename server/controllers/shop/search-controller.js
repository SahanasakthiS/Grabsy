const Product = require('../../models/Product')


const searchProducts= async(req, res)=>{
    try{

        const {keyword} = req.params;
        if(!keyword || typeof keyword !== 'string'){
            return res.status(500).json({
                success: false,
                message: 'Keyword required in string format'
            })
        }

        const regEx = new RegExp(keyword, 'i')

        const createSearchQuery = {
            $or:[
                {title: regEx},
                {description: regEx},
                {category: regEx},
                {brand: regEx},
            ]
        }

        const searchResults = await Product.find(createSearchQuery);

        res.status(200).json({
            success: true,
            data: searchResults
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: 'Some Error occured'
        })
    }
}

module.exports = {searchProducts}