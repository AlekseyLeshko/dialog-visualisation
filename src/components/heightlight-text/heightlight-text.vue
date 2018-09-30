<template>
	<div 
		class="heightlight-text"
		v-html="heighlight()">
		{{ heighlight() }}
	</div>

</template>


<script>

	/**
 	*  Подсвечивает подстроку в строке. Используется для подсветки результатов поиска.
 	*/
	export default {
		props : {
			/**
 			* Строка текста
 			*/
			text : {
				default: '',
				type: String
			},
			/**
 			* Подстрока текста для поиска
 			*/
			heightlightText: {
				default: '',
				type: String
			},
			/**
 			* css класс для элемента подстроки
 			*/
			heightlightClassName: {
				type: String
			}
		},
		methods : {
			heighlight : function(){ 
				let className = this.heightlightClassName || 'heightlight-text__heightlight';
				let replace = new RegExp(this.heightlightText, 'gi');
				
				return this.text.replace(replace, `<span class="${className}">$&</span>`)
			}
		}
	}
</script>	


<style lang="less">
	@import '../../less/main.less';
	
	.heightlight-text {
		
		&__heightlight {
			font-weight: 800;
			background-color: #fff471;
		}
	}
</style>