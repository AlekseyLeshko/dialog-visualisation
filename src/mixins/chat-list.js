'use strict';

const chatList = {
	computed: {
		chatList: function () {
			let chats = this.opt.chats;
			let chatsRooms = this.opt.chatsRooms
			let chatsLength = chats.length;
			let chatsRoomsLength = chatsRooms.length;
			let searchResult = this.searchResult.toLowerCase().trim();
			let newList = [];
			for (var i = 0; i < chatsLength; i++) {
				if ( exist(chats[i].taskStatus, this.taskStatus) ) push(i, searchResult);
			}
			
			function exist(str, arr){
				let length = arr.length;
				for(var i = 0; i < length; i++){
					if (str == arr[i]){
						return true;
					}
				}
				return false;
			}
			
			function push(index, searchResult){
				
				for (var c = 0; c < chatsRoomsLength; c++) { 
					if (chats[index].id == chatsRooms[c].chatsId) {
						if (!searchResult.length) {	
							__push(newList, chats, chatsRooms, index, c);
						} else {
							if ( chats[index].name.toLowerCase().trim().indexOf( searchResult ) + 1 ){
								__push(newList, chats, chatsRooms, index, c);
							}
						}
					}
				}
				
				function __push(arr, chats, chatsRooms, indexChat, indexRoom){
					arr.push({
						createrId: 				chats[indexChat].createrId,
						creationDate: 		chats[indexChat].creationDate,
						deadlineDate: 		chats[indexChat].deadlineDate,
						endDate: 					chats[indexChat].endDate,
						icon: 						chats[indexChat].icon,
						id: 							chats[indexChat].id,
						isDeleted: 				chats[indexChat].isDeleted,
						name: 						chats[indexChat].name,
						parentId: 				chats[indexChat].parentId,
						spacesId: 				chats[indexChat].spacesId,
						taskStatus: 			chats[indexChat].taskStatus,
						updateDate: 			chats[indexChat].updateDate,
						joinDate: 				chatsRooms[indexRoom].joinDate,
						lastSeenDate: 		chatsRooms[indexRoom].lastSeenDate,
						chatRole: 				chatsRooms[indexRoom].chatRole,
						isPinned: 				chatsRooms[indexRoom].isPinned,
						chatsIndex: 			indexChat,
						chatsRoomsIndex: 	indexRoom
					});
				}
			}
			
			return newList;
		}
	}
}

export default chatList;