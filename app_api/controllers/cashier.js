var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var Product = mongoose.model('Product');
var Invoice = mongoose.model('Invoice');

//Save a particular customer information either insert new or edit existing
module.exports.saveCustomerDetails = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	req.body.params.customer.isActive = true;
	if(!req.body.params.customer._id){
		req.body.params.customer._id = new mongoose.Types.ObjectId();
	}
	Customer.findOneAndUpdate({ '_id': req.body.params.customer._id }, req.body.params.customer, {upsert:true, new:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    	 return res.send({"status":"OK","msg":"succesfully saved details"});
	});
  }

};

//Save a particular customer invoice information either insert new or edit existing
module.exports.saveCustomerInvoice = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {

	Invoice.find({}).sort({"invoiceSerial":-1}).limit(1).exec(function(err, maxInvoiceSerial){
	    if (err) return res.send(500, { error: err });


		req.body.params.invoice.isActive = true;
		if(!req.body.params.invoice._id){
			req.body.params.invoice._id = new mongoose.Types.ObjectId();
			req.body.params.invoice.invoiceDate = new Date();
			req.body.params.invoice.invoiceSerial= 1 + maxInvoiceSerial[0].invoiceSerial;
			req.body.params.invoice.invoiceNo = req.body.params.invoice.invoiceSerial;
		}
		Invoice.findOneAndUpdate({ '_id': req.body.params.invoice._id }, req.body.params.invoice, {upsert:true, new:true}, function(err, doc){
		    if (err) return res.send(500, { error: err });
		    	 return res.send({"status":"OK","msg":"succesfully saved details"});
		});
	});
  }

};

// Find all Products
module.exports.getProducts = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	if(true){
        	var filterParams = {};
		filterParams.isActive = true;
		if(req.query.batchNo){
			filterParams.batchNo = new RegExp("^"+req.query.batchNo, 'i');
		}

		if(req.query.isSold == true){
			filterParams.isSold = req.query.isSold;
		}
		else{
			filterParams.isSold = {$ne: true};
		}

		if(req.query.isDamaged == true){
			filterParams.isDamaged = req.query.isDamaged;
		}
		else{
			filterParams.isDamaged = {$ne: true};
		}

		if(req.query.barcode){
			filterParams.barcode = new RegExp("^"+req.query.barcode, 'i');
		}


		Product.find(filterParams).exec(function(err, doc){
		    if (err) return res.send(500, { error: err });
		    if(doc){ 
			    return res.status(200).json(doc);

		    }else{
			return res.status(400).json({"message":"Invalid Request"});
		    }
		});
	}else{
		return res.status(400).json({"message":"Invalid request"});
	}
  }

};


