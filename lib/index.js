const stylelint = require('stylelint');

const rules = [
	require('./rules/no-outline-none'),
	require('./rules/font-size-relative'),
	require('./rules/no-text-align-justify'),
];

module.exports = rules.map((r) => {
	return stylelint.createPlugin(r.ruleName, r);
});
