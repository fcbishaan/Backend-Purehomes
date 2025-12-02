const mongoose = require("mongoose");


const subcategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    isFeatured:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
   },    
    {
        timestamps: true, 
    }
);
const SubCat = mongoose.model("SubCategory", subcategorySchema);
module.exports = SubCat;