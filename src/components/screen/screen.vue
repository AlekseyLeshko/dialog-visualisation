<template>
	<div class="screen" v-bind:class="{ 'screen_fullscreen' : fullscreen }">
	
		<logo 
				v-if="logo"
				class="screen__logo">
		</logo>
		
		<header-title
			v-bind:align="'center'"
			v-bind:title="header">
		</header-title>
			
		<slot>
				
		</slot>
			
	</div>
</template>


<script>
	/**
 	* Компоненты 
 	*/
	import logo 				from '../../components/logo/logo.vue';
	import headerTitle 	from '../../components/header-title/header-title.vue';
	
	/**
 	* Экран приложения, состояние. Используется в экране входа, регистрации в качестве контейнера.
 	*/
	export default {
		props: {
			/**
 			* Полноэкранный режим.
 			*/
			fullscreen : {
				default: true,
    		type: Boolean
			},
			/**
 			* Логотип есть/нет.
 			*/
			logo : {
				default: false,
    		type: Boolean
			},
			/**
 			* Ошибка отправки содержимого.
 			*/
			incorrect : {
				default: false,
    		type: Boolean
			},
			/**
 			* Заголовок окна.
 			*/
			header: {
				default: '',
    		type: String
			},
			/**
 			* Переменная для callback.
 			*/
			param: {
				default: '',
				type: String
			}
		},
		components : {
			logo : logo,
			headerTitle : headerTitle
		},
		methods : {
			setIncorrect: function() {
				this.$emit('onIncorrect', true);
			},
			setClose : function() {
				this.$emit('onClose', this.param);
			}
		},
		updated : function(){
			this.setClose();
			this.setIncorrect();
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	@import '../../less/animations.less';
	
	.screen {
		opacity: 1;
		
		&__logo {
			margin: 0 auto;
		}
		
		&_fullscreen {
			.fullscreen-form();
		}
		
		&_incorrect {
			.animation(form-bounce .5s 1 ease);
			
			& * {
				pointer-events: none;
			}
		}
		
	}
</style>