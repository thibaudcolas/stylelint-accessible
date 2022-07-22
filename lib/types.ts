// To use this:
// /** @typedef { import("./types").RuleSchema } RuleSchema */

interface WrappedRuleOption {
	[key: string]: (number | string)[];
}

interface WrappedRule {
	ruleName: string;
	options: WrappedRuleOption[];
}

interface SecondaryRuleOption {
	possible: {
		[key: string]: any[];
	};
	optional: boolean;
	default: {
		[key: string]: any;
	};
}

interface TestCase {
	description: string;
	code: string;
	demo?: boolean;
	message: string;
	line: number;
	column: number;
}

interface TestSuite {
	config: [any] | [any, { [key: string]: any }];
	accept: TestCase[];
	reject: TestCase[];
}

export interface RuleSchema {
	ruleName: string;
	wrappedRule: WrappedRule;
	options: [any, SecondaryRuleOption];
	docs: {
		description: string;
		url: string;
		impact: 'Serious' | 'Moderate' | 'Low';
		resources: string[];
	};
	messages: { [key: string]: string };
	tests: TestSuite[];
}
