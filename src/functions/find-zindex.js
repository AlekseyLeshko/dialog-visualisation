"use strict";

const findZindex = function(elem){
  let elems = document.getElementsByTagName(elem);
  let highest = 0;
  for (var i = 0; i < elems.length; i++){
    let zindex = document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index");
    if ((zindex > highest) && (zindex != 'auto')){
      highest = zindex;
    }
  }
  return new Number(highest);
}

export default findZindex;