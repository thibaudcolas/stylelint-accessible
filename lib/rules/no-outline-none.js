/**
 * This file is a direct copy of https://github.com/YozhikM/stylelint-a11y/blob/daf4a9a429c676ce703c2784101b7cb8d71c42c8/src/rules/no-outline-none/index.js,
 * with minor adjustments to imports and exports.
 */
const stylelint = require('stylelint');
const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule');

const ruleName = 'accessible/no-outline-none';

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (selector) => `Unexpected using "outline" property in ${selector}`,
});

const schema = {
	ruleName,
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
					description: 'Allows removing the outline in non-focus styles',
					demo: true,
					code: '.foo { outline: 0; }',
				},
				{
					code: '$primary-color: #333; .bar:focus { outline: 1px solid $primary-color; }',
				},
				{
					description: 'Allows removing the outline if adding a border',
					demo: true,
					code: '.baz:focus { outline: none; border-color: #333; }',
				},
				{
					code: '.quux:focus { outline: 0; border: 1px solid #000; }',
				},
				{
					description: 'Allows removing the outline if adding a box-shadow',
					demo: true,
					code: '.quuux:focus { outline: none; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }',
				},
			],

			reject: [
				{
					code: '.foo1:focus { outline: none; } .foo2:focus { outline: 1px solid red; }',
					message: messages.expected('.foo1:focus'),
					line: 1,
					column: 3,
				},
				{
					description: 'Disallows removing the outline on focus',
					demo: true,
					code: '.bar:focus { outline: none; }',
					message: messages.expected('.bar:focus'),
					line: 1,
					column: 3,
				},
				{
					code: '.baz:focus { outline: none; border: transparent; }',
					message: messages.expected('.baz:focus'),
					line: 1,
					column: 3,
				},
				{
					code: '.quux { .quuux:focus { outline: 0; } }',
					message: messages.expected('.quuux:focus'),
					line: 1,
					column: 11,
				},
			],
		},
	],
};

const meta = {
	// TODO Add URL.
	url: '',
};

function check(selector, node) {
	if (node.type !== 'rule') {
		return true;
	}

	if (!selector.match(/:focus/gi)) {
		return true;
	}

	const hasEmptyOutline = node.nodes.some(
		(o) =>
			o.type === 'decl' &&
			o.prop.toLowerCase() === 'outline' &&
			['0', 'none'].indexOf(o.value.toLowerCase()) >= 0,
	);

	if (hasEmptyOutline) {
		return node.nodes.some(
			(o) =>
				o.type === 'decl' &&
				['border', 'border-color', 'box-shadow'].indexOf(o.prop.toLowerCase()) >= 0 &&
				!o.value.toLowerCase().match(/transparent/gi),
		);
	}

	return true;
}

const rule = function (primary) {
	return (root, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, { actual: primary });

		if (!validOptions || !primary) {
			return;
		}

		root.walk((node) => {
			let selector = null;

			if (node.type === 'rule') {
				if (!isStandardSyntaxRule(node)) {
					return;
				}

				selector = node.selector;
			} else if (node.type === 'atrule' && node.name.toLowerCase() === 'page' && node.params) {
				selector = node.params;
			}

			if (!selector) {
				return;
			}

			const isAccepted = check(selector, node);

			if (!isAccepted) {
				stylelint.utils.report({
					index: node.lastEach,
					message: messages.expected(selector),
					node,
					ruleName,
					result,
				});
			}
		});
	};
};

module.exports = Object.assign(rule, {
	ruleName,
	messages,
	schema,
	meta,
});
