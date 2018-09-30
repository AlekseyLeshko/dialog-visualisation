<template>
	<div
		v-on:mouseout="hideMenu"
		v-bind:style="position()"
		v-if="isShowed"
		class="context-menu">
		
		<template 
			v-for="(item,index) in menu">
		
			
				<menu-item
					v-on:click.native="item.action()"
					v-if="item.name && !item.hide"
					v-on:contextmenu.native.prevent="hideNative"
					v-bind:title="item.name">
				</menu-item>

				<divider
					v-bind:margin="0"
					v-on:contextmenu.native.prevent="hideNative" 
					v-if="item.type && item.type == 'divider'">		
				</divider>

		
		</template>
		
	</div>
	
</template>


<script>
	import findZindex 	from '../../functions/find-zindex.js';
	
	import divider 			from '../../components/divider/divider.vue';
	import menuItem 		from '../../components/menu-item/menu-item.vue';
	
	/**
 	* Контекстное меню. В приложении компонент-контейнер размещается один раз. Используется путем отправки в него координат, состояния и массива из пунктов меню. 
 	*/
	export default {
		props: {
			/**
 			* Координа по-горизонтали
 			*/
			x: Number,
			/**
 			* Координа по-вертикали
 			*/
			y: Number,
			/**
 			* Состояние открыто/закрыто
 			*/
			isShowed: Boolean,
			/**
 			* Массив с пунктами меню
 			*/
			menu: Array,
			/**
 			* Прятать нативное меню браузера во всём приложении
 			*/
			native: {
				default : false,
				type: Boolean
			}
		},
		components:{
			divider : divider,
			menuItem : menuItem
		},
		data: function(){
			return {
				style : this.position()
			}
		},
		methods: {
			position: function(){
				let offset = 20;
				let width;
				let height;
				let winWidth = window.innerWidth;
				let winHeight = window.innerHeight;
				let x = ['left:',this.x - offset,'px'].join('');
				let y = ['top:',this.y - offset,'px'].join('');
				let zIndex = ['z-index:',findZindex('div')].join('');
				
				this.$nextTick(function () {
							
					if (this.$el.nodeType !== 8) {
						width = this.$el.offsetWidth;
						height = this.$el.offsetHeight

						x = (this.x + width < winWidth) 	? ['left:',this.x - offset,'px'].join('') : 'right:0';
						y = (this.y + height < winHeight) ? ['top:',this.y - offset,'px'].join('')  : 'bottom:0';
						
						this.$el.setAttribute('style', [x,y,zIndex].join(';'));
					}
					
				});
				return [y,x,zIndex].join(';');
			},
			hideMenu: function(event){
				
				let target = event.toElement || event.relatedTarget;
				
				if ( target &&
						 !target.classList.contains('menu-item') && 
						 !target.classList.contains('divider') && 
						 !target.classList.contains('context-menu') ) {
					APP.$data.app.context.isShowed = false;
				}
			},
			hideNative: function(e){
				e.preventDefault();
				return false;
			}
		},
		created: function(){
			if (this.native) window.addEventListener('contextmenu', this.hideNative, false);
		},
		beforeDestroy: function(){
			if (this.native) window.removeEventListener('contextmenu', this.hideNative, false);
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	@import '../../less/animations.less';
	
	.context-menu {
		@menu-width: 200px;
		position: fixed;
		background: @color-white;
		box-sizing: border-box;
		box-shadow: 0px 5px 20px rgba(0,0,0,0.2);
		min-width: @menu-width;
		overflow: hidden;
		border-radius: 3px;
		transform:scale(1);
		.animation(show-menu 0.1s 1 ease); 
	}
</style>