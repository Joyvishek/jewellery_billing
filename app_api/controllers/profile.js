var mongoose = require('mongoose');
var User = mongoose.model('User');
var discourse_sso = require('discourse-sso');
var sso = new discourse_sso("MY_SECRET");
var Mailer = require('./sendmail');
var crypto = require('crypto');
var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    fs = require('fs');
var envConfig = require('../config/env.json')[process.env.NODE_ENV || 'development'];
var LoginDetail = mongoose.model('LoginDetail');

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findOne({_id:req.payload._id}).populate("currentschool").populate("currentsection")
      .exec(function(err, user) {

	//res.redirect('http://www.google.com');
        //res.status(200).send({redirect_to: 'http://www.google.com'});
	//var sso_payload = req.query.sso; // fetch from incoming request
	//var sig = req.query.sig; // fetch from incoming request
	//var redirect_to_url = 'http://54.169.85.240/session/sso_login?';
	//if(sso.validate(sso_payload, sig)) {
		//var nonce = sso.getNonce(sso_payload);
		//var userparams = {
			// Required, will throw exception otherwise
			//"nonce": nonce,
			//"external_id": user._id,
			//"email": user.email,
			// Optional
			//"username": "Pat",
		//	//"name": "Gaurab Patra"
		//};
		//var q = sso.buildLoginString(userparams);
		//res.status(200).json({redirect_to: redirect_to_url+q});
	//}
	res.status(200).json(user);
      });
  }

};

module.exports.saveUsername = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	//res.status(200).json({is_unique: true});

	User.findOneAndUpdate({ _id : req.payload._id }, { 'username' : req.body.params.username }, {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    return res.send("succesfully saved");
	});
  }

};

module.exports.isEmailUnique = function(req, res) {
	//res.status(200).json({is_unique: true});
	User.findOne({ 'email' : req.query.setemail }, function(err, user) {
		if(err){
			res.status(401).json({
		          "message" : "UnauthorizedError: private profile"
		        });
		}
		if(user){
			res.status(200).json({is_unique: false});
		}else{
			res.status(200).json({is_unique: true});
		}

        });

};

module.exports.saveEmail = function(req, res) {
	var emailHash = crypto.randomBytes(20).toString('hex');
	var newUser = new User({ 'email' : req.body.params.setemail, 'emailVerificationHash':emailHash  });
	newUser.save( function(err, doc){
	    if (err) return res.send(500, { error: err });
	    var sendsubmail = new Mailer({to: req.body.params.setemail, subject: 'Welcome To TheoreX ✔',text: 'Successfully Registered 🐴', html: '<center><table width="700" background="#FFFFFF" style="text-align:left;" cellpadding="0" cellspacing="0"><tr>	<td height="18" width="31" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="18" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="18" width="466" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><tr>	<td height="2" width="31" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="2" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="2" width="466" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><!--GREEN STRIPE--><tr>	<td background="" width="31" bgcolor="#00a0e3" style="border-top:1px solid #FFF; border-bottom:1px solid #FFF;" height="113">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<!--WHITE TEXT AREA-->	<td width="131" bgcolor="#FFFFFF" style="border-top:1px solid #FFF; text-align:center;" height="113" valign="middle">	<span style="font-size:30px; font-family:Josefin Sans; color:#00a0e3;">Thank You!</span>	</td>	<!--GREEN TEXT AREA-->	<td background="" bgcolor="#00a0e3" style="border-top:1px solid #FFF; border-bottom:1px solid #FFF; padding-left:15px;" height="113">	<span style="color:#FFFFFF; font-size:25px; font-family:Josefin Sans">For being grateful to your talent.</span>	</td></tr><!--DOUBLE BORDERS BOTTOM--><tr>	<td height="3" width="31" style="border-top:1px solid #e4e4e4; border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="3" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="3" style="border-top:1px solid #e4e4e4; border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><tr>	<center>	<td colspan="3">	<!--CONTENT STARTS HERE-->	<br />	<br />	<table cellpadding="0" cellspacing="0">	<tr>	<td width="200"><div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div></td>	<td width="400" style="padding-right:10px; font-family:Trebuchet MS, Verdana, Arial; font-size:12px;" valign="top">	<span style="font-family:Josefin Sans; font-size:20px; font-weight:bold;">Hey, Welcome to <span style="color:#00a0e3">TheoreX</span></span>	<br />	<p style="font-family:Josefin Sans; font-size:15px;">You have now made us a stakeholder in your life! You are just a step away from Learn Create & Execute</p><center><a href="'+ envConfig.DOMAIN +'/emailverify/'+ emailHash + '" style="color: #555; background: #00a0e3;color:#fff;text-decoration:none;padding:10px;font-size:20px;">Verify Email</a></center><br /><p style="font-family:Josefin Sans; font-size:15px;">In the meantime, you can <a href="http://theorexedutech.com/">return to our website</a> to continue browsing.</p>   <p style="font-family:Josefin Sans;font-size:12px;font-weight:bold;">Best Regards,<br/>   Team TheoreX   <br/></p>	</table><br /><table cellpadding="0" style="border-top:1px solid #e4e4e4; text-align:center; font-family:Trebuchet MS, Verdana, Arial; font-size:12px;" cellspacing="0" width="900"><tr>	<td height="2" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr>	<td style="font-family:Josefin Sans; font-size:12px; font-weight:bold;">	<br />	For more information get back to us at info@theorexedutech.com	</td></tr></table></center> ' });

	    return res.send("succesfully saved");
	});

};

