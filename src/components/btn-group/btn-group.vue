<template>
	<div 
		v-bind:class="{
			'btn-group_left'   : align == 'left', 
			'btn-group_right'  : align == 'right',
			'btn-group_center' : align == 'center'}" 
		class="btn-group">
		
		<slot>
			<!-- @slot Слот для размещения кнопок -->
		</slot>
		
	</div>
</template>


<script>
	/**
 	* Контейнер для кнопок, задаёт выравнивание для элементов 
 	*/
	export default {
		props: {
			/**
    	* Выравнивание элементов: `left, center, right`
    	*/
			align : {
				default: 'left',
				type: String
			}
		}
	}
	
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.btn-group {
		.flex-block();

		& .btn:first-child {
			margin-right: 20px;
		}
		
		& .btn:only-child {
			margin-right: 0;
		}
		
		&_left {
			.justify-content(flex-start);
		}
		
		&_right {
			.justify-content(flex-end);
		}
		
		&_center {
			.justify-content(center);
		}
		
		&_shade {
			position: sticky;
			bottom: 0px;
			padding: 0 0 20px 0;
			background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 1) 100%);
		}
	}
</style>