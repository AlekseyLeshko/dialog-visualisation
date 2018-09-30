<template>
	<div class="user-name">
		{{name}}
	</div>
</template>


<script>
	/**
 	* Имя пользователя 
 	*/
	export default {
		props : {
			/**
 			* Имя пользователя 
 			*/
			name : {
				default: 'Username', 
				type: String
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.user-name {
		color: @color-active;
		font-size: @font-size-main;
		user-select: none;
		
		&__on-active {
			color: @color-white;
		}
	}
	
</style>