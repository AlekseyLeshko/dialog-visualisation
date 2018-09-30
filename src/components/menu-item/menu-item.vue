<template>
		<div
			v-bind:data-key="dataKey"
			v-bind:class="{ 'menu-item_active' : isActive }" 
			class="menu-item">
		
			<template v-if="type == 'div'">
				{{title}}
			</template>
			
			<label 
				v-bind:data-key="dataKey"
				v-bind:for="forId"
				v-if="type == 'label'">
				{{title}}
			</label>
			
			<drop-effect 
				v-bind:theme="'dark'">
			</drop-effect>
			
		</div>
</template>


<script>
	
	import dropEffect from '../../components/drop-effect/drop-effect.vue';
	/**
 	*	Опция для списка 
 	*/
	export default {
		props: {
			/**
 			*	Заголовок, название опции 
 			*/
			title : {
				default : '',
				type: String
			},
			/**
 			*	DOM элемент, `div` — по-умолчанию, `label`
 			*/
			type : {
				default: 'div', 
				type: String
			},
			/**
 			*	Жирный шрифт, если опция активна
 			*/
			isActive : {
				default: false,
				type: Boolean
			},
			/**
 			*	Если `type : 'label'` — указывается id связанного элемента 
 			*/
			forId : {
				default: '',
				type: String
			},
			/**
 			*	`key` если в цикле
 			*/
			dataKey : {
				default : 0,
				type : Number
			}
		},
		components: {
			dropEffect : dropEffect 
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.menu-item {
		font-size: @font-size-main;
		box-sizing: border-box;
		padding: 10px 10px 10px 15px;
		font-weight: 500;
		color: @color-black;
		.transition(all .2s ease);
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		user-select: none;
		
		&:hover {
			color: @color-active;
			background-color: lighten(@color-active, 40%);
			.transition(all .2s ease);
		}
		
		&_active {
			font-weight: 600;
		}
	}
</style>