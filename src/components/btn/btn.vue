<template>
	<div 
		v-on:click="click" 
		class="btn" 
		v-bind:class="{'btn_link' : theme == 'link'}">
		
		<button>
			<span>{{label}}</span>
		</button>
		
		<drop-effect 
			v-bind:theme="(theme == 'link') ? 'dark' : 'light'">
		</drop-effect>
		
	</div>
</template>


<script>
	/**
 	* Компонеты 
 	*/
	import dropEffect from '../../components/drop-effect/drop-effect.vue';
	
	/**
 	* Кнопка
 	*/
	export default {
		props: {
			/**
    	* Текст на кнопке
    	*/
			label: {
				default: 'Label',
				type: String
			},
			/**
    	* Тема кнопки: `link` — кнопка-ссылка
    	*/
			theme: {
				default : 'button',
				type : String
			}
		},
		components: {
			dropEffect : dropEffect
		},
		methods: {
			/**
    	* Нажатие на кнопку
    	*/
			click: function(e) {
				this.$emit('onClick', true);
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	.btn {
		color: @color-white;
		font-size: @font-size-main;
		line-height: 42px;
		background-color: @color-active;
		.border-radius(@radius-border);
		text-align: center;
		margin: 40px 0 0 0;
		box-sizing: border-box;
		width: max-content;
		overflow: hidden;
		position: relative;
		.box-shadow(0 0 0 0 rgba(0,0,0,0.2));
		.transition(all 0.2s ease);
		
		&:hover {
			.box-shadow( 0px 5px 15px rgba(0,0,0,0.2) );
			.transition(all 0.2s ease);
		}

		& button {
			background: none;
			padding: 0px 30px;
			line-height: 42px;
			color: @color-white;
			font-size: @font-size-main;
			border: none;
			box-sizing: border-box;
			.border-radius(@radius-border);
			.flex-block();
			.align-items(center);
			.flex-direction(column);

			&:focus {
				outline: none;
			}

			&::after {
				content: '';
				height: 2px;
				background: @color-white;
				width: 0%;
				transition: all .2s ease;
				display: block;
			}
			&:focus::after {
				//width: 100%;
				//transition: all .2s ease;
			}
		}

		& span {
			pointer-events: none;
		}

		&_link {
			background-color: @color-white;
			color: @color-active;
			font-weight: 300;
			

			& button {
				color: @color-active;
				font-weight: 500;

				&::after {
					background: @color-active;
				}

			}
		}
		
		&_link:hover {
			.box-shadow(none);
		}
		
		&_disabled {
			pointer-events: none;
			.filter(grayscale(100%));
			opacity: 0.5;
			.transition(all 0.2s ease); 
		}


	}
</style>