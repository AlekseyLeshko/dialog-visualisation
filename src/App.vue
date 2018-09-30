<template>
	<div class="app">
		
	
	</div>
</template>

<script>
	/**
 	* Библиотеки 
 	*/
	import platform from 'platform';

	

	/**
 	* Контейнер приложения
 	*/
	export default {
		name: 'app',
		components: {

		},
		data: function() {
			return {}
		},
		methods: {
			
		},
		created: function() {
			window.APP = this;
		}
	}
</script>

<style lang="less">
	@import '~normalize.css/normalize.css';
	@import './less/main.less';
	

	body {
		margin: 0;
		padding: 0;
		.user-select(none);
		overflow: hidden;
		font-family: Roboto, Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: @font-size-main;
		color: @color-black;
		.f-font-smooth();
		cursor: default;
		scroll-behavior: smooth;
	}

	a {
		color: @color-active;
		text-decoration: none;

		&:focus {
			outline: none;
		}
	}
	
	:root { 
		--color-background: @color-background;
		--color-white: @color-white;
		--color-black: @color-black;
		--color-border: @color-border;
		--color-gray-font: @color-gray-font;
		--color-active: @color-active;
		--color-hover: @color-hover;
		--color-border-active: @color-border-active;
		--color-border-hover: @color-border-hover;
		--color-error: @color-error;
		--logo-color-main: @color-active;
		--logo-color-main-tint: darken(@color-active, 20%);
		--logo-color-font: @color-black;
		--logo-color-second: @color-white;
		--logo-color-second-tint: darken(@color-white, 20%);
	}

	#app,
	.app {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
	}

	#loading {
		width: 100%;
		height: 100%;
		background-color: @color-white;
	}

	.app-states {
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
		top: 0;
		left: 0;
		box-sizing: border-box;
		background-color: @color-background;
		.transition(all .3s ease);

		&__screen {
			width: 100%;
			height: 100%;
			background-color: @color-white;
			.animation(app-states_show .3s ease 1);
			.vertical-scroll();
		}

		&__main {
			width: 100%;
			height: 100%;
		}
	}
</style>