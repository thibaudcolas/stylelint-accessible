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
	meta,
});
