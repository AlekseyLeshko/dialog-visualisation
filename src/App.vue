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
					v-bind:fontSize="12"
					v-on:clicked="currentNode"
					v-on:retract="retractNode"
					v-on:expand="expandNode"
					v-on:resized="resize"
					v-on:zoom="zoom"
					v-bind:layoutType="'euclidean'"> 
		</tree>
		
		<div class="tools">
			<checkbox 
				v-bind:label="'Cluster view'"
				v-on:onActive="changeType"></checkbox>
		</div>
		
		<div
			v-if="dialog.visible" 
			class="dialog" 
			v-bind:style="dialogPosition()">
			
			<div class="dialog__container" v-if="dialog.data.text">
			
			<div class="dialog__text">
				{{dialog.data.text}}
			</div>
			
			<div 
				v-if="dialog.data.circle === 'W'" 
				v-for="(child,index) in dialog.data.children"
				class="dialog__button">
						{{child.name}}
			</div>
			
			</div>
			
			<a 
				v-if="dialog.data.url" 
				v-bind:title="dialog.data.url" 
				target="_blank" 
				v-bind:href="dialog.data.url"
				v-bind:class="{'icon_only' : !dialog.data.text}" 
				class="icon_edit">
			
			</a>
			
		</div>
		
		<div class="legend">
			<div class="type_t">T — Text </div>
			<div class="type_l">L — Loop</div>
			<div class="type_s">S — Switch</div>
			<div class="type_w">W — Widget</div>
			<div class="type_d">D — DialogFlow</div>
			<div class="type_a">A — Action</div>
		</div>
		
	</div>
</template>

<script>
	/**
 	* Библиотеки 
 	*/
	import platform from 'platform';
	import {compareString, anchorTodx, drawLink, toPromise, findInParents, mapMany, translate} from '../src/components/tree/d3-utils'

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
				treeType: 'tree',
				dialog: {
					visible: false,
					data: {},
					x: 0,
					y: 0
				},
				iconEdit: {
					visible: false,
					url: null,
					x: 0,
					y: 0
				},
				loops : []
			}
		},
		methods: {
			currentNode : function(n){
				this.dialog.data = n.data;
				this.dialog.visible = true;
				this.getBB(n.data.name);
				
				
				let name = n.data.name.replace('(loop)', '').trim().replace(/\s/g, '-').replace(/[\[\]\.]+/g, '_') + '_' + n.element.id;
				
				let paths = document.querySelectorAll('.linktree')
				
				for(var i = 0; i < paths.length; i++){
					paths[i].classList.remove('active');
				}
				
				getAllParantPath(name)
				
				function getAllParantPath(name){
					
					let path = document.querySelector(`[data-name=${name}]`);
					let parent = path.getAttribute('data-parent-name');
					
					path.classList.add('active');
					
					if ( name !== parent ){
					 	getAllParantPath(parent);
					}
					
				}
				
				this.drawLoopLinks();
				
			},
			
			removeLoopLinks : function(){
				let links = document.querySelectorAll('.loop-link');
				for (var i = 0; i < links.length; i++){
					links[i].remove();
				}
			},
			
			resize : function(e){
				this.removeLoopLinks();
			},
			
			drawLoopLinks : function(){
				
				let __this = this;
				
				this.removeLoopLinks();
				
				setTimeout(function(){
					
					let textNodes = document.getElementsByTagName('text');
					let loops = [];
					
					for (var i = 0; i < textNodes.length; i++ ){
						
						if (textNodes[i].textContent.indexOf('(loop)') + 1){
							
							let node = textNodes[i].parentNode,
									name = textNodes[i].parentNode.getAttribute('data-name'),
									loopName = textNodes[i].textContent.replace('(loop)', '').trim(),
									parentName = textNodes[i].parentNode.getAttribute('data-parent-name');
							
							let parentNode = findParent(parentName, loopName);
							
							
							
							function findParent(name, search, callback){
								
								let n = document.querySelector(`g[data-name=${name}]`);
								let current = n.getAttribute('data-name');
								let parent = n.getAttribute('data-parent-name');
								
								if (current.indexOf(search) + 1) {
								
									return n;
								} else {
									if ( name !== parent ){
										return findParent(parent, search);
									}
								}
								
							}
									
							let fromNode = {
								elem: node,
								x: Number(node.getAttribute('transform').split(',')[0].replace(/[a-zA-Z)(]+/g,"")),
								y: Number(node.getAttribute('transform').split(',')[1].replace(/[a-zA-Z)(]+/g,""))
							};
							let toNode = {
								elem: parentNode,
								x: Number(parentNode.getAttribute('transform').split(',')[0].replace(/[a-zA-Z)(]+/g,"")),
								y: Number(parentNode.getAttribute('transform').split(',')[1].replace(/[a-zA-Z)(]+/g,""))
							};
							let linkGroup = document.querySelector('.links-group');
							let link = document.createElementNS('http://www.w3.org/2000/svg', 'path');
							
							function transformNode (x, y) {
    						return y + ',' + x
  						}		
							
							let d = drawLink({x: fromNode.y, y: fromNode.x}, {x: toNode.y, y: toNode.x}, {transformNode} );
																
							link.setAttribute('d', d);
							link.setAttribute('class','loop-link');
							
							linkGroup.appendChild(link);
							
					
						}
							
					}
					
				},300);
				
			},
			
			expandNode : function(e){
				
				this.drawLoopLinks();
			
				this.dialog.visible = false;
			}, 
			
			retractNode : function(e){
				this.drawLoopLinks();
				
				this.dialog.visible = false;
			},
			
			changeType : function(e){
				
				this.drawLoopLinks();
				
				if (e == true){
					this.treeType = 'tree';
				} else {
					this.treeType = 'cluster';
				}
				this.dialog.visible = false;
			},
			zoom : function(e){
				
				this.getBB(this.dialog.data.name);
				
				
			},
			getBB : function(name){
				let text = document.getElementsByTagName('text');
				
				for (var i = 0; i < text.length; i++){
					if (text[i].textContent === name){
						let bb = text[i].getBoundingClientRect();
						
						this.dialog.x = bb.x + (bb.width/2);
						this.dialog.y = bb.y;
						
					}
				}
			},
			dialogPosition : function(){
				return `top: ${this.dialog.y}px; left: ${this.dialog.x}px`;
			}
		},
		created: function() {
			window.APP = this;
			
			let __this = this;
			
			window.addEventListener('click', function(e){
				
				if (e.target.nodeName === 'svg'){
					
					if (__this.dialog && __this.dialog.visible) __this.dialog.visible = false;
				}
				
			},false);
			
		}
	}
