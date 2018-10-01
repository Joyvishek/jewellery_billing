var mongoose = require( 'mongoose' );

var productSchema = new mongoose.Schema({
  itemId : {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  barcode: {
    type: String
  },
  costPrice: {
    type: Number
  },
  batchNo: {
    type: String
  },
  vendorId : {type: mongoose.Schema.Types.ObjectId, ref: 'Vendor'},
  updationDate: {
    type: Date,
    default: Date.now
  },
  exchange:{
    exchangeDueToDamage: Boolean,
    exchangeDueToCustomerChoice: Boolean,
    exchangeByCustomerDate: Date
  },
  isDamaged:Boolean,
  damaged:{
    refundedByVendor: Boolean,
    replacedByVendor: Boolean,
    replacedByProductId:{type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  },
  isSold: Boolean,
  sold:{
    sellingDate: Date,
    invoiceId: {type: mongoose.Schema.Types.ObjectId, ref: 'Invoice'},
  },
  isActive : Boolean
});


mongoose.model('Product', productSchema);
