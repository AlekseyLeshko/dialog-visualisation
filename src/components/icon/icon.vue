<template>
	
	<div class="icon">

		<!-- Настройки -->
		<template v-if="name == 'settings'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g class="icon__fill" v-bind:opacity="opacity">
					<path v-bind:fill="recolor()" d="M17.4,11 C17.4,10.7 17.5,10.4 17.5,10 C17.5,9.6 17.5,9.3 17.4,9 L19.5,7.3 C19.7,7.1 19.7,6.9 19.6,6.7 L17.6,3.2 C17.5,3.1 17.3,3 17,3.1 L14.5,4.1 C14,3.7 13.4,3.4 12.8,3.1 L12.4,0.5 C12.5,0.2 12.2,0 12,0 L8,0 C7.8,0 7.5,0.2 7.5,0.4 L7.1,3.1 C6.5,3.3 6,3.7 5.4,4.1 L3,3.1 C2.7,3 2.5,3.1 2.3,3.3 L0.3,6.8 C0.2,6.9 0.3,7.2 0.5,7.4 L2.6,9 C2.6,9.3 2.5,9.6 2.5,10 C2.5,10.4 2.5,10.7 2.6,11 L0.5,12.7 C0.3,12.9 0.3,13.1 0.4,13.3 L2.4,16.8 C2.5,16.9 2.7,17 3,16.9 L5.5,15.9 C6,16.3 6.6,16.6 7.2,16.9 L7.6,19.5 C7.6,19.7 7.8,19.9 8.1,19.9 L12.1,19.9 C12.3,19.9 12.6,19.7 12.6,19.5 L13,16.9 C13.6,16.6 14.2,16.3 14.7,15.9 L17.2,16.9 C17.4,17 17.7,16.9 17.8,16.7 L19.8,13.2 C19.9,13 19.9,12.7 19.7,12.6 L17.4,11 L17.4,11 Z M10,13.5 C8.1,13.5 6.5,11.9 6.5,10 C6.5,8.1 8.1,6.5 10,6.5 C11.9,6.5 13.5,8.1 13.5,10 C13.5,11.9 11.9,13.5 10,13.5 L10,13.5 Z"></path>
				</g>
			</svg>

		</template>

		<!-- Чаты -->
		<template v-if="name == 'chats'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<g class="icon__fill" v-bind:opacity="opacity">
				<path v-bind:fill="recolor()" d="M19,4 L17,4 L17,13 L4,13 L4,15 C4,15.6 4.4,16 5,16 L16,16 L20,20 L20,5 C20,4.4 19.6,4 19,4 L19,4 Z M15,10 L15,1 C15,0.4 14.6,0 14,0 L1,0 C0.4,0 0,0.4 0,1 L0,15 L4,11 L14,11 C14.6,11 15,10.6 15,10 L15,10 Z"></path>
			</g>
			</svg>

		</template>

		<!-- Календарь -->
		<template v-if="name == 'calendar'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g transform="translate(1, 0)" v-bind:opacity="opacity" class="icon__fill">
					<path v-bind:fill="recolor()" d="M14,11 L9,11 L9,16 L14,16 L14,11 L14,11 Z M13,0 L13,2 L5,2 L5,0 L3,0 L3,2 L2,2 C0.9,2 0,2.9 0,4 L0,18 C0,19.1 0.9,20 2,20 L16,20 C17.1,20 18,19.1 18,18 L18,4 C18,2.9 17.1,2 16,2 L15,2 L15,0 L13,0 L13,0 Z M16,18 L2,18 L2,7 L16,7 L16,18 L16,18 Z"></path>
				</g>
			</svg>

		</template>

		<!-- Создать новый -->
		<template v-if="name == 'new'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g transform="translate(3, 3)" v-bind:opacity="opacity" class="icon__fill">
					<polygon v-bind:fill="recolor()" points="14 8 8 8 8 14 6 14 6 8 0 8 0 6 6 6 6 0 8 0 8 6 14 6"></polygon>
				</g>
			</svg>	

		</template>

		<!-- Иконка (+) в кружке -->
		<template v-if="name == 'add'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g transform="translate(-355, -302)">
					<g class="icon__fill" v-bind:opacity="opacity" transform="translate(355, 302)">
							<path v-bind:fill="recolor()" d="M11,5 L9,5 L9,9 L5,9 L5,11 L9,11 L9,15 L11,15 L11,11 L15,11 L15,9 L11,9 L11,5 L11,5 Z M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z"></path>
					</g>
				</g>
			</svg>

		</template>

		<!-- Иконка (-) в кружке -->
		<template v-if="name == 'remove'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g class="icon__fill" v-bind:opacity="opacity">
					<path v-bind:fill="recolor()" d="M5,9 L5,11 L15,11 L15,9 L5,9 L5,9 Z M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z"></path>
				</g>
			</svg>

		</template>


		<!-- Файлы -->
		<template v-if="name == 'files'">

			<svg width="24px" height="20px" viewBox="0 0 24 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g transform="translate(0, 2)" class="icon__fill" v-bind:opacity="opacity">
					<path v-bind:fill="recolor()" d="M19.4,6 C18.7,2.6 15.7,0 12,0 C9.1,0 6.6,1.6 5.4,4 C2.3,4.4 0,6.9 0,10 C0,13.3 2.7,16 6,16 L19,16 C21.8,16 24,13.8 24,11 C24,8.4 21.9,6.2 19.4,6 L19.4,6 Z M19,14 L6,14 C3.8,14 2,12.2 2,10 C2,7.8 3.8,6 6,6 L6.7,6 C7.4,3.7 9.5,2 12,2 C15,2 17.5,4.5 17.5,7.5 L17.5,8 L19,8 C20.7,8 22,9.3 22,11 C22,12.7 20.7,14 19,14 L19,14 Z"></path>
				</g>
			</svg>

		</template>

		<!-- Иконка приложить файл -->
		<template v-if="name == 'attachment'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g class="icon__fill" v-bind:opacity="opacity">
					<path v-bind:fill="recolor()" d="M13.5001404,14.4375 C13.5001404,16.3712807 11.7100351,17.9376228 9.5,17.9376228 C7.28996491,17.9376228 5.49985965,16.3712807 5.49985965,14.4375 L5.49985965,3.50012281 C5.49985965,2.2924386 6.61992982,1.31237719 8.00014035,1.31237719 C9.37996491,1.31237719 10.5000351,2.2924386 10.5000351,3.50012281 L10.5000351,12.6874386 C10.5000351,13.1686886 10.0550175,13.5624693 9.5,13.5624693 C8.94498246,13.5624693 8.49996491,13.1686886 8.49996491,12.6874386 L8.49996491,4.37515351 L7.00010526,4.37515351 L7.00010526,12.6874386 C7.00010526,13.8951228 8.11978947,14.8748465 9.5,14.8748465 C10.8802105,14.8748465 11.9998947,13.8951228 11.9998947,12.6874386 L11.9998947,3.50012281 C11.9998947,1.56634211 10.2101754,0 8.00014035,0 C5.79010526,0 4,1.56634211 4,3.50012281 L4,14.4375 C4,17.0973772 6.46515789,19.25 9.5,19.25 C12.5348421,19.25 15,17.0973772 15,14.4375 L15,4.37515351 L13.5001404,4.37515351 L13.5001404,14.4375 Z"></path>
				</g>
			</svg>

		</template>

		<!-- Отправить -->
		<template v-if="name == 'send'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g class="icon__fill" v-bind:opacity="opacity" transform="translate(0, 1)">
					<polygon v-bind:fill="recolor()" points="0 18 20 9 0 0 0 7 14.2857143 9 0 11"></polygon>
				</g>
			</svg>

		</template>

		<!-- Меню -->
		<template v-if="name == 'menu'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g class="icon__fill" v-bind:opacity="opacity" transform="translate(8, 2)">
					<path v-bind:fill="recolor()" d="M2,4 C3.1,4 4,3.1 4,2 C4,0.9 3.1,0 2,0 C0.9,0 0,0.9 0,2 C0,3.1 0.9,4 2,4 L2,4 Z M2,6 C0.9,6 0,6.9 0,8 C0,9.1 0.9,10 2,10 C3.1,10 4,9.1 4,8 C4,6.9 3.1,6 2,6 L2,6 Z M2,12 C0.9,12 0,12.9 0,14 C0,15.1 0.9,16 2,16 C3.1,16 4,15.1 4,14 C4,12.9 3.1,12 2,12 L2,12 Z"></path>
				</g>
			</svg>

		</template>

		<!-- Развернуть список -->
		<template v-if="name == 'dropDown'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g class="icon__fill" v-bind:opacity="opacity" transform="translate(5, 7.5)">
					<polygon v-bind:fill="recolor()" points="0 0 5 5 10 0"></polygon>
				</g>
			</svg>

		</template>

		<!-- Поиск -->
		<template v-if="name == 'search'">

			<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g class="icon__stroke" v-bind:opacity="opacity">
					<path v-bind:stroke="recolor()" d="M17,17 L11.2121429,11.2121429 C10.1567857,12.2664286 8.88392857,12.7935714 7.39357143,12.7935714 C5.90642857,12.7935714 4.63892857,12.2664286 3.58892857,11.2121429 C2.53464286,10.1567857 2.00428571,8.88607143 2,7.4 C2,5.90964286 2.52714286,4.63678571 3.5825,3.5825 C4.63678571,2.52714286 5.90642857,2 7.39357143,2 C8.88392857,2.00428571 10.1567857,2.53464286 11.2121429,3.58892857 C12.2610714,4.64321429 12.7860714,5.91178571 12.7860714,7.39357143 C12.7871429,7.8575 12.7378571,8.30107143 12.6392857,8.72321429"></path>
				</g>
			</svg>

		</template>
		
		<!-- Булавка -->
		<template v-if="name == 'pin'">
		
			<svg 
				width="20px" 
				height="20px" 
				viewBox="0 0 20 20" 
				version="1.1" 
				xmlns="http://www.w3.org/2000/svg" 
				xmlns:xlink="http://www.w3.org/1999/xlink">

				<g class="icon__fill" v-bind:opacity="opacity" transform="translate(9.545942, 10.545942) rotate(45.000000) translate(-9.545942, -10.545942) translate(5.045942, 1.545942)">
					<polygon v-bind:fill="recolor()" points="7.3570226 1.47140452 8.09272486 1.47140452 8.09272486 0 0.73570226 0 0.73570226 1.47140452 1.47140452 1.47140452 1.47140452 7.3570226 0 8.82842712 0 10.2998316 3.82565175 10.2998316 3.79623034 17.7950338 4.97335396 17.7950338 5.00277537 10.2998316 8.82842712 10.2998316 8.82842712 8.82842712 7.3570226 7.3570226"></polygon>
				</g>

			</svg>
	
		</template>
	
	</div>

