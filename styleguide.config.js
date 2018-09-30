var path = require('path');

module.exports = {
  components: 'src/components/**/*.vue',
	require: [path.join(__dirname, 'styleguide/global.requires.js')]
}