module.exports.saveUserDetails = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	User.findOneAndUpdate({ 'email': req.body.params.setemail }, req.body.params.user, {upsert:true, new:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    Section.findOneAndUpdate({ '_id': req.body.params.user.currentsection }, {$addToSet : {"students" : doc._id}}, function(err, stddoc){
	    	 return res.send("succesfully saved user details");
		});
	});
  }

};


module.exports.resendEmail = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	var emailHash = crypto.randomBytes(20).toString('hex').concat(req.payload._id);
	User.findOneAndUpdate({ _id : req.payload._id }, { 'emailVerificationHash':emailHash  }, {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err })
	    var sendsubmail = new Mailer({to: req.payload.email, subject: 'Welcome To TheoreX',text: 'Successfully Registered ', html: '<center><table width="700" background="#FFFFFF" style="text-align:left;" cellpadding="0" cellspacing="0"><tr>	<td height="18" width="31" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="18" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="18" width="466" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><tr>	<td height="2" width="31" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="2" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="2" width="466" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><!--GREEN STRIPE--><tr>	<td background="" width="31" bgcolor="#00a0e3" style="border-top:1px solid #FFF; border-bottom:1px solid #FFF;" height="113">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<!--WHITE TEXT AREA-->	<td width="131" bgcolor="#FFFFFF" style="border-top:1px solid #FFF; text-align:center;" height="113" valign="middle">	<span style="font-size:30px; font-family:Josefin Sans; color:#00a0e3;">Thank You!</span>	</td>	<!--GREEN TEXT AREA-->	<td background="" bgcolor="#00a0e3" style="border-top:1px solid #FFF; border-bottom:1px solid #FFF; padding-left:15px;" height="113">	<span style="color:#FFFFFF; font-size:25px; font-family:Josefin Sans">For being grateful to your talent.</span>	</td></tr><!--DOUBLE BORDERS BOTTOM--><tr>	<td height="3" width="31" style="border-top:1px solid #e4e4e4; border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="3" width="131">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td>	<td height="3" style="border-top:1px solid #e4e4e4; border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr><tr>	<center>	<td colspan="3">	<!--CONTENT STARTS HERE-->	<br />	<br />	<table cellpadding="0" cellspacing="0">	<tr>	<td width="200"><div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div></td>	<td width="400" style="padding-right:10px; font-family:Trebuchet MS, Verdana, Arial; font-size:12px;" valign="top">	<span style="font-family:Josefin Sans; font-size:20px; font-weight:bold;">Hey, Welcome to <span style="color:#00a0e3">TheoreX</span></span>	<br />	<p style="font-family:Josefin Sans; font-size:15px;">You have now made us a stakeholder in your life! You are just a step away from Learn Create & Execute</p><center><a href="http://theorexedutech.com/emailverify/'+ emailHash + '" style="color: #555; background: #00a0e3;color:#fff;text-decoration:none;padding:10px;font-size:20px;">Verify Email</a></center><br /><p style="font-family:Josefin Sans; font-size:15px;">In the meantime, you can <a href="http://theorexedutech.com/">return to our website</a> to continue browsing.</p>   <p style="font-family:Josefin Sans;font-size:12px;font-weight:bold;">Best Regards,<br/>   Team TheoreX   <br/></p>	</table><br /><table cellpadding="0" style="border-top:1px solid #e4e4e4; text-align:center; font-family:Trebuchet MS, Verdana, Arial; font-size:12px;" cellspacing="0" width="900"><tr>	<td height="2" style="border-bottom:1px solid #e4e4e4;">	<div style="line-height: 0px; font-size: 1px; position: absolute;">&nbsp;</div>	</td></tr>	<td style="font-family:Josefin Sans; font-size:12px; font-weight:bold;">	<br />	For more information get back to us at info@theorexedutech.com	</td></tr></table></center> ' });;
	    return res.send("succesfully saved");
	});
  }

};



module.exports.profileEdit = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	User.findOneAndUpdate({ _id : req.payload._id }, req.body.updateParam , {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    return res.send("succesfully saved");
	});
	//res.status(200).json(req.body.name);

  }

};


module.exports.uploadImage = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
//console.log(req.files.file);
      var file = req.files.file;
      var contentType = file.headers['content-type'];
      var extension = file.path.substring(file.path.lastIndexOf('.'));

      var destPath = 'profilepic/' + uuid.v4() + extension;

      var headers = {
        'x-amz-acl': 'public-read',
        'Content-Length': file.size,
        'Content-Type': contentType
      };

AWS.config.region = 'ap-south-1';
AWS.config.accessKeyId = 'AKIAIY2BTOJFMD62ITVQ';
AWS.config.secretAccessKey = '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';

var s3Bucket = new AWS.S3( { params: {Bucket: 'theorexbucket'} } );
var data = {Key: destPath, Body: require('fs').createReadStream(file.path), ACL: 'public-read',ContentType:contentType};
s3Bucket.putObject(data, function(err, data){
  if (err)
    { console.log('Error uploading data: ', err);
    } else {
	User.findOneAndUpdate({ _id : req.payload._id }, {'profilepic':'https://s3.ap-south-1.amazonaws.com/theorexbucket/'+destPath} , {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    return res.send({data:'https://s3.ap-south-1.amazonaws.com/theorexbucket/'+destPath});
	});
    }
});

  }

};

// if first login
module.exports.isFirstLogin = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
	LoginDetail.findOne({ userId: req.payload._id }, function(err, doc){
	    if (err) return res.send(500, { error: err });
            if(doc && doc.logins.length==1){ // if this is the first login if only one login timestamp is registered in the DB
	    	return res.status(200).json({isfirstlogin:true});
	    }else{
	    	return res.status(200).json({isfirstlogin:false});
	    }
	});
  }

};

