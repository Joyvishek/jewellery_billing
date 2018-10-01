var mongoose = require( 'mongoose' );

var customerSchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  mobno: {
    type: String
  },
  updationDate: {
    type: Date,
    default: Date.now
  },
  //classId : {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
  //syllabusmodules : [{type: mongoose.Schema.Types.ObjectId, ref: 'Module'}],
  isActive : Boolean
});


mongoose.model('Customer', customerSchema);
