var mongoose = require( 'mongoose' );

var vendorSchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  contactPerson: {
    	name: {
    		type: String
  	},
	email:{
    		type: String
  	},
	contactNo:{
    		type: String
  	}
  },
  isActive : Boolean
});


mongoose.model('Vendor', vendorSchema);
