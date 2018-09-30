<template>
<div 
 	class="user-item">

 	<contact-icon-chip 
		v-bind:title="user.email" 
		v-bind:size="'s'"
		v-bind:image="user.avatar">
	</contact-icon-chip>

	<div class="user-item__content">
		<user-name v-bind:name="user.email"></user-name>
	</div>
		
	<icon 
		v-if="removeble"
		v-bind:name="'remove'"
		class="user-item__remove" 
		v-on:click.native="onRemove">
	</icon>

</div>
</template>


<script>
	/**
 	* Компоненты 
 	*/
	import contactIconChip 	from '../../components/contact-icon-chip/contact-icon-chip.vue';
	import userName 				from '../../components/user-name/user-name.vue';
	import icon			 				from '../../components/icon/icon.vue';
	
	
	
/**
 	* Пользователь с аватаркой.  
	* 
 	*/
	export default {
		props: {
			/**
 			* Объект с пользователем 
 			*/
			user: Object,
			/**
 			* Удаляемый  
 			*/
			removeble : {
				default: true,
				type: Boolean
			},
			/**
 			* Индекс элемента
 			*/
			index: {
				default: 0,
				type: Number
			}
		},
		components : {
			contactIconChip : contactIconChip,
			userName: userName,
			icon : icon
		},
		methods: {
			onRemove: function() {
				this.$emit('onRemove', this.index);
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.user-item {
		
		@icon-size: 20px;
		
		.flex-block();
		.justify-content(space-between);
		box-sizing: border-box;
		padding: 10px 0 0 0;

		&__content {
			flex-grow: 1;
			box-sizing: border-box;
			padding: 10px 0px 0 10px;
		}

		&__remove {
			opacity: .1;
			margin: 10px 0 0 0;
			.transition( all .2s );
			pointer-events: all;
		}

		&:hover &__remove {
			opacity: .7;
			.transition( all .2s );
		}


	}
</style>