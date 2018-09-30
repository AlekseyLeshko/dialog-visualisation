<template>
	<div 
		class="text-field" 
		v-bind:class="{
			'text-field_search' : type == 'search',
			'text-field_date' : type == 'date'
		}">

		<icon 
			v-if="type == 'search'" 
			v-bind:name="'search'"
			v-bind:opacity="0.2"
			class="text-field__search-icon">
		</icon>
		
		<icon 
			v-if="type == 'date'" 
			v-bind:name="'dropDown'"
			class="text-field__list-icon">
		</icon>

		<input 
			v-bind:placeholder="placeholder"
			v-bind:value="value"
			v-bind:type="type" 
			v-bind:id="setId()"
			v-bind:name="setId()"
			v-on:input="onChange"
			v-model="text" 
			required />

		<label 
			v-bind:for="setId()"
			v-if="label">
			{{label}}
		</label>
		
		<div class="text-field__bar"></div>
		<div class="text-field__error">{{error}}</div>
	</div>
</template>


<script>

	import icon 		from '../../components/icon/icon.vue';
	
	/**
 	* Поле ввода
 	*/
	export default {
		props: {
			/**
 			* Заголовок элемента
 			*/
			label: {
				default : '',
				type: String
			},
			/**
 			* тип элемента
 			*/
			type: {
				default: 'text',
				type: String
			},
			/**
 			* Значение по умолчанию
 			*/
			value: {
				default: '',
				type: String
			},
			/**
 			* Плейсхолдер
 			*/
			placeholder: {
				default: '', 
				type: String
			},
			/**
 			* Ошибка
 			*/
			error: String
		},
		components : {
			icon: icon
		},
		methods: {
			setId: function(){
				return [this.type,this._uid].join('_');
			},
			onChange: function(e) {
				this.$emit('onValue', this.text);
			}
		},
		data: function(){
			return {
				text: ''
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
		input:-webkit-autofill,
		input:-webkit-autofill:hover, 
		input:-webkit-autofill:focus
		input:-webkit-autofill {
			background-color: transparent!important;
			-webkit-text-fill-color: @color-active;
			-webkit-box-shadow: 0 0 0px 1000px @color-white inset;
			.transition(background-color 5000s ease-in-out 0s);
		}
	
	.text-field {
		.flex-block();
		.flex-direction(column);
		padding: 40px 0 0 0;
		.box-sizing(border-box);
		position: relative;
		.transition(all 0.2s ease);

		.safari & {
			padding:0;
			margin: 40px 0 0 0; 
		}

		& input {
			font-family: Roboto, Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif;
			font-size: @font-size-main;
			padding: 10px 10px 10px 5px;
			display: block;
			border: none;
			border-bottom: 1px solid rgba(0, 0, 0, 0.2);
			.box-sizing(border-box);
		}

		& input[type='date'] {
			letter-spacing: 1px;
		}

		& input[type="password"] {

			&::-webkit-passman-key.highlighted {
				//background-color: @color-active!important;
			}

		}		
		
		& input:focus {
			outline: none;
		}

		& input~label {
			.transform(translate(0, 0) scale(1));
			.transform-origin(left center);
			padding: 10px 10px 10px 5px;
			font-size: @font-size-main;
			pointer-events: none;
			position: absolute;
			.transition(all .2s ease);
			color: @color-gray-font;
			
			.safari & {
				top:0;
			}
		}

		& input:valid:not(:focus)~label {
			color: @color-gray-font;
		}

		& input:focus~label,
		& input:valid~label {
			.transform(translate(0px, -20px) scale(0.9));
			.transition(all .2s ease);
			color: @color-active;
		}

		& input[type='date']~label {
			.transform(translate(0px, -20px) scale(0.9));
		}

		&__bar {
			.transform(translate(0, -2px));
			width: 100%;
			.flex-block();
			.align-items(center);
			.flex-direction(column);

			&::after {
				content: '';
				height: 2px;
				background-color: @color-active;
				width: 0%;
				.transition(all .2s ease);
				margin: 0 0 -2px 0;
			}
		}

		& input:focus~&__bar::after {
			width: 100%;
			.transition(all .2s ease);
		}

		&_date {

			& input {}

			& input::-webkit-datetime-edit-text {
				margin: 0 5px;
				opacity: 0.5;
			}

			& input::-webkit-inner-spin-button {
				display: none;
			}

			& input::-webkit-clear-button {
				display: none;
			}

			& input::-webkit-calendar-picker-indicator {
				color: rgba(0, 0, 0, 0);
				display: block;
				background: none;
				width: 20px;
				.transform(translateX(14px));
			}

			& input::-webkit-calendar-picker-indicator:hover {}

			& input::-webkit-calendar-picker-indicator::after {
				background: none;
				content: '';
				width: 20px;
				height: 20px;
				display: block;
			}

		}

		&_search {
			& input {
				padding-left: 25px;
			}

			& input::placeholder,
			& input::-webkit-input-placeholder {
				color: rgba(0, 0, 0, 0.2);
			}
		}

		&__search-icon {
			position: absolute;
			bottom: 10px;
		}
		
		&__list-icon {
			position: absolute;
			bottom: 10px;
			right: 0;
			pointer-events: none;
		}

		&__error {
			color: @color-error;
			font-weight: 100;
			padding: 0px 0 0 5px;
			font-size: 12px;
			margin: 0px 0 -15px 0;
			min-height: 15px;
		}
		
		&_disabled {
			.filter(grayscale(100%));
			.transition(all 0.2s ease); 
		}

	}
</style>