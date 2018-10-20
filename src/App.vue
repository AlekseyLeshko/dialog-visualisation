<template>
	<div class="app">
		
		<!-- LOADING STATE -->
		<div v-if="state === 'loading'" class="app__state">
			<loading-spinner>
			</loading-spinner>
		</div>
		<!-- LOADING STATE -->
		
		<!--LOGIN STATE -->
		<div v-if="state === 'login'" class="app__state">
			<div class="app__state-inner">
			
				<div class="logo">
				</div>
				
				<text-field 
					v-on:onValue="setEmail"
					v-bind:label="'Email'">
				</text-field>
				
				<text-field 
					v-on:onValue="setPass"
					v-bind:type="'password'"
					v-bind:label="'Password'">
				</text-field>
				
				<select-list 
					v-on:onActive="setEnv"
					v-bind:k="'value'"
					v-bind:v="'title'"
					v-bind:active="env.active"
					v-bind:options="env.options">
				</select-list>
				
				<btn-group>
					<btn 
						v-on:click.native="loadData"
						v-bind:label="'Log in'">
					</btn>
				</btn-group>	
				
			</div>
		</div>
		<!--LOGIN STATE -->
		
		<!--VIEWER STATE -->
		<div 
			v-if="state === 'viewer'" 
			class="app__state app__state_viewer">
		<tree 
					ref="tree"
					v-bind:data="tree" 
					v-bind:type="d3.treeType" 
					v-bind:node-text="'name'" 
					v-bind:radius="6"
					v-bind:duration="d3.duration"
					v-bind:zoomable="true"
					v-bind:fontSize="12"
					v-on:clicked="nodeInfo"
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
		<!--VIEWER STATE -->
		
	</div>
</template>