</script>

<style lang="less">
	@import '~normalize.css/normalize.css';
	@import './less/main.less';
	
	@color-t: #009dff;	
	@color-l: #cc46cc;	
	@color-s: #80c148;	
	@color-w: #ff9d00;
	@color-d: #ff004e;	
	@color-a: #ffd800;	

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
		overflow: hidden;
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
	
	.dialog {
		position:absolute;
		max-width: 250px;
		min-height: 20px;
		
		top:0;
		left:0;
		margin: 40px 0 0 0;
	}
	
	.dialog__container {
		background-color: #fafafa;
		border-radius: 0 10px 10px 10px;
		box-shadow: 0px 5px 15px rgba(0,0,0,0.15);
		padding: 8px;
		line-height: 1.3;
	}
	
	.dialog__button {
		background-color: #fff;
		border-radius: 5px;
		padding: 10px 0;
		box-sizing: border-box;
		margin: 10px 0 0 0;
		text-align: center;
		box-shadow: 0px 3px 10px rgba(0,0,0,0.1);
	}
	
	.legend {
		position: absolute;
		bottom: 0;
		left:0;
		width: 100vw;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
	
	.legend div {
		margin: 20px 0 20px 40px;
		text-align: left;
		flex-grow: 1;
	}
	
	.legend div:before {
		content: '';
		display: block;
		position: relative;
		transform: translate(-15px, 13px);
		border-radius: 10px;
		background-color: #ccc;
		width: 10px;
		height: 10px;
	} 
	
	.legend div.type_t:before {
		background-color: @color-t;
	}
	
	.legend div.type_l:before {
		background-color: @color-l;
	}
	
	.legend div.type_s:before {
		background-color: @color-s;
	}
	
	.legend div.type_w:before {
		background-color: @color-w;
	}
	
	.legend div.type_d:before {
		background-color: @color-d;
	}
	
	.legend div.type_a:before {
		background-color: @color-a;
	}
	
	.icon_edit {
		position: absolute;
		display:block;
		cursor: pointer;
		top:0;
		right:0;
		width:20px;
		height:20px;
		background-size: 18px;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg width='18px' height='18px' viewBox='0 0 18 18' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Typography/icons' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' transform='translate(-314.000000, -429.000000)'%3E%3Cg id='Core' transform='translate(103.000000, 300.000000)' fill='%23000000'%3E%3Cg id='create' transform='translate(211.000000, 129.000000)'%3E%3Cpath d='M0,14.2 L0,18 L3.8,18 L14.8,6.9 L11,3.1 L0,14.2 L0,14.2 Z M17.7,4 C18.1,3.6 18.1,3 17.7,2.6 L15.4,0.3 C15,-0.1 14.4,-0.1 14,0.3 L12.2,2.1 L16,5.9 L17.7,4 L17.7,4 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
		transform: translate(30px, 6px);
	}
	
	.icon_only {
		transform: translate(10px, -10px);
	}
	
	.loop-link {
		stroke: #cc46cc;
		fill:none;
		stroke-dasharray: 3px;
	}
	
	path {
		transition: stroke-width .3s;
	}
	
	path.active {
		stroke-width: 6px!important;
		transition: stroke-width .3s;
	}
	
</style>