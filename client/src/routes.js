import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Import miscellaneous routes and other requirements
import App from './components/app';
import NotFoundPage from './components/pages/not-found-page';

// Import static pages
import HomePage from './components/pages/home-page';
import ContactPage from './components/pages/contact-page';
import ExpertsListingPage from './components/pages/experts-listing-page';
import ViewExpert from './components/pages/view-expert';
import UserSessionPage from './components/dashboard/user-session-page';
import ExpertSessionPage from './components/dashboard/expert-session-page';
import TokboxPage from './components/dashboard/tokbox-page';
import ComponentSamplesPage from './components/pages/component-samples';

// Import authentication related pages
import Register from './components/auth/register';
import Login from './components/auth/login';
import LoginSocial from './components/auth/login-social';
import Logout from './components/auth/logout';
import ForgotPassword from './components/auth/forgot_password';
import ResetPassword from './components/auth/reset_password';

// Import dashboard pages
import Dashboard from './components/dashboard/dashboard';
import ViewProfile from './components/dashboard/profile/view-profile';
import Inbox from './components/dashboard/messaging/inbox';
import CreateExpert from './components/dashboard/create-expert';
import Conversation from './components/dashboard/messaging/conversation';
import ComposeMessage from './components/dashboard/messaging/compose-message';
import BillingSettings from './components/billing/settings';

// Import billing pages
import InitialCheckout from './components/billing/initial-checkout';

// Import admin pages
import AdminDashboard from './components/admin/dashboard';

// Import higher order components
import RequireAuth from './components/auth/require_auth';

import MysessionList from './components/dashboard/mysession-list';
import Recordings from './components/pages/experts-recordings';
import MyReviews from './components/dashboard/my-reviews';
import SessionReviews from './components/dashboard/session-reviews';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="list/:category" component={ExpertsListingPage} />
    <Route path="contact-us" component={ContactPage} />
    <Route path="component-samples" component={RequireAuth(ComponentSamplesPage)} />
    <Route path="register" component={Register} />
    <Route path="login" component={Login} />
    <Route path="login-social" component={LoginSocial} />
    <Route path="logout" component={Logout} />
    <Route path="forgot-password" component={ForgotPassword} />
    <Route path="reset-password/:resetToken" component={ResetPassword} />

    <Route path="checkout/:plan" component={RequireAuth(InitialCheckout)} />
    <Route path="billing/settings" component={RequireAuth(BillingSettings)} />

    <Route path="profile" component={RequireAuth(ViewProfile)} />
    
    
    <Route path="expert/:category/:slug" component={ViewExpert} />

    <Route path="session/:slug" component={RequireAuth(UserSessionPage)} />
    <Route path="mysession/:slug" component={RequireAuth(ExpertSessionPage)} />
    <Route path="tokbox/:slug" component={TokboxPage} />
    <Route path="tokbox/join/:slug" component={TokboxPage} />

    <Route path="mysession-list" component={MysessionList} />
    <Route path="recordings" component={RequireAuth(Recordings) } />

    <Route path="admin" component={RequireAuth(AdminDashboard)} />

    <Route path="dashboard">
      <IndexRoute component={RequireAuth(Dashboard)} />
      <Route path="inbox" component={RequireAuth(Inbox)} />
      <Route path="create-expert" component={RequireAuth(CreateExpert)} />
      <Route path="conversation/new" component={RequireAuth(ComposeMessage)} />
      <Route path="conversation/view/:conversationId" component={RequireAuth(Conversation)} />
      <Route path="my-reviews" component={RequireAuth(MyReviews)} /> 
      <Route path="session-reviews" component={RequireAuth(SessionReviews)} />
    </Route>

    <Route path="*" component={NotFoundPage} />
  </Route>
);
