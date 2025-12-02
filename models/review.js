import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
product :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true,
},
user:{
    type:String,
    required:true,   
},
star:{
    type:Number,
    required:true,
    min:1,
    max:5,
},
comment:{
    type:String,
    require :true,
},
},
{timestamps:true}
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;