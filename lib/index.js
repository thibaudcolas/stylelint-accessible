const stylelint = require('stylelint');

module.exports = [
	stylelint.createPlugin('accessible/no-outline-none', require('./rules/no-outline-none')),
	stylelint.createPlugin('accessible/font-size-relative', require('./rules/font-size-relative')),
];
