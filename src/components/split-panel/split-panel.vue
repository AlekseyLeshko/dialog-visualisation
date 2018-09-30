<template>

	<Split 
		v-bind:gutterSize="1" 
		class="split-panel"
		v-on:onDragEnd="onDragEnd" 
		v-on:onDragStart="onDragStart" 
		v-on:onDrag="onDrag">
			
			<SplitArea 
				class="split-panel__part split-panel__part_white"
				v-bind:size="panelsSettings.panelLeft" 
				v-bind:minSize="minWidth">
				
				<slot name="left">
				</slot>
				
			</SplitArea>	
			
			<SplitArea 
				class="split-panel__part split-panel__part_messages"
				v-bind:size="panelsSettings.panelCenter" 
				v-bind:minSize="minWidth">	
				
				<slot name="center">
				</slot>
				
			</SplitArea>	
			
			<SplitArea 
				class="split-panel__part split-panel__part_white"
				v-bind:size="panelsSettings.panelRight" 
				v-bind:minSize="minWidth">
				
				<slot name="right">
				</slot>		
				
			</SplitArea>		
				
	</Split>		
		
</template>


<script>
	/**
 	* Плагины 
 	*/
	import VueSplit 				from 'vue-split-panel';
	
	/**
 	* Панели рабочего экрана 
 	*/
	export default {
		props: {
			/**
 			* Минимальная ширина
 			*/
			minWidth : {
				default : 300,
				type: Number
			}
		},
		components : {
			Split: VueSplit.Split,
			SplitArea: VueSplit.SplitArea,
		},
		methods: {
			onDragStart(size) {
				
			},
			onDrag(size) {
				
			},
			onDragEnd(size) {
				this.panelsSettings = {
					panelLeft : size[0],
					panelCenter : size[1],
					panelRight : size[2]
				}
				localStorage.setItem("panelsSettings", JSON.stringify(this.panelsSettings));
			}
		},
		data: function(){
			return {
				panelsSettings : (function() {
					let localPanelsSettings = localStorage.getItem("panelsSettings");
					let defaultWidth = 100 / 3;//33.333333;
					return (localPanelsSettings) ? JSON.parse(localPanelsSettings) : {
						panelLeft : defaultWidth,
						panelCenter : defaultWidth,
						panelRight : defaultWidth
					};
				})() 
			}
		}
	}

</script>


<style lang="less">
	@import '../../less/main.less';
	
	.split-panel {
		.flex-block();
		box-sizing: border-box;
		position: absolute;
		width:100%;
		height:100%;
	}
	
	.split-panel__part {
		box-sizing: border-box;
		overflow: hidden;
		.flex-block();
		.flex-direction(column);
		position: relative;
		min-width: 300px;

		&:first-child {
			.f-border(right);
		}

		&:last-child {
			.f-border(left);
		}

		&_white {
			background-color: @color-white;
		}
		&_messages {
			box-shadow: inset 0px 0px 50px rgba(0, 0, 0, 0.03);
		}
	}
	
	.gutter.gutter-horizontal {
		background-image: none;
		background-color: @color-active;
		.transform-origin(center center);
		position: relative;
		z-index: 10000;
		opacity: 0;
		.transition(all .2s ease);

		& {
			.transform(scaleX(10) translateX(-0.1px));
		}

		&+.split-panel__part+& {
			.transform(scaleX(10) translateX(0.1px));
		}

		&:hover,
		&:active {
			opacity: 0.05;
			.transition(all .2s .2s ease);
		}
	}
	
</style>