```js
<chat-list-item 
	v-bind:opt="{
		user : {
			id : 1,
			activeChatId : 0
		},
		chats:[{
	
		}],
		chatsRooms:[{
			isPinned : false
		}],
		spaces:[{
	
		}],
		tags:[{
	
		}],
		userList:[{
			id : 1,
			email : 'test@test.com'				 
		}],
		messages:[{
			id : 1,
			chatsId : 1,
			date : '2018-08-05 00:34:00',
			text : 'Последнее сообщение в чате',
			userId : 1				 
		}]
	}"
	v-bind:chat="{
		id : 1,
		chatsRoomsIndex : 0,
		creationDate : '2018-08-05 00:34:00',
		isPinned : false,
		name : 'Заголовок чата'
	}"
	v-bind:type="'chat'">
</chat-list-item>	
```