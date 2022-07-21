const stylelint = require('stylelint');
const { config } = require('../utils');

const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule');

/** @typedef { import("../types").RuleSchema } RuleSchema */

const ruleName = 'accessible/no-text-align-justify';

const possibleTextAlign = ['left', 'right', 'center', 'justify', 'start', 'end'];
const disallowedTextAlign = ['justify'];

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node) => `Avoid problematic text-align in ${node}`,
});

/** @type {RuleSchema} */
const schema = {
	ruleName,
	wrappedRule: {
		// https://stylelint.io/user-guide/rules/list/declaration-property-value-disallowed-list/
		ruleName: 'declaration-property-value-disallowed-list',
		options: [
			{
				'text-align': [1, 'disallow'],
			},
		],
	},
	options: [
		{},
		{
			possible: {
				disallow: possibleTextAlign,
			},
			optional: true,
			default: {
				disallow: disallowedTextAlign,
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
					description: 'Accepts a text-align of `center`',
					code: '.foo { text-align: center; }',
					demo: true,
				},
				{
					description: 'Accepts a text-align of `start`',
					code: '.foo { text-align: start; }',
					demo: true,
				},
			],

			reject: [
				{
					description: 'Rejects a text-align of `justify`',
					demo: true,
					code: '.foo { text-align: justify; }',
					message: messages.expected('text-align: justify'),
					line: 1,
					column: 8,
				},
			],
		},
		{
			ruleName,
			config: [true, { disallow: ['justify', 'left', 'right'] }],
			accept: [
				{
					description: 'Accepts a text-align of start',
					code: '.foo { text-align: start; }',
					demo: true,
				},
			],

			reject: [
				{
					description: 'Rejects a text-align of `justify`',
					demo: true,
					code: '.foo { text-align: justify; }',
					message: messages.expected('text-align: justify'),
					line: 1,
					column: 8,
				},
				{
					description: 'Rejects a text-align of `left`',
					demo: true,
					code: '.foo { text-align: left; }',
					message: messages.expected('text-align: left'),
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
