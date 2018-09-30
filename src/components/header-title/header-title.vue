<template>
	<div
		v-bind:class="{	'header-title_light' : w == 'light', 
										'header-title_align-center' : align == 'center'}" 
		class="header-title">
		{{title}}
	</div>
</template>


<script>

/**
 * Заголовок формы или экрана
 */
export default {
	props : {
		/**
 		* Текст заголовока
 		*/
		title : {
			default : '',
			type : String
		},
		/**
 		* Жирность: `light` — тонкий, `normal` — нормальный
 		*/
		w : {
			default : 'normal',
			type : String  
		},
		/**
 		* Выравнивание: `left` — от левого края, `center` — от центра
 		*/
		align : {
			default : 'left',
			type : String
		}
	}	
}
	
</script>


<style lang="less">
	@import '../../less/main.less';
	.header-title {
		font-size: 24px;
		font-weight: 500;
		line-height: 3;
		text-align: left;
		user-select: none;
		
		&_light {
			font-weight: 300;
		}
		
		&_align-center {
			text-align: center
		}
	}
</style>