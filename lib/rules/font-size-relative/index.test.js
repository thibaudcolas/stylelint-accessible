const { messages, ruleName } = require('.');

testRule({
	ruleName,
	config: [true],

	accept: [
		{
			code: '.foo { font-size: 1rem; }',
		},
	],

	reject: [
		{
			code: '.foo { font-size: 16px; }',
			message: messages.expected('.foo1:focus'),
			line: 1,
			column: 3,
		},
	],
});
