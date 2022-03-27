const { ruleName, schema } = require('.');

schema.tests.forEach((suite) => {
	testRule({
		ruleName,
		...suite,
	});
});
