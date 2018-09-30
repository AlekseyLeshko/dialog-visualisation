<template>
	<div
		v-on:contextmenu.prevent="setContextMenu" 
		v-bind:class="{ 
			'panel-header_active' : isShowed, 
			'panel-header_static' : position == 'static',
			'panel-header_layer'  : position == 'layer' }" 
		class="panel-header"> 
	
		<div 
			class="panel-header__titlebar" 
			v-bind:title="$d('expand')"
			v-on:click="toggleHeaderPanel">
			{{title}}
			<icon
				v-bind:name="'menu'">
			</icon>
		</div>
		
		<div 
			v-show="isShowed" 
			class="panel-header__form">
			
			<slot>
				<!-- @slot Тут контент который виден после раскрытия элемента -->
			</slot>
			
		</div>
	
</div>
</template>


<script>
	
	import icon 								from '../../components/icon/icon.vue';
	
	import contextMenu__mixin 	from '../../mixins/context-menu.js';
	
	/**
 	* Панель интерфейса, умеет разворачиваться по клику 
 	*/
	export default {
		props: {
			/**
 			* Текст заголовка
 			*/
			title : {
				default : '', 
				type : String
			},
			/**
 			* Контекстное меню правой кнопки мыши 
 			*/
			menu : {
				type : Array
			},
			/**
 			* Позиционирование шапки `static` — статичное, `layer` — абcолютное, отдельным слоем.
 			*/
			position : {
				default : 'static',
				type : String
			}
			
		},
		components: {
			icon: icon
		},
		mixins: [contextMenu__mixin],
		methods: {
			toggleHeaderPanel: function() {
				this.isShowed = !this.isShowed;
			}
		},
		data: function() {
			return {
				isShowed: false
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';


	.panel-header {

		@animation-speed: 0.5s;

		width: 100%;

		max-height: @height-header;
		box-sizing: border-box;
		.f-border(bottom);
		background-color: @color-white;
		transition: all @animation-speed ease;
		color: @color-gray-font;
		overflow: visible;
		
		&_layer {
			top: 0;
			left: 0;
			z-index: 1000;
			box-shadow: 0px 0px 0px rgba(0, 0, 0, .05);
			position: absolute;
		}
		
		&_static {
			position: static;
			transition: all @animation-speed ease;
		}

		&_layer&_active {
			box-shadow: 0px 2px 20px rgba(0, 0, 0, .05);
		}
		
		&_active {
			max-height: calc(100vh - @height-header);
			transition: all @animation-speed ease;
		}

		&__titlebar {
			padding: 10px 0px 10px 10px;
			line-height: 20px;
			user-select: none;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: keep-all;
			width: calc(100% - 10px);
			.flex-block();
			justify-content: space-between;

		}

		&__form {
			padding: 0 10px 10px 10px;

			&>div:first-child {
				padding-top: 20px;
			}

		}

	}
</style>