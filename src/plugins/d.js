'use strict';

import dictionary from '../functions/dictionary.js';

const d = {};

d.install = function (Vue) {

	Vue.prototype.$d = function (word, lang) {
		word = word.toLowerCase();
		lang = lang || APP.$data.app.lang;
    return dictionary[word][lang];
  }
}

export default d;