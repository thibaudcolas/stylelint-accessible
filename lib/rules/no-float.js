const stylelint = require('stylelint');
const { config } = require('../utils');

const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule');

/** @typedef { import("../types").RuleSchema } RuleSchema */

const ruleName = 'accessible/no-float';

const possibleFloat = ['left', 'right', 'none', 'both', 'inline-start', 'inline-end', /^\b$/];
const allowedFloat = [/^\b$/];

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node) => `Avoid float layout usage in ${node}`,
});

/** @type {RuleSchema} */
const schema = {
	ruleName,
	wrappedRule: {
		// https://stylelint.io/user-guide/rules/list/declaration-property-value-allowed-list/
		ruleName: 'declaration-property-value-allowed-list',
		options: [
			{
				float: [1, 'allow'],
				clear: [1, 'allow'],
			},
		],
	},
	options: [
		{},
		{
			possible: {
				allow: possibleFloat,
			},
			optional: true,
			default: {
				allow: allowedFloat,
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
					description: 'No float usage, no problem',
					code: '.foo { display: flex; }',
					demo: true,
				},
			],

			reject: [
				{
					description: 'Rejects float usage',
					demo: true,
					code: '.foo { float: left; }',
					message: messages.expected('float: left'),
					line: 1,
					column: 8,
				},
			],
		},
		{
			ruleName,
			config: [true, { allow: ['inline-start', 'inline-end', 'none'] }],
			accept: [
				{
					description: 'Accepts a logical float value',
					code: '.foo { float: inline-start; }',
					demo: true,
				},
			],

			reject: [
				{
					description: 'Rejects a physical float value',
					demo: true,
					code: '.foo { float: left; }',
					message: messages.expected('float: left'),
					line: 1,
					column: 8,
				},
			],
		},
	],
};

const meta = {
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
