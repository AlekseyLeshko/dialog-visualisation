<template>
	<div class="super-component">
	
		<btn 
			v-if="com.component == 'btn'"
			v-on:click="change" 
			v-bind:label="com.label">
		</btn>
		
		<select-list 
			v-if="com.component == 'selectList'"
			v-on:onActive="change"
			v-bind:options="com.options" 
			v-bind:active="com.active"
			v-bind:k="com.k"
			v-bind:v="com.v">
		</select-list>
		
		<text-field 
	    v-if="com.component == 'textField'" 
	    v-on:onValue="change"
		  v-bind:label="com.label"
		  v-bind:placeholder="com.placeholder"
			v-bind:value="com.value"
			v-bind:type="com.fieldType">
		</text-field>
		
		<user-list 
			v-if="com.component == 'userList'"
			v-on:onValue="change"
			v-bind:userExcludeId="opt.user.id"
			v-bind:userList="opt.userList">
		</user-list>
		
		<checkbox 
			v-if="com.component == 'checkbox'"
			v-on:active="change"
			v-bind:label="com.label">
		</checkbox>
	
	</div>
</template>


<script>
	import btn 					from '../../components/btn/btn.vue';
	import selectList 	from '../../components/select-list/select-list.vue';
	import textField 		from '../../components/text-field/text-field.vue';
	import userList 		from '../../components/user-list/user-list.vue';
	import checkbox 		from '../../components/checkbox/checkbox.vue';
	
	/**
 	* Супер компонент, может быть любым компонентом. Для построения интерфейса из json. 
 	*/
	export default {
		props : {
			/**
 			* Объект со списком опций компонента
 			*/
			com: Object
		},
		components: {
			btn: btn,
			selectList: selectList,
			textField: textField,
			userList: userList,
			checkbox: checkbox
		},
		methods: {
			change: function(e){
				this.$emit('onChange', {
					value:e,
					props: this.com
				});
				this.$forceUpdate();
			}
		},
		created: function(){
			
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.super-component {
		
	}
	
</style>