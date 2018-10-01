var mongoose = require( 'mongoose' );

var invoiceSchema = new mongoose.Schema({
  products : [{
	slNo: String,
	itemDesc: String,
	barcode: String,
	productId: mongoose.Schema.Types.ObjectId,
	mrp: Number,
	sellingPrice: Number,
	hsnCode: String
  }],
  customer : {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  invoiceSerial: {
    type: Number
  },
  invoiceNo: {
    type: String
  },
  discount: {
    type: Number
  },
  otherCharges: {
    type: Number
  },
  grossAmount: {
    type: Number
  },
  sgst: {
    type: Number
  },
  cgst: {
    type: Number
  },
  netAmount: {
    type: Number
  },
  status: {
    type: String
  },
  isActive : Boolean,
  salesPerson : {
	name: String,
	id: String
  },
  paymentDetails:[{
	paymentCode: String,
	bank: String,
	paymentMode: String
  }]
});


mongoose.model('Invoice', invoiceSchema);
