<template>
	<div class="app">
		
		<tree 
					ref="tree"
					v-bind:data="tree" 
					v-bind:type="treeType" 
					v-bind:node-text="'name'" 
					v-bind:radius="6"
					v-bind:duration="300"
					v-bind:zoomable="true"
					v-bind:fontSize="13"
					v-on:clicked="currentNode"
					v-bind:layoutType="'euclidean'"> 
		</tree>
		
		<div class="tools">
			<checkbox 
				v-bind:label="'Cluster view'"
				v-on:onActive="changeType"></checkbox>
		</div>
		
	</div>
</template>

<script>
	/**
 	* Библиотеки 
 	*/
	import platform from 'platform';

	import tree from '../src/components/tree/Tree.vue';
	import checkbox from '../src/components/checkbox/checkbox.vue';

	/**
 	* Контейнер приложения
 	*/
	export default {
		name: 'app',
		components: {
			tree,
			checkbox
		},
		data: function() {
			return {
				tree: window.ddd,
				treeType: 'tree' 
			}
		},
		methods: {
			currentNode : function(n){
				console.log(n)
			},
			changeType : function(e){
				if (e == true){
					this.treeType = 'tree';
				} else {
					this.treeType = 'cluster';
				}
			}
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
	
	.viewport {
		height: 100vh;
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
	
	.tools {
		position: fixed;
		top:0;
		right: 0;
		margin: 0 20px;
	}
</style>