<template>
	<svg class="loading-spinner" viewBox="0 0 50 50" v-bind:class="{ 'loading-spinner_local' : type == 'local' }" >
 		<circle class="path" cx="25" cy="25" r="20"></circle>
	</svg>
</template>


<script>
	/**
 * Спиннер загрузки
 */
	export default {
		props: {
			/**
 			* Тип: `fullscreen` — по центру экрана, `local` — по центру контейнера
 			*/
			type : {
				default: 'fullscreen',
				type: String
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	@import '../../less/loading-spinner.less';
</style>