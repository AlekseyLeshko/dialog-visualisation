"use strict";

import changeColor from '../functions/change-color.js';

const data = {};

data.loadData = function (newData, callback) {
	
	let DATA = {
		chats:[],
		chatsRooms:[],
		spaces:[],
		tags:[],
		userList:[],
		messages:[],
		user: {
			avatar: null,
			email: null,
			firstName: null,
			id: null,
			lang: null,
			lastName: null,
			login: null,
			password: null,
			registerDate: null,
			lastSessionDate: null
		}
	}
	
	
	if (callback) callback(newData);
	return newData;
}


export default data;