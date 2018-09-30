<template>
	
	<div class="checkbox">
		<input 
			v-bind:name="setId()"
			v-bind:id="setId()"
			v-model="isChecked"
			v-on:click="check"
			class="checkbox__input" 
			type="checkbox" />
		<label 
			v-bind:for="setId()"
			class="checkbox__inner">
			<div class="checkbox__switcher"></div>
			<div v-if="label" class="checkbox__label">{{label}}</div>
		</label>
	</div>
	
</template>


<script>
	
	/**
  * Переключатель, да/нет
  */
	export default {
		props : {
			/**
    	* Название опции
    	*/
			label: String,
			/**
    	* `0` — выключено, `1` — включено
    	*/
			active: {
				default : 0,
				type: Number
			}
		},
		methods: {
			setId: function(){
				return ['checkbox',this._uid].join('_');
			},
			check: function(){
				this.$emit('onActive', this.isChecked);
			}
		},
		data: function(){
			return {
				isChecked: this.active
			}
		}
	}

</script>


<style lang="less">
	@import '../../less/main.less';
	
	.checkbox {
		display: flex;
		padding: 20px 0 0 0;
		@size-checkbox: 21px;
		@speed: 0.1s;
		
		&__input {
			font-family: Roboto, Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif;
			display: none;
		}
		
		&__input:checked + &__inner > &__switcher {
			background-color: @color-active;
			.transition(all @speed ease);
		}
		
		&__input:checked + &__inner > &__switcher::after {
			.transform(translateX(15px));
			.transition(all @speed ease);
		}
		
		&__inner {
			display:flex;
			align-items: center;
			flex-grow: 1;
		}
		
		&__switcher {
			width: 40px;
			height: calc(@size-checkbox + 4px);
			box-sizing: border-box;
			background-color: #fafafa;
			border-radius: 50px;
			.box-shadow(inset 0px 0px 1px 1px rgba(0,0,0,0.03));
			margin: 0 10px 0 0;
			.transition(all @speed ease);
			
			&::after {
				display:block;
				content:'';
				background-color: #fff;
				width: @size-checkbox;
				height: @size-checkbox;
				border-radius: 50%; 
				margin: 2px;
				box-shadow: 0px 1px 3px rgba(0,0,0,0.2);
				.transform(translateX(0));
				.transition(all @speed ease);
			}
		}
		
		&__label {
			flex-grow: 1;
			color: rgba(0,0,0,0.7);
			font-size: 14px;
		}
	}

</style>