import axios from 'axios';
import cookie from 'react-cookie';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from './index';
import { AUTH_USER, AUTH_ERROR, SEND_EXPERT_EMAIL,SEND_EXPERT_TEXT_MESSAGE, CREATE_EXPERT, PROTECTED_TEST } from './types';


export function getUserReviews( { userEmail } ){
    return function (dispatch) {
        return axios.get(`${API_URL}/user/getUserReviews/${ userEmail }` )
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log('error: '+error);
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    };
}
