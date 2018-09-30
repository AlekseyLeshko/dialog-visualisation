<template>
	<div class="date-time">{{setDate()}}</div>
</template>


<script>

	import getDateTitme from '../../functions/date-time.js';
	
	/**
 	* Выводит дату и время
 	*/
	export default {
		props: {
			/**
 			* Дата и время
 			*/
			date: {
				default: '',
				type: String
			},
			/**
 			* Формат. `formated` — 00-00-000 00:00, `time` — 00:00, `dateTime` — месяц 00, 00:00 
 			*/
			format: {
				default: 'dateTime', 
				type: String
			}
		},
		methods: {
			setDate : function(){
				return getDateTitme(this.date)[this.format];
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.date-time {
		font-size: 12px;
		white-space: nowrap;
		font-weight: 500;
		opacity: 0.7;
		user-select: none;
	}
</style>