</template>


<script>
	
	import cssVars from '../../functions/css-vars.js';
	
	/**
 	* Иконка, коллекция svg изображений
 	*/
	export default {
		props:{
			/**
 			* Название иконки: `settings`, `chats`, `calendar`, `new`, `add`, `remove`, `files`, `attachment`, `send`, `menu`, `dropDown`, `search`, `pin`
 			*/
			name : {
				type: String
			},
			/**
 			* Цвет иконки: `black`, `white`, `color` or HEX color
 			*/
			color : {
				type: String
			},
			/**
 			* Прозрачность иконки
 			*/
			opacity : {
				default: 1,
				type: Number
			}
		},
		created: function(){
			this.colors = cssVars(':root');
		},
		methods: {
			recolor: function(){
				
				if (this.color){
					let c;	
					switch (this.color) {
						
						case 'black':
							c = this.colors['--color-black'];
							break;
								
						case 'white':
							c = this.colors['--color-white'];
							break;

						case 'color':
							c = this.colors['--color-active'];
							break;

						default:
							c = this.color;
							break;
					}
					
					return c;
				}
				
			}
		},
		date: function(){
			return {
				colors : {}
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.icon {
		.flex-block();
		align-items: center;
		
		&__fill{
			fill: #000;
			stroke: none;
			fill-rule: evenodd;
			transition: all .2s;
		}
		
		&__stroke {
			fill: none;
			stroke: #000;	
			stroke-width: 1.7;
			stroke-linecap: round;
			stroke-linejoin: round;
			transition: all .2s;
		}
	}
	
</style>