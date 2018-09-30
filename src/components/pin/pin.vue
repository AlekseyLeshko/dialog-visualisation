<template>
<div 
	class="pin" 
	v-bind:class="{ 'pin_pined' : pined }">
	
	<icon
		v-bind:name="'pin'"
		v-bind:color="color"
		v-bind:opacity="(pined) ? 1 : 0.2">		
	</icon>

</div>
</template>


<script>
	
	import icon from '../../components/icon/icon.vue';
	
	/**
 	* Кнопка-булавка, используется в компоненте списка чатов для запинивания элемента 
 	*/
	export default {
		props: {
			/**
 			* Состояние нажато/не нажато
 			*/
			pined : {
				default : false,
				type : Boolean 
			},
			/**
 			* Активна ли родительская вкладка. Влияет на цвет.
 			*/
			active : {
				default : false,
				type : Boolean
			}
		},
		computed: {
			color : function(){
				if (this.active) {
					return 'white';
				} else {
					return (this.pined) ? 'color' : 'black';
				}
			}
		},
		components: {
			icon: icon
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.pin {
		width: 20px;
		height: 20px;
		pointer-events: all;
	}
	
</style>