<script>

	import platform 				from 'platform';
	import {compareString, anchorTodx, drawLink, toPromise, findInParents, mapMany, translate} from '../src/components/tree/d3-utils';

	import tree 						from '../src/components/tree/Tree.vue';
	import checkbox 				from '../src/components/checkbox/checkbox.vue';
	import textField 				from '../src/components/text-field/text-field.vue';
	import selectList 			from '../src/components/select-list/select-list.vue';
	import btn 							from '../src/components/btn/btn.vue';
	import btnGroup					from '../src/components/btn-group/btn-group.vue';
	import loadingSpinner		from '../src/components/loading-spinner/loading-spinner.vue';


	export default {
		name: 'app',
		components: {
			tree,
			checkbox,
			textField,
			selectList,
			btn,
			btnGroup,
			loadingSpinner
		},
		data: function() {
			return {
				tree: window.treeData,
				/**
 				* опции для d3
 				*/
				d3: {
					treeType: 'tree',
					duration: 300
				},
				/**
 				* Положение и состояния для панели тултипа пейлоада
 				*/
				dialog: {
					visible: false,
					data: {},
					x: 0,
					y: 0
				},
				/**
 				* Состояние: `login`, `viewer`, `loading`
 				*/
				state: 'login',
				/**
 				* Логин/пароль
 				*/
				login: {
					email	: null,
					pass	: null,
					token	: null,
					env		: null
				},
				/**
 				* опции для компонента селекта выбора окружения
 				*/
				env: {
					options: [
						{
							title : 'Production',
							value : 0
						},{
							title : 'Stage',
							value : 1
						},{
							title : 'Dev',
							value : 2
						}
					],
					active: 0
				},
				amplitude: []
			}
		},
		methods: {
			/**
 			* Логин, авторизация и загрузка данных 
 			*/
			loadData: function() {
        const email = this.login.email;
        const password = this.login.pass;
        const env = this.login.env;
				const __this = this;

				this.state= 'loading';
				
        login(email, password, env)
            .then(data => {
                if (!data.success) throw data.error;
                const token = data.data.token;
								
                localStorage.setItem('d3.apiToken', token);
                localStorage.setItem('d3.env', env);
					
								__this.login.token = token;
					
                loadFromApi(env, token, function(e){
									
									__this.tree = e;
									__this.state = 'viewer';
									
								});
            })
        		.catch(e => {
							__this.state = 'login';
							console.log(JSON.stringify(e));
						});
    	},
			
			/**
 			* Данные поля email
 			*/
			setEmail: function(e) {
				this.login.email = e;
			},
			
			/**
 			* Данные поля pass
 			*/
			setPass: function(e) {
				this.login.pass = e;
			},
			
			/**
 			* Данные селекта env
 			*/
			setEnv: function(e) {
				this.login.env = this.env.options[e].title;
				this.env.active = e;
			},
			
			/**
 			* Проверка токена
 			*/
			getToken: function(){
				const token = localStorage.getItem('d3.apiToken');
        const env = localStorage.getItem('d3.env');
				const __this = this;
				
				
				if (token && env) {
						
						__this.state = 'loading';
						__this.login.token = token;
						__this.login.env = env;
					/*
            loadFromApi(env, token, function(e){
									
							__this.tree = e;
							__this.state = 'viewer';
									
						});
					*/
					
					this.tree = window.ddd; //for test
					this.state = 'viewer';
					
					
        } else {
					__this.state = 'login';
				}
			},
			
			replaceName : function(n){
				return n.replace('(loop)', '').trim().replace(/\s/g, '-').replace(/[\[\]\.]+/g, '_') + '_';
			},
			
			/**
 			* Метод события клика на заголовок ноды. Информация о ноде
 			*/
			nodeInfo : function(n){
				
				this.dialog.data = n.data;
				this.dialog.id = n.element.id;
				this.dialog.visible = true;
				this.getBB(n.element.id);
				
				let name = this.replaceName(n.data.name) + n.element.id;
				let paths = document.querySelectorAll('.linktree')
				
				for(var i = 0; i < paths.length; i++){
					paths[i].classList.remove('active');
				}
				
				getAllParantPath(name);
				
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
			
			/**
 			* Удалить loop ссылку
 			*/
			removeLoopLinks : function(){
				let links = document.querySelectorAll('.loop-link');
				for (var i = 0; i < links.length; i++){
					links[i].remove();
				}
			},
			
			/**
 			* Метод события ресайза окна. Удалить loop ссылку
 			*/
			resize : function(e){
				this.removeLoopLinks();
			},
			
			/**
 			* Нарисовать loop ссылку.
 			*/
			drawLoopLinks : function(){
				
				let __this = this;
				
				this.removeLoopLinks();
				
				setTimeout(function(){
					
					let textNodes = document.getElementsByTagName('text');
					
					for (var i = 0; i < textNodes.length; i++ ){
						
						if (textNodes[i].textContent.indexOf('(loop)') + 1){
							
							let tn = textNodes[i],
									node = tn.parentNode,
									name = tn.parentNode.getAttribute('data-name'),
									loopName = tn.textContent.replace('(loop)', '').trim(),
									parentName = tn.parentNode.getAttribute('data-parent-name');
							
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
					
				}, __this.d3.duration);
				
			},
			
			/**
 			* Метод события раскрытия ноды. 
 			*/
			expandNode : function(e){
				
				this.drawLoopLinks();
			
				this.dialog.visible = false;
				
				let from = e.data.name;
				let from_elem = document.querySelector(`[data-id="${e.element.id}"] .node_value_out`);
				
				let __this = this;
			
				
				
				console.log(e)
				
				
				if (from != 'Stage' && from != 'Main' && from != 'Orphaned' && from != 'Dialogflow Misc' && e.data.children && e.data.children.length ){
					
					for (var i = 0; i < e.data.children.length; i++){
						
						this.loadAmplitude(e.data.name.replace('(loop)',''), e.data.children[i].name.replace('(loop)',''), i, function(result, g) {
							
							var to_elem = document.querySelector(`[data-id="${e.element.children[g].id}"] .node_value_in`);
							
							
							if (result.status === 'Success'){
								 
								from_elem.textContent = result.data.from.value;
								to_elem.textContent = result.data.to.value;
								
								e.data.value_out = result.data.from.value + ''; 
								e.data.children[g].value_in = result.data.to.value + '';
								
							} else {
								from_elem.textContent = '—';
								to_elem.textContent = '—'//result.data.to.value;
								
								e.data.value_out = '—'; 
								e.data.children[g].value_in = '—';
							}
						
						});
					}
				}
				
			
				
			}, 
			
			/**
 			* Метод события закрытия ноды. 
 			*/
			retractNode : function(e){
				this.drawLoopLinks();
				
				this.dialog.visible = false;
			},
			
			/**
 			* Смена режима отображения графика. 
 			*/
			changeType : function(e){
				
				this.drawLoopLinks();
				
				if (e == true){
					this.d3.treeType = 'tree';
				} else {
					this.d3.treeType = 'cluster';
				}
				this.dialog.visible = false;
			},
			
			/**
 			* Метод события изменения масштаба. 
 			*/
			zoom : function(e){
				if (this.dialog.visible) this.getBB(this.dialog.id);
			},
			
			
			getBB : function(id){
						let g = document.querySelector('[data-id="'+id+'"]');
						
						let bb = g.getBoundingClientRect();
												
						this.dialog.x = bb.x + (bb.width/2);
						this.dialog.y = bb.y;

			},
			
			/**
 			* Положение превьюхи пейлоада. 
 			*/
			dialogPosition : function(){
				return `top: ${this.dialog.y}px; left: ${this.dialog.x}px`;
			},
			
			loadAmplitude: function(from, to, i, callback){
				
				const domain = 'http://localhost:5000'//'https://amp-robot.herokuapp.com'
				const query = `${domain}/?from=${from}&to=${to}n&start=20181010&end=20181015`
				
				console.log(query)
				
				fetch(query).then(e => e.json()).then(e => callback(e, i))
				
			}
			
		},
		
		
		created: function() {
			window.APP = this;
			
			this.getToken();
			
			
			window.addEventListener('click', e => {
				if (e.target.nodeName === 'svg'){
					if (this.dialog && this.dialog.visible) this.dialog.visible = false;
				}
				
			}, false);
			
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

	#app,
	.app {
		position: absolute;
		overflow: hidden;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
		
		&__state {
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			display: flex;
			justify-content: center;
		}
		
		&__state_viewer {
			display:block;
		}
		
		&__state-inner {
			width: 250px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;
			min-height: 500px;
		}
		
	}
	
	
	.viewport {
		height: 100vh;
	}

	#loading {
		width: 100%;
		height: 100%;
		background-color: @color-white;
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
		margin: 35px 0 0 0;
		
		&__container {
			background-color: #fafafa;
			border-radius: 0 10px 10px 10px;
			box-shadow: 0px 5px 15px rgba(0,0,0,0.15);
			padding: 8px;
			line-height: 1.3;
		}
		
		&__button {
			background-color: #fff;
			border-radius: 5px;
			padding: 10px 0;
			box-sizing: border-box;
			margin: 10px 0 0 0;
			text-align: center;
			box-shadow: 0px 3px 10px rgba(0,0,0,0.1);
		}
		
	}
	
	.legend {
		position: absolute;
		bottom: 0;
		left:0;
		width: 100vw;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		
		& div {
			margin: 20px 0 20px 40px;
			text-align: left;
			flex-grow: 1;
		}
		
		& div:before {
			content: '';
			display: block;
			position: relative;
			transform: translate(-15px, 13px);
			border-radius: 10px;
			background-color: #ccc;
			width: 10px;
			height: 10px;
		} 
		
		& div.type_t:before {
			background-color: @color-t;
		}

		& div.type_l:before {
			background-color: @color-l;
		}

		& div.type_s:before {
			background-color: @color-s;
		}

		& div.type_w:before {
			background-color: @color-w;
		}

		& div.type_d:before {
			background-color: @color-d;
		}

		& div.type_a:before {
			background-color: @color-a;
		}
		
	}
	
	.icon_edit {
		position: absolute;
		display:block;
		opacity: 0.5;
		transition: opacity .2s;
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
	
	.icon_edit:hover {
		opacity: 1;
		transition: opacity .2s;
	}
	
	.icon_only {
		transform: translate(10px, -5px);
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
	
	.logo {
		width: 76px;
		height: 76px;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100%;
		background-image: url("data:image/svg+xml,%3Csvg class='Logostyled__StyledSvgIcon-bWWVcV emhBcb' width='76' height='76' viewBox='0 0 76 76' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='none' d='M-133-47h1680v1711H-133z'%3E%3C/path%3E%3Cg fill-rule='nonzero'%3E%3Ccircle fill='%232978fd' cx='38' cy='38' r='38'%3E%3C/circle%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M11.368 38.829c-.167 0-.354-.02-.522-.058-1.193-.304-1.94-1.523-1.66-2.761 1.25-5.258 5.82-8.934 11.116-8.934 5.296 0 9.884 3.676 11.115 8.934a2.291 2.291 0 0 1-1.66 2.761c-1.194.305-2.406-.457-2.704-1.695-.765-3.2-3.544-5.428-6.77-5.428-3.226 0-6.005 2.228-6.77 5.428a2.201 2.201 0 0 1-2.145 1.753zM64.632 38.829c-1.008 0-1.921-.705-2.182-1.753-.765-3.2-3.544-5.428-6.77-5.428-3.227 0-6.005 2.228-6.77 5.428-.298 1.22-1.492 1.981-2.704 1.695-1.194-.304-1.94-1.523-1.66-2.761 1.25-5.258 5.819-8.934 11.115-8.934 5.297 0 9.884 3.676 11.115 8.934a2.291 2.291 0 0 1-1.66 2.761c-.13.039-.298.058-.484.058z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	}
	
</style>