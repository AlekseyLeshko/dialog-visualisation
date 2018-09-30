<template>
	<div 
		v-on:click="toggleState" 
		class="toolbar-tool"
		v-bind:class="{ 'toolbar-tool_active' : currentState && currentState === nextState }"
		v-bind:style="(icon) ? 'background-image: url(' + icon + ');' : ''"
		v-bind:title="title">
		
		<slot>
		</slot>
		
		<drop-effect 
			v-bind:theme="'dark'">
		</drop-effect>
		
	</div>
</template>


<script>
	
	/**
 	* Компоненты 
 	*/
	import dropEffect from '../../components/drop-effect/drop-effect.vue';

	/**
 	* Кнопка панели инструментов 
 	*/
	export default {
		props: {
			/**
 			* текущее состояние приложения
 			*/
			currentState: {
				type : String
			},
			/**
 			* состояние приложения после перехода
 			*/
			nextState: {
				default: '',
				type: String
			},
			/**
 			* иконка
 			*/
			icon: String,
			/**
 			* всплывающий текст `title`
 			*/
			title: String
		},
		components : {
			dropEffect : dropEffect
		},
		methods: {
			toggleState: function() {
				if (this.nextState && this.currentState !== this.nextState) {
					this.$emit('onChangeState', this.nextState);
				}
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.toolbar-tool {
		width: @width-toolbar;
		height: calc(@width-toolbar - 10px);
		min-width: @width-toolbar;
		max-height: @width-toolbar;
		background-position: center;
		background-repeat: no-repeat;
		background-size: auto;
		opacity: 0.8;
		.transition( all .2s );
		position: relative;
		display: flex;
    justify-content: center;

		&:last-child {
			margin: 0 0 10px 0;
		}

		&_active {
			opacity: .2;
			.transition( all .2s );
			pointer-events: none;
		}
		
		& * {
			pointer-events: none;
		}
	}
</style>