"use strict";

/**
 * Функция возвращает совпадение первого знака строки с цветом из массива
 * @param {String} str Строка текста
 * @return {String} HEX цвет 
 */
const changeColor = function (str) {
	
	const length = str.length;
	const colors = ['#f78987', '#f28aad', '#c17bcc', '#9a74dd', '#7fbded', '#79cc8f', '#ffd571', '#67c4bb', '#d0b582', '#ef7139', '#5387c4'];
	
	let color;
	
	for (var i = 0, c = colors.length - 1; i < length; i++){
		color = colors[c];
		c = (c === 0) ? colors.length - 1 : c - 1;
	}
	
	return color;
	
}

export default changeColor;