"use strict";
import F from '../functions/functions.js';

let cssVars = function (cssSelector) {
	let sheets = document.styleSheets;
	let result = {};
	
	F.each(sheets, function(e){
		let classes = document.styleSheets[e.index].rules || document.styleSheets[e.index].cssRules;
		
		F.ifExist(classes, 'selectorText', cssSelector, function(x){
			let cssText = (x.object.cssText) ? x.object.cssText : x.object.style.cssText;
			cssText = cssText.match(/{([^}]+)/g)[0].split('{')[1].trim();	
			let attributes = cssText.split(';');
			
			F.each(attributes, function(i){
				if (i.elem) {
					let entry = i.elem.trim().split(':');
					result[entry.splice(0, 1)[0]] = entry.join(':').trim();
				}
			});
		});
	});

	return result
}

export default cssVars;