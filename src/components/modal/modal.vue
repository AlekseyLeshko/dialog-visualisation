<template>
	<div 
		v-bind:class="{'modal_active' : isVisible}"
		class="modal">
		<transition name="show-effect">
		
			<div 
				v-if="isVisible" 
				class="modal__panel">

				<slot>
					<!-- @slot Тут контент который виден после появления элемента -->
				</slot>

			</div>
			
		</transition>
	</div>
</template>


<script>
	/**
 	* Контейнер модального окна.
 	*/
	export default {
		props: {
			/**
 			*  Показать/спрятать
 			*/
			isVisible : {
				default : false,
				type: Boolean
			}
		}
	}
</script>


<style lang="less">
	@import '../../less/main.less';
	
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		.flex-block();
		.justify-content(center);
		
		&_active {
			height: 100vh;
		}

		&__panel {
			background: @color-white;
			width: 500px;
			min-height: 100px;
			position: absolute;
			top: 0;
			box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
			.transform-origin(center top);
		}
	}
	
	.show-effect-enter {
		.transform(translateY(-50vh));
	}
		
	.show-effect-enter-to {
		.transform(translateY(0px));
	}
		
	.show-effect-enter-active {
		.transition(all .3s ease);
	}
	
	.show-effect-leave {
		.transform(translateY(0px));
	}
		
	.show-effect-leave-to {
		.transform(translateY(-50vh));
	}
		
	.show-effect-leave-active {
		.transition(all .3s ease);
	}
	
</style>