const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: String, required: true },
  photoUrl: String,
  description: String,
});

// homeSchema.pre('findOneAndDelete', async function(){
//   console.log("pre hook before deleting")
//   const homeId = this.getQuery()._id;
//   await favourites.deleteMany({houseId : homeId});

// })
module.exports = mongoose.model('Home',homeSchema);
