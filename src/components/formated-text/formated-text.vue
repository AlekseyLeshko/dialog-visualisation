<template>
	
	<div class="formated-text" v-html="markdownText">
	 {{markdownText}}
	</div>
	
</template>


<script>
	
	import {markdown} from 'markdown';
	
	/**
 	* Контент с микроразметкой. Пример разметки http://markdownlivepreview.com , https://github.com/evilstreak/markdown-js
 	*/
	export default {
		props : {
			/**
 			* Текст с микроразметкой.
 			*/
			text : {
				type : String 
			}
		},
		computed: {
			markdownText : function(){
				return markdown.toHTML( this.text );
			}
		}
	}

</script>


<style lang="less">
	@import '../../less/main.less';
	
	.formated-text {
		p {
			margin:0;
		}
	}
	
</style>