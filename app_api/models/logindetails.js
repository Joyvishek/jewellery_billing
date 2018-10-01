var mongoose = require( 'mongoose' );

var loginDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  logins : [{type: Date}]
});


mongoose.model('LoginDetail', loginDetailsSchema);
