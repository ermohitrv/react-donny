const Experts = require('../models/experts');
const ExpertsSubcategories = require('../models/expertssubcategories');
const User = require('../models/user');
const userReview = require('../models/userreview');
var nodemailer = require("nodemailer");
var config = require('../config/main');

//= =======================================
// Experts Routes
//= =======================================

/* API endpoint to render all categories list on homepage */
exports.getExpertsCategoryList = function (req, res, next) {
  Experts.aggregate(
    [
      {   $project: {'subcategory': 1, 'name': 1, 'slug': 1} },
      {   $unwind: '$subcategory' },
      {   $sort: {'subcategory.name': 1} },
      {   $group: {_id: '$_id', 'name': {  $first: '$name'}, 'slug': {  $first: '$slug'} ,'subcategory': {  $push: '$subcategory'} } },
      {   $sort: {'name': 1} }
    ], function (err, users) {
      if(err){
          return res.status(200).json(err);
      }
      return res.status(200).json(users);
  });
};

/* API endpoint to render all experts list by category */
exports.getExpertsListing = function(req, res, next) {
  if (!req.params.category) {
    res.status(422).send({ error: 'Please choose any category' });
    return next();
  }

  var category = req.params.category;

  res.header('Access-Control-Allow-Origin', '*');
    User.find(
        {
          'expertCategories' : { $regex : new RegExp(category, "i") },
        },
        {
          '_id':0,
          'accountCreationDate':0,
          'createdAt':0,
          'enableAccount':0,
          locationCity :0,
          locationCountry : 0,
          locationState : 0,
          locationZipcode: 0,
          password: 0,
          websiteURL: 0
        },
      function (err, expertsList) {
      if(expertsList){
          res.json(expertsList);
      }else{
          res.json({
              success: false,
              data: {},
              code: 404
          });
      }
    });
  /*ExpertsSubcategories.findOne({'slug':{ $regex : new RegExp(category, "i") }}, function (err, expertsList) {
      if(expertsList){
          res.json(expertsList);
      }else{
          res.json({
              success: false,
              data: {},
              code: 404
          });
      }
  });*/
};

/* API endpoint to send email message to expert */
exports.sendEmailMessageToExpert = function(req, res, next) {
  console.log(req.body.email);
  if ( ( !req.body.email && req.body.email != undefined ) && ( !req.body.message  && req.body.message != undefined ) && ( !req.params.expertemail  && req.params.expertemail != undefined ) ) {
    res.status(422).send({ error: 'Please choose any category' });
    return next();
  }

  var email = req.body.email;
  var message = req.body.message;
  var expertemail = req.body.expertemail;

  /* email for expert */
  var html = 'Hello , <br> Someone requested to have donnys list session with you. ';
  html += '<p>Following is user information:</p>';
  html += '<p>Email : '+email+'</p>';
  html += '<p>Message : '+message+'</p>';

  var mailOptions = {
      from   : "Donnys list <no-reply@donnyslist.com>",
      to     : expertemail,
      subject: "Donnys List Session Request",
      html   : html
  };

  /* email for session requester */
  var html1 = 'Hello , <br> Thank you for submitting your request.';
  html1 += '<p>Information you entered:</p>';
  html1 += '<p>Your Email : '+email+'</p>';
  html1 += '<p>Your Message : '+message+'</p>';
  html1 += '<br><p>We will contact you soon! <br>Team Donnys List</p>';
  var mailOptions1 = {
      from   : "Donnys list <no-reply@donnyslist.com>",
      to     : email,
      subject: "Donnys List Session Request",
      html   : html1
  };

  nodemailer.mail(mailOptions);
  nodemailer.mail(mailOptions1);

  res.json({
      success: true,
      message: 'Email sent successfully!',
      code: 200
  });
};

