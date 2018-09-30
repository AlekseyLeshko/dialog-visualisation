"use strict";
import $ from 'jquery';
import URL from '../functions/urls-option.js';
import auth from '../functions/auth.js';

const request = {};

request.post = function(eventType, data, success, error){
	let url = [URL.base,URL.port,URL.api].join('');
	let __auth = auth.load();
	let email = data.email || __auth.email;
	let pass = data.pass || __auth.pass;
	let req = data;
	
	req.eventType = eventType;
	req.email = email;
	req.pass = pass;
	
	$.post(url, req, function(e) {
		if (e.status){
			if (success) success(e);
		} else {
			if (error) error(e);
		}
	});
}

export default request;