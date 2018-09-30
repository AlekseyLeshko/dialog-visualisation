<template>
	<div class="menu-list">
		<menu-item
			v-for="(item, index) in list"
			v-bind:isActive="active == index"
			v-on:click.native="setActive(index, item[v])"
			v-bind:key="index"
			v-bind:title="item[k]">
		</menu-item>
	</div>
	
</template>


<script>
	import menuItem from '../../components/menu-item/menu-item.vue';
	
	/**
 	*	Список меню 
 	*/
	export default {
		props: {
			/**
 			*	массив пунктов меню 
 			*/
			list : Array,
			/**
 			*	индекс активного пункта меню
 			*/
			active : {
				default: 0,
				type: Number
			},
			/**
 			*	ключ объекта с заголовком 
 			*/
			k: String,
			/**
 			*	ключ объекта с value
 			*/
			v: String
		},
		components: {
			menuItem: menuItem
		},
		methods : {
			setActive : function(index, value){
				this.$emit('onActive', {index: index, value: value});
			}	
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	.menu-list {
		width: 100%;
		box-sizing: border-box;
	}
</style>