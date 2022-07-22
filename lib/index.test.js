const rules = require('./index');

rules.forEach((plugin) => {
	plugin.rule.schema.tests.forEach(testRule);
});

describe('rules', () => {
	test('ruleNames start with accessible/', () => {
		expect(rules.every((r) => r.ruleName.startsWith('accessible/'))).toBe(true);
	});

	test('are stable', () => {
		expect(rules.map((r) => r.ruleName)).toMatchInlineSnapshot(`
		Array [
		  "accessible/no-outline-none",
		  "accessible/font-size-relative",
		  "accessible/no-text-align-justify",
		  "accessible/no-float",
		  "accessible/no-forced-color-adjust-none",
		  "accessible/no-text-overflow-ellipsis",
		]
	`);
	});
});
