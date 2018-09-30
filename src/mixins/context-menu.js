'use strict';

const contextMenu = {
	methods: {
		setContextMenu: function (e) {
			if (this.menu){
				APP.$data.app.context.isShowed = true;
				APP.$data.app.context.x = e.clientX;
				APP.$data.app.context.y = e.clientY;
				APP.$data.app.context.menu = this.menu;
			}
		}
	}
}

export default contextMenu;