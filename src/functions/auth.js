"use strict";

const auth = {};

auth.load = function() {	
	const __auth__ = {
		email : localStorage.getItem('email') || null,
		pass : localStorage.getItem('pass') || null,
		authValid : localStorage.getItem('authValid') || null
	};
	
	return __auth__;
}

auth.setup = function(email, pass) {
	localStorage.setItem('email', email);
	localStorage.setItem('pass', pass);
	localStorage.setItem('authValid', true);
}

auth.clear = function(){
	localStorage.removeItem('email');
	localStorage.removeItem('pass');
	localStorage.removeItem('authValid');
}

export default auth;

