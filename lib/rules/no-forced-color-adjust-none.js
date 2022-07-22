const stylelint = require('stylelint');
const { createWrappedRule } = require('../utils');

/** @typedef { import("../types").RuleSchema } RuleSchema */

const ruleName = 'accessible/no-forced-color-adjust-none';

const possibleValues = ['auto', 'none'];
const disallowedValues = ['none'];

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node) =>
		`${node} is often an anti-pattern. If you do need it, add a comment explaining why and disable the rule for this line.`,
});

/** @type {RuleSchema} */
const schema = {
	ruleName,
	wrappedRule: {
		// https://stylelint.io/user-guide/rules/list/declaration-property-value-disallowed-list/
		ruleName: 'declaration-property-value-disallowed-list',
		options: [
			{
				'forced-color-adjust': [1, 'disallow'],
			},
		],
	},
	options: [
		{},
		{
			possible: {
				disallow: possibleValues,
			},
			optional: true,
			default: {
				disallow: disallowedValues,
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
					code: '.foo { forced-color-adjust: auto; }',
				},
			],
			reject: [
				{
					description: 'Avoid forced-color-adjust: none',
					demo: true,
					code: '.foo { forced-color-adjust: none; }',
					message: messages.expected('forced-color-adjust: none'),
					line: 1,
					column: 8,
				},
			],
		},
		{
			ruleName,
			config: [true, { disallow: ['auto', 'none'] }],
			accept: [
				{
					code: '.foo { not-using-forced-color-adjust: none; }',
				},
			],

			reject: [
				{
					description: 'Avoid forced-color-adjust: none',
					demo: true,
					code: '.foo { forced-color-adjust: none; }',
					message: messages.expected('forced-color-adjust: none'),
					line: 1,
					column: 8,
				},
				{
					description: 'forced-color-adjust: auto could be an anti-pattern too',
					demo: true,
					code: '.foo { forced-color-adjust: auto; }',
					message: messages.expected('forced-color-adjust: auto'),
					line: 1,
					column: 8,
				},
			],
		},
	],
};

module.exports = createWrappedRule({ messages, schema });
