var mongoose = require( 'mongoose' );

var itemSchema = new mongoose.Schema({
  name: {
    type: String
  },
  desc: {
    type: String
  },
  category: {
    type: String
  },
  sgst: {
    type: Number
  },
  cgst: {
    type: Number
  },
  hsnCode: {
    type: String
  },
  mrp: {
    type: Number
  },
  updationDate: {
    type: Date,
    default: Date.now
  },
  //classId : {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
  //syllabusmodules : [{type: mongoose.Schema.Types.ObjectId, ref: 'Module'}],
  isActive : Boolean
});


mongoose.model('Item', itemSchema);
