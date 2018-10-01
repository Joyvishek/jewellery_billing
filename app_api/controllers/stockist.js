var mongoose = require('mongoose');
var Vendor = mongoose.model('Vendor');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var Product = mongoose.model('Product');

//Save a particular vendor information either insert new or edit existing
module.exports.saveVendor = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	req.body.params.vendor.isActive = true;
	if(!req.body.params.vendor._id){
		req.body.params.vendor._id = new mongoose.Types.ObjectId();
	}
	Vendor.findOneAndUpdate({ '_id': req.body.params.vendor._id }, req.body.params.vendor, {upsert:true, new:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    /*Section.findOneAndUpdate({ '_id': req.body.params.user.currentsection }, {$addToSet : {"students" : doc._id}}, function(err, stddoc){
	    	 return res.send("succesfully saved user details");
		});*/

	    	 return res.send({"status":"OK","msg":"succesfully saved details"});
	});
  }

};

//Save a particular item information either insert new or edit existing
module.exports.saveItem = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	req.body.params.item.isActive = true;
	if(!req.body.params.item._id){
		req.body.params.item._id = new mongoose.Types.ObjectId();
	}
	Item.findOneAndUpdate({ '_id': req.body.params.item._id }, req.body.params.item, {upsert:true, new:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    /*Section.findOneAndUpdate({ '_id': req.body.params.user.currentsection }, {$addToSet : {"students" : doc._id}}, function(err, stddoc){
	    	 return res.send("succesfully saved user details");
		});*/

	    	 return res.send({"status":"OK","msg":"succesfully saved details"});
	});
  }

};

//Save a particular product information within a batch (Stock Entry) either insert new or edit existing
module.exports.saveProduct = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	if(!req.body.params.product.isActive && req.body.params.product.isActive != false){
		req.body.params.product.isActive = true;
	}
	if(!req.body.params.product._id){
		req.body.params.product._id = new mongoose.Types.ObjectId();
	}

	Product.findOneAndUpdate({ '_id': req.body.params.product._id }, req.body.params.product, {upsert:true, new:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    /*Section.findOneAndUpdate({ '_id': req.body.params.user.currentsection }, {$addToSet : {"students" : doc._id}}, function(err, stddoc){
	    	 return res.send("succesfully saved user details");
		});*/

	    	 return res.send({"status":"OK","msg":"succesfully saved details"});
	});
  }

};

// Find all Items
module.exports.getItems = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	if(true){
        	var filterParams = {};
		filterParams.isActive = true;
		if(req.query.name){
			filterParams.name = new RegExp("^"+req.query.name, 'i');
		}
		if(req.query.category){
			filterParams.category = new RegExp("^"+req.query.category);
		}
		Item.find(filterParams).exec(function(err, doc){
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

// Find all Vendors
module.exports.getVendors = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	if(true){
        	var filterParams = {};
		filterParams.isActive = true;
		if(req.query.name){
			filterParams.name = new RegExp("^"+req.query.name, 'i');
		}
		if(req.query.category){
			filterParams.category = new RegExp("^"+req.query.category);
		}
		Vendor.find(filterParams).exec(function(err, doc){
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


		Product.find(filterParams).populate('itemId').exec(function(err, doc){
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

// Find all Batches
module.exports.getBatches = function(req, res) {

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

		    Product.aggregate([
		       {"$match": filterParams},
		       {"$sort": { updationDate : -1 }},
		       {"$lookup": {
			"from" : "vendors",
			"localField" : "vendorId",
			"foreignField" : "_id",
			"as" : "vendorObjects"
		       }},
		       {"$unwind": "$vendorObjects"},

		    ])
		    .exec(function(err, doc){
			if (err) return res.send(500, { error: err });
			if(doc){ 
			var batches={};
			var productCounter=0;
			doc.forEach(function(product){
				productCounter++;
			});
			doc.forEach(function(product){
			      var batchNo = product.batchNo;
			      if(!batches[batchNo]){
				batches[batchNo] = {};
				batches[batchNo].quantityOrdered=0;
				batches[batchNo].quantityDamaged=0;
				batches[batchNo].quantityReplaced=0;
				batches[batchNo].quantityInHand=0;
				batches[batchNo].quantityRefunded=0;
				batches[batchNo].costPrice=0.00;
				batches[batchNo].moneyReturned=0.00;
				batches[batchNo].replacedAmount=0.00;
				batches[batchNo].totalExpense=0.00;
				batches[batchNo].batchNo = product.batchNo;
				batches[batchNo].vendor = product.vendorObjects;
			      }
				productCounter--;
				if(product.isDamaged){
					if(product.damaged.replacedByVendor){
						batches[batchNo].quantityReplaced++;
						batches[batchNo].replacedAmount += product.costPrice;
					}
					else if(product.damaged.refundedByVendor){
						batches[batchNo].quantityRefunded++;
						batches[batchNo].moneyReturned += product.costPrice;
						batches[batchNo].totalExpense-=product.costPrice;
						batches[batchNo].quantityInHand --;
					}
					batches[batchNo].quantityDamaged++;
				}
				batches[batchNo].quantityOrdered++;
				batches[batchNo].costPrice+=product.costPrice;
console.log(batches, productCounter);
				if(productCounter==0){
			 		return res.status(200).json(batches);
				}
		       }); // end of products loop 
			}else{
			return res.status(400).json({"message":"Invalid Request"});
			}
		    }); 
	}else{
		return res.status(400).json({"message":"Invalid request"});
	}
  }

};

//Generate Barcode 
module.exports.generateBarcode = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {

var pad = "00000000";

	Product.find({ "batchNo" : req.body.params.product.batchNo }).exec(function(err, products){
	    if (err) return res.send(500, { error: err });
	    if(products){ 
		products.forEach(function(product){
			Item.findOne({ "_id" : product.itemId }).exec(function(err, item){
			    if (err) return res.send(500, { error: err });
			    if(item){ 
				var barcode="";
				if(!item.mrp){
					item.mrp = 0.00;
				}
				var str = ""+item.mrp*100;
				var mrp = pad.substring(0, pad.length - str.length) + str;
				barcode += req.body.params.product.batchNo + product._id + mrp;

				Product.findOneAndUpdate({ '_id': product._id }, {"barcode": barcode}, {upsert:true, new:true}, function(err, doc){
				    if (err) return res.send(500, { error: err });
				});
			    }else{
				return res.status(400).json({"message":"Invalid Request"});
			    }
			});
		}); // end of products forEach
	    }else{
		return res.status(400).json({"message":"Invalid Request"});
	    }
	});
	return res.status(200).json({"status":"OK"});

  }

};

