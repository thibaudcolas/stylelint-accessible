const stylelint = require('stylelint');

/** @typedef {import('stylelint').RuleOptions} RuleOptions */
/** @typedef {import('stylelint').RuleOptionsPossible} Possible */
/** @typedef {import('stylelint').RuleOptionsPossibleFunc} PossibleFunc */

/**
 * Stylelint’s validateOptions, except the expected schema is defined separately from the values to test.
 * https://github.com/stylelint/stylelint/blob/main/lib/utils/validateOptions.js
 * @param {import('stylelint').PostcssResult} result - postcss result
 * @param {string} ruleName
 * @param {RuleOptions[]} schema
 * @param {...any} optionValues
 * @return {boolean} Whether or not the options are valid (true = valid)
 */
const valid = (result, ruleName, schema, ...optionValues) => {
	const optionDescriptions = schema.options.map((s, i) => ({
		...s,
		actual: optionValues[i],
	}));

	return stylelint.utils.validateOptions(result, ruleName, ...optionDescriptions);
};

/**
 * Returns the default values for each item in the schema.
 * @param {RuleOptions[]} schema
 * @param {...any} optionValues
 * @returns {any[]}
 */
const defaults = (schema, ...optionValues) => {
	return schema.options.map((s, i) => {
		return optionValues[i] || s.default;
	});
};

const config = (result, ruleName, schema, ...optionValues) => {
	const isValid = valid(result, ruleName, schema, ...optionValues);
	const options = isValid ? defaults(schema, ...optionValues) : null;

	return {
		isValid,
		options,
		checkWrappedRule: (root, messages) => {
			stylelint.utils.checkAgainstRule(
				{
					ruleName: schema.wrappedRule.ruleName,
					ruleSettings: schema.wrappedRule.options.map((o) => {
						return Object.fromEntries(
							Object.entries(o).map(([k, path]) => {
								const value = path.reduce((val, subpath) => val[subpath], options);

								return [k, value];
							}),
						);
					}),

					// ruleSettings: [
					// 	{
					// 		'font-size': options[1].units,
					// 	},
					// ],
					root,
				},
				(warning) => {
					stylelint.utils.report({
						message: messages.expected(warning.node),
						ruleName,
						result,
						node: warning.node,
						line: warning.line,
						column: warning.column,
					});
				},
			);
		},
	};
};

const createWrappedRule = ({ messages, schema }) => {
	const rule = function (primary, secondary) {
		return (root, result) => {
			const { isValid, checkWrappedRule } = config(
				result,
				schema.ruleName,
				schema,
				primary,
				secondary,
			);

			if (!isValid || !primary) {
				return;
			}

			checkWrappedRule(root, messages);
		};
	};

	return Object.assign(rule, {
		ruleName: schema.ruleName,
		messages,
		schema,
		meta: {
			url: schema.docs.url,
		},
	});
};

module.exports = {
	valid,
	defaults,
	config,
	createWrappedRule,
};
