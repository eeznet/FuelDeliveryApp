import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  // ... schema definition
});

export default mongoose.model('Delivery', deliverySchema); 