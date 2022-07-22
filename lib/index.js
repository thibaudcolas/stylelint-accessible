const stylelint = require('stylelint');

const rules = [
	require('./rules/no-outline-none'),
	require('./rules/font-size-relative'),
	require('./rules/no-text-align-justify'),
	require('./rules/no-float'),
	require('./rules/no-forced-color-adjust-none'),
	require('./rules/no-text-overflow-ellipsis'),
];

module.exports = rules.map((r) => {
	return stylelint.createPlugin(r.ruleName, r);
});
