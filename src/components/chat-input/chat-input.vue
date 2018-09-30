<template>
	<div class="chat-input">
		
		<icon
			class="chat-input__add-file"
			v-bind:name="'attachment'"
			v-bind:opacity="0.5"
			v-bind:title="$d('add file')">
		</icon>
		
		<textarea 
			autofocus 
			ref="chat-input"
		  class="chat-input__input" 
			v-model="message"
			v-bind:style="'height:' + height + 'px'"
			v-on:keyup="resizeTextarea"
			v-on:keydown="handleCmdEnter($event)">
		</textarea>
		
		<div 
			class="chat-input__send" 
			v-on:click="sendNewMessage" 
			v-bind:title="$d('send') + ': ⌘ + Enter'">
			
			<icon
				v-bind:color="'color'"
				v-bind:name="'send'">
			</icon>
	
		</div>
		
	</div>
</template>


<script>
	import request 	from '../../functions/request.js';
	
	import icon 		from '../../components/icon/icon.vue';	

	/**
 	* Инпут воода сообщения в чат 
 	*/
	export default {
		props: {
			/**
 			* Глобальный объект приложения. 
 			*/
			opt: Object
		},
		components: {
			icon : icon
		},
		mounted: function() {
			this.setFocus();
			
		},
		updated: function() {
			this.setFocus();
		},
		methods: {
			/**
 			* Комбинация клавиш 
 			*/
			handleCmdEnter: function(e) {
				if ((e.metaKey || e.ctrlKey) && e.keyCode == 13) {
					this.sendNewMessage();
				}
			},
			/**
 			* Установить фокус на элемент
 			*/
			setFocus: function(){
				if (this.$refs['chat-input']) {
					this.$refs['chat-input'].focus();
				}
			},
			/**
 			* Отправить новое сообщение
 			*/
			sendNewMessage: function() {
				const __this = this;
				
				if (this.message.trim()){
				
					request.post('newMessage',{
						pass : this.opt.user.password,
						email : this.opt.user.email,
						text : this.message,
						userId: this.opt.user.id,
						chatsId: this.opt.user.activeChatId,
					}, function(e){

						__this.message = '';
						__this.$socket.emit('chat message', JSON.stringify(e));

					});
				}
				
			},
			/**
 			* Увеличить высоту компонента по количеству строк текста
 			*/
			resizeTextarea: function() {
				
				const textarea = this.$refs['chat-input'];
				let offset = textarea.offsetHeight - textarea.clientHeight;

				this.height = 0;
				this.$nextTick(function () {
					this.height = textarea.scrollHeight + offset;
				});
			}
		},
		data: function() {
			return {
				/**
 				* {String} value для поля ввода
 				*/
				message: '',
				/**
 				* {Number} высота поля ввода
 				*/
				height : 0
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';

	.chat-input {
		@icon-size: 20px;
		.flex-block();
		width: 100%;
		box-sizing: border-box;
		min-height: 50px;
		background-color: @color-white;
		.f-border(top);

		&__add-file {
			box-sizing: border-box;
			min-width: @icon-size;
			min-height: @icon-size;
			margin: 8px;
		}

		&__input {
			box-sizing: border-box;
			display: block;
			border: none;
			flex-grow: 1;
			font-size: 14px;
			padding: 15px 0;
			line-height: 20px;
			min-height: 50px;
			height: 50px;
			resize: none;
			overflow: hidden; 
			//transition: height .2s;
			
			&:focus {
				outline: none;
			}

			& * {
				max-width: 100%;
			}
		}

		&__send {
			box-sizing: border-box;
			min-width: @icon-size;
			min-height: @icon-size;
			margin: 8px;
			.flex-block();
    	align-items: center;
		}
	}
</style>