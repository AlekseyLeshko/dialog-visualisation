<template>
	
	<div class="chat-date">
		<date-time
			class="chat-date__date"
			v-bind:date="date"
			v-bind:format="'date'">		
		</date-time>
	</div>
	
</template>


<script>
	
	/**
 	* Компоненты 
 	*/
	import dateTime from '../../components/date-time/date-time.vue'; 
	
	export default {
		props: {
			/**
 			* Дата, число и месяц
 			*/
			date : {
				type: String
			}
		},
		components: {
			dateTime : dateTime
		}
	}

</script>


<style lang="less">
	@import '../../less/main.less';
	
	.chat-date {
		box-sizing: border-box;
		.flex-block();
		justify-content: center;
		
		&__date {
			background-color: @color-white;
    	padding: 5px 10px;
    	border-radius: 10px;
    	box-shadow: 0px 3px 10px rgba(0,0,0,0.15);
    	margin: 10px 0 5px 0;
		}
		
	}
	
</style>