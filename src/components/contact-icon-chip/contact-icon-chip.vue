<template>

	<div 
		v-bind:style="stylize()"
		class="contact-icon-chip"
		v-bind:class="{
			'contact-icon-chip_task' : type == 'task',
			'contact-icon-chip_chat' : type == 'chat',
			'contact-icon-chip_s' 	 : size == 's',
			'contact-icon-chip_m' 	 : size == 'm'
		}" >
			{{ (title) ? title[0].toUpperCase() : '' }}
	</div>
	
</template>


<script>

	import changeColor from '../../functions/change-color.js';

	/**
 	* Аватарка чата или таска. Для чатов — круглая, для тасков — квадратная.
	* Цыет аватарки зависит от длины заголовка `title`
 	*/
	export default {
		props: {
			/**
 			* Заголовок чата
 			*/
			title: {
				default : '',
				type : String
			},
			/**
 			* url картинки
 			*/
			image: {
				default: '',
				type: String
			},
			/**
 			* Тип: `chat` — круглая для чатов, `task` — квадратная для тасков
 			*/
			type: {
				default: 'chat',
				type: String
			},
			/**
 			* Размер `m` — размер в ленте чатов и тасков, `s` — в сообщениях и списке пользователей
 			*/
			size: {
				default: 'm',
				type: String
			}
			
		},
		methods: {
			stylize : function(){
				let cssRule = `background-color: ${changeColor(this.title)}`;
				if (this.image && this.image.length) {
					cssRule = [cssRule,`background-image: url( ${this.image} )`,`color: transparent`].join(';');
				}
				return cssRule;
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.contact-icon-chip {
		@size-m: 50px;
		@size-s: 35px;
		
		background-color: #eaeaea;
		overflow: hidden;
		background-size: cover;
		text-align: center;
		color: rgba(red(@color-white),green(@color-white),blue(@color-white), 0.7);
		box-shadow: inset 0px 0px 0px 1px rgba(0,0,0,0.02);
		user-select: none;
		transition: all .5s;

		&_chat {
			.border-radius(50%);
			
		}
		
		&_task {
			.border-radius(5px);
			
		}
		
		&_m {
			height: @size-m;
			width: @size-m;
			min-height: @size-m;
			min-width: @size-m;
			max-height: @size-m;
			max-width: @size-m;
			font-size: 24px;
			line-height: 52px;
		}
		
		&_s {
			height: @size-s;
			width: @size-s;
			min-height: @size-s;
			min-width: @size-s;
			max-height: @size-s;
			max-width: @size-s;
			font-size: 18px;
			line-height: 38px;
		}
	}
</style>