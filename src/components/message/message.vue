<template>
	<div 
		v-on:contextmenu.prevent="setContextMenu"
		v-bind:class="{'message_next': !avatar }"
		class="message">
	
		<contactIconChip
			v-if="avatar"
			class="message__icon"
			v-bind:title="user.login" 
			v-bind:image="''"
			v-bind:size="'s'">
		</contactIconChip>
		
		<div class="message__content">
		
			<user-name 
				v-if="avatar"
				class="message__user-name"
				v-bind:name="user.login">
			</user-name>
			
			<div class="message__content-inner">
			
				<formated-text 
					v-if="message.text" 
					v-bind:text="message.text">	
				</formated-text>
				
				<date-time 
					class="message__time"
					v-bind:date="message.date"
					v-bind:format="'time'">
				</date-time>
			
			</div>
			
		</div>
		
	</div>
	
</template>


<script>
	/**
 	* Функции 
 	*/
	import F 									from '../../functions/functions.js';
	
	/**
 	* Компоненты 
 	*/
	import contactIconChip 		from '../../components/contact-icon-chip/contact-icon-chip.vue';
	import userName 					from '../../components/user-name/user-name.vue';
	import dateTime 					from '../../components/date-time/date-time.vue'; 
	import formatedText 			from '../../components/formated-text/formated-text.vue'; 
	
	/**
 	* Миксины 
 	*/
	import contextMenu__mixin from '../../mixins/context-menu.js';
	
	/**
 	* Сообщение в чате 
 	*/
	export default {
		props : {
			/**
 			* глобальный объект с данными для поиска пользователя
 			*/
			opt: Object,
			/**
 			* объект сообщения
 			*/
			message: Object,
			/**
 			* Отображать аватарку 
 			*/
			avatar: {
				default: true,
				type: Boolean
			}
		},
		mixins: [contextMenu__mixin],
		components : {
			contactIconChip: contactIconChip,
			userName: userName,
			dateTime: dateTime,
			formatedText: formatedText
		},
		computed : {
			user : function(){
				return F.ifExist(this.opt.userList, 'id', this.message.userId).object;
			}
		},
		data : function(){
			return {
				menu : [
					{
						name: this.$d('add user')
					},
					{
						type: 'divider'
					},
					{
						name: this.$d('pin')
					},
					{
						name: this.$d('delete')
					}, 
					{
						name: this.$d('convert to task')
					}
				]
			}
		},
		created: function(){
			
		}
	}

</script>


<style lang="less">
	@import '../../less/main.less';
	
	.message {
		box-sizing: border-box;
		.flex-block();
		padding: 5px 8px;
		width: 100%;
		
		&__content {
			flex-grow: 1;
			padding: 0 0 0 5px;
			box-sizing: border-box;
			user-select: text;
		}
		
		&__content-inner {
			.flex-block();
			flex-direction: row;
    	justify-content: space-between;
		}
		
		&__icon {
			
		}
		
		&__user-name {
			
		}
		
		&__time {
			line-height: 1.56;
			text-align: right;
			width: 40px;
		}
		
		&_next {
			
		}
		
		&_next &__content {
			margin-left: 35px;
		}
		
		
	}

</style>