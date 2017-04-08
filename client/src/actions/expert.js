import axios from 'axios';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from './index';
import { AUTH_USER, AUTH_ERROR, SEND_EXPERT_EMAIL,SEND_EXPERT_TEXT_MESSAGE, CREATE_EXPERT, PROTECTED_TEST } from './types';
//= ===============================
// sendEmail actions
//= ===============================
export function sendEmail({ email, message, expertemail}) {
  return function (dispatch) {
    var expertemail = "mohit@rvtechnologies.co.in";
    if(message !== undefined && email !== undefined){
      return axios.post(`${API_URL}/sendEmailMessageToExpert`, { email, message , expertemail})
      .then((response) => {
        return response.data;

        console.log('response: '+JSON.stringify(response));
        dispatch({
          type: SEND_EXPERT_EMAIL,
          payload: response.data
        });
      })
      .catch((error) => {
        console.log('error: '+error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
    }
  };
}

//= ===============================
// sendTextMessage actions
//= ===============================
export function sendTextMessage({ text_email, text_message, text_expert_email}) {
  return function (dispatch) {
    var text_expert_email = "mohit@rvtechnologies.co.in";
    if(text_email !== undefined && text_message !== undefined && text_expert_email !== undefined){
      console.log('aaaa: ');
      return axios.post(`${API_URL}/sendTextMessageToExpert`, { text_email, text_message , text_expert_email})
      .then((response) => {
        return response.data;
        console.log('response: '+JSON.stringify(response));
        dispatch({
          type: SEND_EXPERT_TEXT_MESSAGE,
          payload: response.data
        });
      })
      .catch((error) => {
        console.log('error: '+error);
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
    }
  };
}

//= ===============================
// create Expert actions
//= ===============================
export function createExpert({ firstName, lastName, email, password, userBio, expertContact, expertRates, expertCategories, expertRating, expertFocusExpertise, yearsexpertise }) {
  return function (dispatch) {
    return axios.post(`${API_URL}/createExpert`, { firstName, lastName, email, password, expertContact, userBio, expertRates, expertCategories, expertRating, expertFocusExpertise, yearsexpertise })
    .then((response) => {
      return response.data;
      console.log('response: '+JSON.stringify(response));
      dispatch({
        type: CREATE_EXPERT,
        payload: response.data
      });
    })
    .catch((error) => {
      console.log('error: '+error);
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

//= ===============================
// check Before Session Start actions
//= ===============================
export function checkBeforeSessionStart({ expertEmail, userEmail }) {
  return function (dispatch) {
    return axios.post(`${API_URL}/videosession/check-before-session-start`, { expertEmail, userEmail })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('error: '+error);
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}

//= ===============================
// recharge user session before starting session actions
//= ===============================
export function rechargeVideoSession({stripeToken, expertEmail, amount}) {
  console.log('..... stripeToken ......: '+stripeToken);
  return function (dispatch) {
    return axios.post(`${API_URL}/videosession/recharge-video-session`, {stripeToken, expertEmail, amount})
		  .then(response => {
        console.log('response: '+response);
        alert(`We are in business, ${response.status}`);
		  })
		  .catch(err => {
        console.log('err: '+err);
        alert(`Error Occured, ${err.failure_message}`+ `${err.failure_code}`);
  	});
  };
}


//= ===============================
// check authentication actions
//= ===============================
export function isLoggedIn() {
  return function (dispatch) {
    axios.get(`${API_URL}/protected`, {
      headers: { Authorization: cookie.load('token') },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}
