const User = require('../models/user');
const setUserInfo = require('../helpers').setUserInfo;
const UserReview = require('../models/userreview');

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = function (req, res, next) {
  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = setUserInfo(user);

    return res.status(200).json({ user: userToReturn });
  });
};

exports.getUserReviews = function(req, res, next){
    const userEmail = req.param('userEmail');
    
    UserReview.aggregate([
        {
            $match: { userEmail: userEmail }
        },
        {
            $project: { 
            
                createdAt: 1,
                title: 1,
                review: 1,
                rating: 1,
                expertFullName: 1,
            }
        },
        {
            $sort: { createdAt: -1 }
        }
        
    ], function(err, userReviews){
        var bind = {};
        if(err){
            bind.status = 0;
            bind.message = 'Oops! error occur while fetching user reviews';
            bind.error = err;
        } else if(userReviews){
            bind.status = 1;
            bind.userReviews = userReviews;
        } else {
            bind.status = 0;
            bind.message = 'No reviews found';
        }
        
        return res.json(bind);
        
    });
}
