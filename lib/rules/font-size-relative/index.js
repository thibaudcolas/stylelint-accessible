const stylelint = require('stylelint');
const { config } = require('../utils');

const ruleName = 'accessible/font-size-relative';

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node) => `Use a relative font size unit in ${node}`,
});

// https://github.com/fisker/css-units-list/blob/ffc4bf5835461a81649381abed862b9ad65e7580/index.js#L1-L2
// https://www.w3.org/TR/css-values-4/#font-relative-lengths
const fontRelativeLengths = ['em', 'ex', 'cap', 'ch', 'ic', 'rem', 'lh', 'rlh'];

const schema = {
	wrappedRule: {
		ruleName: 'declaration-property-unit-allowed-list',
		options: [
			{
				'font-size': [1, 'units'],
			},
		],
	},
	options: [
		{},
		{
			possible: {
				units: fontRelativeLengths,
			},
			optional: true,
			default: {
				units: fontRelativeLengths,
			},
		},
	],
};

const rule = function (primary, secondary) {
	return (root, result) => {
		const { isValid, options, checkWrappedRule } = config(
			result,
			ruleName,
			schema,
			primary,
			secondary,
		);

		if (!isValid || !primary) {
			return;
		}

		checkWrappedRule(root, messages);

		// stylelint.utils.checkAgainstRule(
		// 	{
		// 		ruleName: 'declaration-property-unit-allowed-list',
		// 		ruleSettings: [
		// 			{
		// 				'font-size': options[1].units,
		// 			},
		// 		],
		// 		root,
		// 	},
		// 	(warning) => {
		// 		stylelint.utils.report({
		// 			message: messages.expected(warning.node),
		// 			ruleName,
		// 			result,
		// 			node: warning.node,
		// 			line: warning.line,
		// 			column: warning.column,
		// 		});
		// 	},
		// );
	};
};

module.exports = Object.assign(rule, {
	ruleName,
	messages,
});
