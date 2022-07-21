const stylelint = require('stylelint');
const { config } = require('../utils');

const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule');

/** @typedef { import("../types").RuleSchema } RuleSchema */

const ruleName = 'accessible/font-size-relative';

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node) => `Use a relative font size unit in ${node}`,
});

// https://github.com/fisker/css-units-list/blob/ffc4bf5835461a81649381abed862b9ad65e7580/index.js#L1-L2
// https://www.w3.org/TR/css-values-4/#font-relative-lengths
const fontRelativeLengths = ['em', 'ex', 'cap', 'ch', 'ic', 'rem', 'lh', 'rlh'];

/** @type {RuleSchema} */
const schema = {
	ruleName,
	wrappedRule: {
		// https://stylelint.io/user-guide/rules/list/declaration-property-unit-allowed-list/
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
	docs: {
		description: 'TODO',
		url: 'TODO',
		impact: 'Serious',
		tags: ['TODO'],
		resources: ['TODO'],
	},
	tests: [
		{
			ruleName,
			config: [true],
			accept: [
				{
					description: 'Accepts a font-size in rem',
					code: '.foo { font-size: 1rem; }',
					demo: true,
				},
				{
					description: 'Allows any unit to be used for the html element',
					code: 'html { font-size: 16px; }',
					demo: true,
				},
			],

			reject: [
				{
					description: 'Rejects a font-size in pixels',
					demo: true,
					code: '.foo { font-size: 16px; }',
					message: messages.expected('font-size: 16px'),
					line: 1,
					column: 8,
				},
				{
					code: 'html.foo { font-size: 16px; }',
					message: messages.expected('font-size: 16px'),
					line: 1,
					column: 12,
				},
				{
					code: 'html .foo { font-size: 16px; }',
					message: messages.expected('font-size: 16px'),
					line: 1,
					column: 13,
				},
			],
		},
		{
			ruleName,
			config: [true, { units: ['em'] }],
			accept: [
				{
					description: 'Accepts a font-size in em',
					code: '.foo { font-size: 1em; }',
					demo: true,
				},
				{
					description: 'Allows any unit to be used for the html element',
					code: 'html { font-size: 16px; }',
					demo: true,
				},
			],

			reject: [
				{
					description: 'Rejects a font-size in pixels',
					demo: true,
					code: '.foo { font-size: 16px; }',
					message: messages.expected('font-size: 16px'),
					line: 1,
					column: 8,
				},
				{
					description: 'Rejects a font-size in rem',
					demo: true,
					code: '.foo { font-size: 1rem; }',
					message: messages.expected('font-size: 1rem'),
					line: 1,
					column: 8,
				},
			],
		},
	],
};

const meta = {
	// TODO Add URL.
	url: schema.docs.url,
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

		root.walkRules((ruleNode) => {
			const selector = ruleNode.selector;

			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (selector === 'html') {
				return;
			}

			checkWrappedRule(ruleNode, messages);
		});
	};
};

module.exports = Object.assign(rule, {
	ruleName,
	messages,
	schema,
	meta,
});
