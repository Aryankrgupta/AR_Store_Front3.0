import {model, models, Schema} from "mongoose";
import moment from "moment-timezone";

const OrderSchema = new Schema({
  userEmail: String,
  line_items:Object,
  name:String,
  email:String,
  city:String,
  pinCode:String,
  address:String,
  country:String,
  paid:Boolean,
},{
  timestamps: {
    currentTime: () => moment().tz("Asia/Kolkata").toDate(),
  },
});

export const Order = models?.Order || model('Order', OrderSchema);