/* API endpoint to send text message to expert */
exports.sendTextMessageToExpert = function(req, res, next) {
    if ( ( req.body.text_message != "" && req.body.text_message != undefined ) && ( req.body.text_expert_email != "" && req.body.text_expert_email != undefined ) ){
      var request = require('request'),
        bodyMessage = req.body.text_message,
        expertEmail = req.body.text_expert_email,
        twilioAccountSID  = "AC498497309e749bdb201a20c3d1e0c1f9",
        twilioauthToken = "2cd189a265a979a999c0656396e1b8fb",
        twilioFromNumber  = "+14237026040",
        messageBodyPrefix = "Hi, Someone contacted you on www.donnieslist.com. Message : ";

      console.log('text_expert_email: '+req.body.text_expert_email);

      User.findOne({"email" : expertEmail},{contact:1},function(err, user){
        if(!err && user != ""){
          //res.send({user : user});

          var client = require('twilio')(twilioAccountSID, twilioauthToken);
          client.messages.create({
              to: user.contact,
              from: twilioFromNumber,
              body: messageBodyPrefix+bodyMessage
          }, function(err, message) {
              if(!err && message.sid){
                res.status(200).send({message: "Message successfully sent to expert!", messageId : message.sid, error : ""});
              }else{
                res.status(200).send({message: "", error : err});
              }
          });
        }else{
          res.send({err : err});
        }
      });
    }else{
      res.status(422).send({ error: 'parameters empty' });
    }
};

/* API endpoint to create expert by admin user */
exports.createExpert = function(req, res, next) {
  console.log(req.body.email);
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const contact = req.body.expertContact;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const slug = req.body.firstName+'-'+req.body.lastName;
  const role = 'Expert';
  const userBio = req.body.userBio;
  const expertRates = req.body.expertRates;
  const expertCategories = req.body.expertCategories;
  const expertRating = req.body.expertRating;
  const expertFocusExpertise = req.body.expertFocusExpertise;
  const yearsexpertise = req.body.yearsexpertise;
  
  const facebookURL = req.body.facebookLink;
  const twitterURL = req.body.twitterLink;
  const instagramURL = req.body.instagramLink;
  const linkedinURL = req.body.linkedinLink;
  const snapchatURL = req.body.snapchatLink ? req.body.snapchatLink : '';
  

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    //slug = firstName+'-'+new Date().getUTCMilliseconds();

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That email address is already in use.' });
    }

      // If email is unique and password was provided, create account
    const user = new User({
      email,
      password,
      contact,
      profile: { firstName, lastName },
      slug,
      userBio,
      expertRates,
      expertCategories,
      expertRating,
      expertFocusExpertise,
      yearsexpertise,
      facebookURL,
      twitterURL,
      instagramURL,
      linkedinURL,
      snapchatURL
    });

    User.findOne({slug:slug}, function(err, slugfound){
      if(err){

      }
      else if(slugfound && slugfound!=null && slugfound!=undefined && slugfound!=""){
        slug= slug+((new Date()).getHours()).toString()+((new Date()).getMinutes()).toString()+((new Date()).getSeconds()).toString()+((new Date()).getMilliseconds()).toString()
        user.slug= slug
            user.save((err, user) => {
              if (err) { return next(err); }

                // Subscribe member to Mailchimp list
                // mailchimp.subscribeToNewsletter(user.email);
              res.status(201).json({
                user: user,
                message: 'User Created Successfully'
              });
            });
      }
      else{
        console.log("Expert Pass")
        user.save((err, user) => {
          if (err) { return next(err); }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);
          res.status(201).json({
            user: user,
            message: 'User Created Successfully'
          });
        });
      }



    })

    // user.save((err, user) => {
    //   if (err) { return next(err); }

    //     // Subscribe member to Mailchimp list
    //     // mailchimp.subscribeToNewsletter(user.email);
    //   res.status(201).json({
    //     user: user,
    //     message: 'User created successfully'
    //   });
    // });

  });
};

