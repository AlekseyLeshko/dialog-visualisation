"use strict";

const lang = {};

lang.load = function(){
	return localStorage.getItem('lang') || 'eng';
}

lang.setup = function(l){
	l = l || 'eng';
	localStorage.setItem('lang', l);
	return l;
}

lang.setLang = function(l){
	l = l.toLowerCase() || 'eng';
	localStorage.setItem('lang', l);
	APP.$set(APP.app, 'lang', l);
	return l;
}

lang.clear = function(){
	localStorage.removeItem('lang');
}

window.lang = lang;

export default lang;