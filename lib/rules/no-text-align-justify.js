const stylelint = require('stylelint');
const { config } = require('../utils');

const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule');

/** @typedef { import("../types").RuleSchema } RuleSchema */

const ruleName = 'accessible/no-text-align-justify';

const disallowedTextAlign = ['justify'];

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (node) => `Avoid justified text in ${node}`,
});

/** @type {RuleSchema} */
const schema = {
	ruleName,
	wrappedRule: {
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
				disallow: disallowedTextAlign,
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
					label: 'Accepts a text-align of `center`',
					code: '.foo { text-align: 1rem; }',
					demo: true,
				},
				{
					label: 'Allows any unit to be used for the html element',
					code: 'html { text-align: 16px; }',
					demo: true,
				},
			],

			reject: [
				{
					label: 'Rejects a text-align in pixels',
					demo: true,
					code: '.foo { text-align: 16px; }',
					message: messages.expected('text-align: 16px'),
					line: 1,
					column: 8,
				},
				{
					code: 'html.foo { text-align: 16px; }',
					message: messages.expected('text-align: 16px'),
					line: 1,
					column: 12,
				},
				{
					code: 'html .foo { text-align: 16px; }',
					message: messages.expected('text-align: 16px'),
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
					label: 'Accepts a text-align in em',
					code: '.foo { text-align: 1em; }',
					demo: true,
				},
				{
					label: 'Allows any unit to be used for the html element',
					code: 'html { text-align: 16px; }',
					demo: true,
				},
			],

			reject: [
				{
					label: 'Rejects a text-align in pixels',
					demo: true,
					code: '.foo { text-align: 16px; }',
					message: messages.expected('text-align: 16px'),
					line: 1,
					column: 8,
				},
				{
					label: 'Rejects a text-align in rem',
					demo: true,
					code: '.foo { text-align: 1rem; }',
					message: messages.expected('text-align: 1rem'),
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
