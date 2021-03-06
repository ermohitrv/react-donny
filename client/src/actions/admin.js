import axios from 'axios';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FORGOT_PASSWORD_REQUEST, RESET_PASSWORD_REQUEST, PROTECTED_TEST } from './types';

import { API_URL, CLIENT_ROOT_URL, errorHandler } from './index';


function handleResponse(response){

	if(response.ok){
		console.log("OK RESPONSE IN Teacher ACTION")
		// console.log("$$$$$$$ $$$$$$$$$$$$ $$$$$$$$$$$$ $$$$$$$$$$$$$$ "+response)
		return response.json();
	}
	else{
		console.log("RESPONSE NOT OK in TEACHER ACTIOn")
		// console.log(response)
		let error = new Error(response.statusText);
		error.response = response;
		throw error
	}

}
export function getUsersList(){
	// console.log("Teacher Posting DATA  to student profile   ")
	return dispatch =>{
		return fetch("http://localhost:3000/api/getUsersList",{
			method: 'get',
			headers:{
				"Content-Type": "application/json",
// 				 "headers": { Authorization: cookie.load('token') },
			}
		}).then(function(res){
			// console.log("%%%%%%%%%%%%")
			var x = res.json()
//  		console.log(x)
			return x

		}).then(function(res){/*console.log(res);*/ return res})
		//}).then(handleResponse).then(data=>dispatch(getschool(data)));;
	}
}
export function BanMe(data){
	// console.log("HIIIII" +data)
	return dispatch =>{
		return fetch("http://localhost:3000/api/BanHim", {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
    body: 'id='+data
}).then(function(res){
			// console.log("%%%%%%%%%%%%")
			var x = res.json()
			// console.log(x)
			return x

		}).then(function(res){/*console.log(res);*/ return res})
		//}).then(handleResponse).then(data=>dispatch(getschool(data)));;
	}

}
export function UnBanMe(data){
	console.log("HIIIII" +data)
	return dispatch =>{
		return fetch("http://localhost:3000/api/UnBanHim", {
	    method: 'POST',
	    headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
	    body: 'id='+data
		}).then(function(res){
				console.log("%%%%%%%%%%%%")
				var x = res.json()
				console.log(x)
				return x

			}).then(function(res){console.log(res); return res})
		//}).then(handleResponse).then(data=>dispatch(getschool(data)));;
	}

}
export function getTheUserInformation(data){
	// console.log(data)
	// console.log("&&&&&")
	return dispatch =>{
		return fetch("http://localhost:3000/api/getuserInfo/"+data.id, {
	    method: 'POST',
	    headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
	    body: 'id='+data.id
		}).then(function(res){
				// console.log("%%%%%%%%%%%%")
				var x = res.json()
				// console.log(x)
				return x

			}).then(function(res){console.log(res); return res})
		//}).then(handleResponse).then(data=>dispatch(getschool(data)));;
	}
}
export function AdminUpdateExpert(data){
	// console.log("^^^^^^^^^^^^^^^^^^^^^^^^")
	// console.log(data)
	// console.log("&&&&&")
	return dispatch =>{
		return fetch("http://localhost:3000/api/UpdateUserInfo", {
	    method: 'POST',
	    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
	    // body: 'id='+data.id
	    body:JSON.stringify(data)
		}).then(function(res){
				// console.log("%%%%%%%%%%%%")
				var x = res.json()
				// console.log(x)
				return x

			}).then(function(res){console.log(res); return res})
		//}).then(handleResponse).then(data=>dispatch(getschool(data)));;
	}
}
// GetActiveSessions
export function GetActiveSessions(data){
	console.log("^^^^^^^^^^^^^^^^^^^^^^^^")
	// console.log(data)
	// console.log("&&&&&")
	return dispatch =>{
		return fetch("http://localhost:3000/api/GetActiveSessions", {
	    method: 'POST',
	    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
	    // body: 'id='+data.id
	    // body:JSON.stringify(data)
		}).then(function(res){
				// console.log("%%%%%%%%%%%%")
				var x = res.json()
				// console.log(x)
				return x

			}).then(function(res){/*console.log("@@@");console.log(res); */return res})
		//}).then(handleResponse).then(data=>dispatch(getschool(data)));;
	}
}

// export function getUsersList() {
//   console.log("getUsersList")
//   console.log({API_URL})
//   return dispatch=> {
//     axios.get(`${API_URL}/getUsersList`, {
//       headers: { Authorization: cookie.load('token') },
//     })
//     .then((response) => {
//     	console.log("%%%%%%666%%%%%%%%")
//     	console.log(response.data)
//     	return response.data
//     	// dispatch({data:response.data})
//     })
//     .catch((error) => {
//     	console.log("HEREEEE iN Error")
//     	console.log(error)
//       errorHandler(dispatch, error.response, AUTH_ERROR);
//     });

//   };
// }












// export function getUsersList() {
//   return axios.get(`${API_URL}/getUsersList`)
//   .then((response) => {
//   	//console.log(JSON.stringify(response));
//     return response.data;
//   })
//   .catch((error) => {
//     console.log('error: '+error);
//     //errorHandler(dispatch, error.response, AUTH_ERROR);
//   });

//   return function (dispatch) {
//     axios.get(`${API_URL}/getUsersList`, {
//       headers: { Authorization: cookie.load('token') },
//     })
//     .then((response) => {
//     	console.log("%%%%%%666%%%%%%%%")
//     	console.log(response.data)
//     	return response.data
//     	// dispatch({data:response.data})
//     })
//     .catch((error) => {
//     	console.log("HEREEEE iN Error")
//     	console.log(error)
//       errorHandler(dispatch, error.response, AUTH_ERROR);
//     });

//   };
// }