/* API endpoint to render expert details */
exports.getExpertDetail = function(req, res, next) {
  var slug = req.params.slug;
  if (!req.params.slug) {
    res.status(422).send({ error: 'Please choose expert slug' });
    return next();
  }
  User.find(
      {
        'slug' : { $regex : new RegExp(slug, "i") },
      },
      {
        '_id':0,
        'accountCreationDate':0,
        'createdAt':0,
        'enableAccount':0,
        locationCity :0,
        locationCountry : 0,
        locationState : 0,
        locationZipcode: 0,
        password: 0,
        websiteURL: 0
      },
    function (err, expertsList) {
    if(expertsList){
        res.json(expertsList);
    }else{
        res.json({
            success: false,
            data: {},
            code: 404
        });
    }
  });

  /*ExpertsSubcategories.aggregate( [
    {   "$match": {
            "experts.slug": { $regex : new RegExp(slug, "i") }
        }
    },
    {   "$unwind": "$experts" },
    {   "$match": {
            "experts.slug": { $regex : new RegExp(slug, "i") }
        }
    },
    {   $limit : 1  }
  ], function (err, expert){
    if(expert){
        res.json(expert);
    }else{
        res.json({
            success: false,
            data: {},
            code: 404
        });
    }
  });*/
};

exports.saveUserReview = function(req, res, next){
    var bind = {};
    var rating = req.body.rating;
    var review = req.body.review;
    var title = req.body.title;
    var expertEmail = req.body.expertEmail;
    var expertFullName = req.body.expertFullName;
    var userEmail = req.body.userEmail;
    var userFullName = req.body.userFullName;
    var expertSlug = req.body.expertSlug;
    
    
    var newUserReview = new userReview();
    newUserReview.rating = rating;
    newUserReview.review = review;
    newUserReview.title = title;
    newUserReview.expertEmail = expertEmail;
    newUserReview.expertFullName = expertFullName;
    newUserReview.userEmail = userEmail;
    newUserReview.userFullName = userFullName;
    newUserReview.expertSlug = expertSlug;
    
    newUserReview.save(function(error){
        if(error){
            bind.status = 0;
            bind.message = 'Oops! error occured while saving user review';
            bind.error    = error;
        } else {
            bind.status = 1;
            bind.message = 'User review was saved successfully';
            
            // create reusable transport method (opens pool of SMTP connections)
            var smtpTransport = nodemailer.createTransport("SMTP",{
                service: "Gmail",
                auth: {
                    user: config.gmailEmail,
                    pass: config.gmailPassword
                }
            });
            
            
            /* email for expert */
            
            var html = 'Hello <strong>'+allTitleCase(expertFullName)+'</strong>, <br> <strong>'+ allTitleCase(userFullName) + '</strong> reviewed on your session.';
            html += '<p>Following is user information:</p>';
            html += '<p>Email : '+userEmail+'</p>';
            html += '<p>Title : '+title+'</p>';
            html += '<p>Review : '+review+'</p>';
            html += '<p>Rating : '+rating+'</p>';
            
             var mailOptions = {
                from   : "Donnys list <no-reply@donnyslist.com>",
                to     : expertEmail,
                subject: "Donnys List: User Review",
                html   : html
            };
            
            smtpTransport.sendMail(mailOptions, function(error, response){
            });
            
            
        }
        
        return res.json(bind);
    });
    
    
}

exports.getExpertReviews = function(req, res, next){
    var bind = {};
    var expertSlug = req.params.expertSlug;
    userReview.find({ expertSlug }, function(err, reviews){
        if(err){
            bind.status = 0;
            bind.message = 'Oops! error occured while fetching user reviews';
            bind.error = err;
        } else if(reviews){
            bind.status = 1;
            bind.reviews = reviews;
        } else {
            bind.status = 0;
            bind.message = 'No reviews Found';
        }
        
        return res.json(bind);
    }).sort({ _id: -1 });
    
}

function allTitleCase(inStr) {
    return inStr.replace(/\w\S*/g, function(tStr) { return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase(); });
} 


