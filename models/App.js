import mongoose from 'mongoose';
const { Schema } = mongoose;

const appSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
});

export default mongoose.model('App', appSchema)