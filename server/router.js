const AuthenticationController = require('./controllers/authentication');
const UserController = require('./controllers/user');
const ExpertsController = require('./controllers/experts');
const VideoSessionController = require('./controllers/videosession');
const ChatController = require('./controllers/chat');
const ExpertChatController = require('./controllers/expertchat');
const CommunicationController = require('./controllers/communication');
const StripeController = require('./controllers/stripe');
const VideoSessionStripeController = require('./controllers/video-session-stripe');
const express = require('express');
const passport = require('passport');
const ROLE_MEMBER = require('./constants').ROLE_MEMBER;
const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
const ROLE_OWNER = require('./constants').ROLE_OWNER;
const ROLE_ADMIN = require('./constants').ROLE_ADMIN;

const passportService = require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    chatRoutes = express.Router(),
    expertChatRoutes = express.Router(),
    payRoutes = express.Router(),
    videoSessionStripeRoutes = express.Router(),
    communicationRoutes = express.Router();

  //= ========================
  // Experts Routes
  //= ========================

  //= ========================
  // Auth Routes
  //= ========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  //= ========================
  // Facebook Routes
  //= ========================

  apiRoutes.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  apiRoutes.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
    function(req, res) {
      res.redirect("http://localhost:5000/login-social/?facebook_token=" + req.user.jwtLoginAccessToken);
    }
  );

  apiRoutes.post('/auth/facebook-send-jwt-token', AuthenticationController.facebookSendJWTtoken);

  //= ========================
  // Twitter Routes
  //= ========================

  apiRoutes.get('/auth/twitter', passport.authenticate('twitter'));

  apiRoutes.get('/auth/twitter/callback',
    passport.authenticate('twitter', { session: false, failureRedirect: "/" }),
    function(req, res) {
      res.redirect("http://localhost:5000/login-social/?twitter_token=" + req.user.jwtLoginAccessToken);
  });


  apiRoutes.get('/test-stripe-payment', function(req, res) {
      var stripe = require("stripe")("sk_test_08cuSozBbGN2QPnpieyjxomZ");
      res.redirect("");
  });

  apiRoutes.post('/auth/twitter-send-jwt-token', AuthenticationController.twitterSendJWTtoken);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  // Password reset route (change password using token)
  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

  // Test protected route
  apiRoutes.get('/protected', requireAuth, (req, res) => {
    res.send({ content: 'The protected test route is functional!' });
  });

  apiRoutes.get('/admins-only', requireAuth, AuthenticationController.roleAuthorization(ROLE_ADMIN), (req, res) => {
    res.send({ content: 'Admin dashboard is working.' });
  });

  //= ========================
  // Experts Routes
  //= ========================
  apiRoutes.get('/getExpertsCategoryList', ExpertsController.getExpertsCategoryList);
  apiRoutes.get('/getExpertsListing/:category', ExpertsController.getExpertsListing);
  apiRoutes.get('/getExpertDetail/:slug', ExpertsController.getExpertDetail);

  apiRoutes.post('/sendEmailMessageToExpert', ExpertsController.sendEmailMessageToExpert);
  apiRoutes.post('/sendTextMessageToExpert', ExpertsController.sendTextMessageToExpert);
  apiRoutes.post('/createExpert/', ExpertsController.createExpert);

  //= ========================
  // Session Routes
  //= ========================
  //to be created by expert
  apiRoutes.post('/createVideoSession/', VideoSessionController.createVideoSession);
  //to be joined by user
  apiRoutes.post('/joinVideoSession/', VideoSessionController.joinVideoSession);
  apiRoutes.post('/createAudioSession/', VideoSessionController.createAudioSession);

  //= ========================
  // Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/chat', chatRoutes);

  // View messages to and from authenticated user
  chatRoutes.get('/', requireAuth, ChatController.getConversations);

  // Retrieve single conversation
  chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

  // Send reply in conversation
  chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);

  // Start new conversation
  chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);

  //= ========================
  // Expert-Session Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/expertchat', expertChatRoutes);

  // View messages to and from authenticated user
  //expertChatRoutes.get('/', requireAuth, ExpertChatController.getConversations);

  // Retrieve single conversation
  expertChatRoutes.get('/fetchSessionChat/:sessionOwnerUsername', requireAuth, ExpertChatController.fetchSessionChat);

  // Send reply in conversation
  expertChatRoutes.post('/expertsessionchat', requireAuth, ExpertChatController.expertsessionchat);

  // Start new conversation
  //expertChatRoutes.post('/new/:recipient', requireAuth, ExpertChatController.newConversation);

  //= ========================
  // Video Session Stripe Payment Routes
  //= ========================
  apiRoutes.use('/videosession',videoSessionStripeRoutes);

  videoSessionStripeRoutes.post('/recharge-video-session', VideoSessionStripeController.rechargeVideoSession);

  videoSessionStripeRoutes.post('/check-before-session-start', VideoSessionStripeController.checkBeforeSessionStart);

  //= ========================
  // Payment Routes
  //= ========================
  apiRoutes.use('/pay', payRoutes);

  // Webhook endpoint for Stripe
  payRoutes.post('/webhook-notify', StripeController.webhook);

  // Create customer and subscription
  payRoutes.post('/customer', requireAuth, StripeController.createSubscription);

  // Update customer object and billing information
  payRoutes.put('/customer', requireAuth, StripeController.updateCustomerBillingInfo);

  // Delete subscription from customer
  payRoutes.delete('/subscription', requireAuth, StripeController.deleteSubscription);

  // Upgrade or downgrade subscription
  payRoutes.put('/subscription', requireAuth, StripeController.changeSubscription);

  // Fetch customer information
  payRoutes.get('/customer', requireAuth, StripeController.getCustomer);

  //= ========================
  // Communication Routes
  //= ========================
  apiRoutes.use('/communication', communicationRoutes);

  // Send email from contact form
  communicationRoutes.post('/contact', CommunicationController.sendContactForm);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
