<template>
	<div class="select-list">
	
		<button 
			class="select-list__placeholder" 
			v-on:click="toggleShow">
			{{getActive}}
		</button>
		
		<div class="select-list__bar"></div>
		
		<div 
			class="select-list__back"
			v-bind:class="{ 'select-list__back_active' : isActive }" 
			v-on:click="toggleShow">
		</div>
		
		<div
			v-bind:class="{ 'select-list__list_active' : isActive }"  
			v-bind:style="findZindex()"
			class="select-list__list">
			<div 
				v-for="(option, index) in options" 
				class="select-list__option">
				
				<input 
					type="radio" 
					v-bind:name="setId()" 
					v-bind:value="option[k]" 
					v-bind:id="setId() + '_' + index"
					v-bind:data-key="index">
					
				<menu-item
					v-bind:type="'label'"
					v-bind:title="option[v]"
					v-bind:data-key="index" 
					v-on:click.native="select" 
					v-bind:forId="setId() + '_' + index">
				</menu-item>
				
			</div>
			
		</div>
		
		<icon
			class="select-list__icon"
			v-bind:name="'dropDown'">
		</icon>
		
	</div>
</template>


<script>

	/**
 	* Функции 
 	*/
	import findZindex 	from '../../functions/find-zindex.js';
	
	/**
 	* Компоненты 
	*/
	import menuItem 		from '../../components/menu-item/menu-item.vue';
	import icon 		from '../../components/icon/icon.vue';
	
	/**
 	* Выпадающий список 
 	*/
	export default {
		props: {
			/**
 			* Массив с опциями для меню
 			*/
			options: Array,
			/**
 			* Индекс активной опции
 			*/
			active: Number,
			/**
 			* ключ value  
 			*/
			k: String,
			/**
 			* ключ заголовка
 			*/
			v: String 
		},
		components: {
			menuItem: menuItem,
			icon: icon
		},
		updated: function(){
			
		},
		created: function() {
			
		},
		methods: {
			setId: function(){
				return  'select-list_' + this._uid;
			},
			toggleShow: function() {
				this.isActive = !this.isActive;
			},
			findZindex: function() {
				return ['z-index:', findZindex('div')].join('');
			},
			select: function(e) {
				
				let index = Number( e.target.attributes['data-key'].value );
				let selected = this.options[index];
				
				this.toggleShow();

				this.$emit('onActive', index);
			}
		},
		data: function(){
			return {
				isActive: false
			}
		},
		computed: {
			getActive: function() {
				return this.options[this.active][this.v];
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.select-list {
		.flex-block();
		.flex-direction(column);
		padding: 40px 0 0 0;
		box-sizing: border-box;
		position: relative;

		&__placeholder {
			border: none;
			.border-radius(0);
			color: @color-black;
			border-bottom: 1px solid rgba(0, 0, 0, 0.2);
			background-color: transparent;
			box-sizing: border-box;
			font-size: @font-size-main;
			padding: 10px 10px 10px 5px;
			display: block;
			text-align: left;

			&:focus {
				outline: none;
			}

		}
		
		&__icon {
				position: absolute;
				bottom: 0;
				right: 0;
				.transform(translateY(-8px));
		}

		&__list {
			opacity: 0;
			pointer-events: none;
			transition: all .1s ease;
			background-color: @color-white;
			position: absolute;
			box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
			.transform-origin(top center);
			.transform(translateY(-20px));
			width: calc( 100% + 20px);
			margin: 0 -10px;
			padding: 10px 0;

			&_active {
				opacity: 1;
				box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
				pointer-events: all;
				.transition( all .1s ease );
				.transform(translateY(-10px));
			}
		}

		&__option {

			& input[type="radio"] {
				display: none;

			}

		}

		&__back {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			pointer-events: none;
			box-sizing: border-box;

			&_active {
				pointer-events: all;
			}
		}

		&__bar {
			.transform(translate(0, -2px));
			width: 100%;
			.flex-block();
			.align-items(center);
			.flex-direction(column);
			margin: 0 0 -2px 0;

			&::after {
				content: '';
				height: 2px;
				background: @color-active;
				width: 0%;
				.transition( all .2s ease );
			}
		}

		&__placeholder:focus~&__bar::after {
			width: 100%;
			.transition( all .2s ease );
		}
	}
</style>