const mongoose = require("mongoose");
const Review = require("./review.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type : String,
  },
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1750801321923-a93fd5e5bf21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ],
  owner : {
      type : Schema.Types.ObjectId,
      ref : "User",
  }

});

listingSchema.post("findOneAndDelete" , async(listing)=>{

  if(listing){ 
    await Review.deleteMany({_id : {$in:listing.reviews}});} 
   
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;
