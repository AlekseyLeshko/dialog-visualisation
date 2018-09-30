<template>
	<div 
		v-bind:style="setMargin()"
		class="divider">
	</div>
</template>


<script>

/**
 * Простой, горизонтальный разделитель 
 */
export default {
	props: {
		/**
 		* Отступ сверху и снизу
 		*/
		margin: {
			default: 8,
			type: Number
		}
	},
	methods: {
		setMargin: function(){
			return 'margin: ' + this.margin + 'px 0;';
		}
	}
}	
	
</script>


<style lang="less">
	@import '../../less/main.less';
	.divider {
		box-sizing: border-box;
		.f-border(bottom);
	}

</style>