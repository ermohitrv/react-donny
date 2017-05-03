var User = require('../models/user')
var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user : 'test4rvtech@gmail.com',
        //		test4rvtech@gmail.com
        pass : 'RVtechtest#123',
        //		RVtechtest#123
    },
    // tls: {
    //     rejectUnauthorized: false
    // }
});



exports.theAdminsUserList = function(req, res) {
	    console.log("this")
	      User.find({role:{$ne :["Admin"]}}, (err, users) => {
	        if (err) {
	          res.status(400).json({ error: 'No user could be found for this ID.' });
	          return next(err);
	        }
	        else{
	        	console.log(JSON.stringify(users))
	        	return res.status(200).json({ user: users });
	        }
	        
	      });
    }


exports.AdminToBanOrUnBanUser=function(req, res){
	var  transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user : 'test4rvtech@gmail.com',
	        //		test4rvtech@gmail.com
	        pass : 'RVtechtest#123',
	        //		RVtechtest#123
	    },
	    // tls: {
	    //     rejectUnauthorized: false
	    // }
	});
    console.log("********************")
    console.log(transporter)
    // console.log(JSON.stringify(req.body))
    var message = ""
    var state = ""
    // console.log(JSON.stringify(req.body.data))
      User.findById(req.body.id, (err, users) => {
          // console.log(JSON.stringify(users))
          if(users.enableAccount==true){
            users.enableAccount=false
            message="Successfully Banned the User"
            state="Banned"
				let mailOptions = {
				    from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
				    to: 'test4rvtech@gmail.com, '+users.email, // list of receivers
				    // to: "test4rvtech@gmail.com, "+email, // list of receivers
				    subject: 'DonnysList Youve Been Banned', // Subject line
				    
				    html: '<b> Hello '+users.profile.firstName+".</b> You've been banned", // html body
				};

				// send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log("In error of nodemailer")
                        console.log(error);
                    }
                    else{
                    	console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
                    }
                    
                });

          }
          else{
            users.enableAccount=true
            message= "Successfully Un Banned the User"
            state="UnBanned"
				let mailOptions = {
				    from: '"DonnysList" <test4rvtech@gmail.com>', // sender address
				    to: 'test4rvtech@gmail.com, '+users.email, // list of receivers
				    // to: "test4rvtech@gmail.com, "+email, // list of receivers
				    subject: "DonnysList- Congratulations You've Been UnBanned", // Subject line
				    
				    html: '<b> Hello '+users.profile.firstName+".</b> You've been Unbanned", // html body
				};

				// send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log("In error of nodemailer")
                        console.log(error);
                    }
                    else{
                    	console.log('Message sent to user: ' /*+ JSON.stringify(info)*/);
                    }
                    
                });
          }
          
          users.save(function(err){
            if(err){
              res.status(400).json({ error: 'Something Went Wrong' });
            }
            else{
              res.json({SuccessMessage:message, state:state})
            }
          })
      })
   }