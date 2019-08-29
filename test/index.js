const testRule = require('stylelint-test-rule-tape');
const plugin = require('..');

testRule(plugin.rule, {
	ruleName: plugin.ruleName,
	config: true,
	skipBasicChecks: true,

	accept: [
		{
			code: '.a-block { display: flex }',
		},
		{
			code: '.a-block { display: inline-flex }',
		},
		{
			code: '.a-block { background-clip: text }',
		},
	],

	reject: [
		{
			code: '.a-block { display: flex; background-clip: text; }',
			message:
				'Expected ".a-block" (".a-block") not to include "flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
		{
			code: '.a-block { display: inline-flex; background-clip: text; }',
			message:
				'Expected ".a-block" (".a-block") not to include "inline-flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
		{
			code: '.a-block { display: inline-flex; } .a-block { background-clip: text; }',
			message:
				'Expected ".a-block" (".a-block") not to include "inline-flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
		{
			code: '.a-block { display: inline-flex; } .wrapper .a-block { background-clip: text; }',
			message:
				'Expected ".wrapper .a-block" (".a-block") not to include "inline-flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
		{
			code: '.a-block { display: inline-flex; } .a-block:hover { background-clip: text; }',
			message:
				'Expected ".a-block:hover" (".a-block") not to include "inline-flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
		{
			code: '.a-block { display: inline-flex; } .a-block:focus { background-clip: text; }',
			message:
				'Expected ".a-block:focus" (".a-block") not to include "inline-flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
		{
			code: '.a-block { display: inline-flex; } .a-block { &:focus { background-clip: text; } }',
			message:
				'Expected "&:focus" (".a-block") not to include "inline-flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
		{
			code: '.a-block { &:before { display: inline-flex; } } .a-block { &:focus:before { background-clip: text; } }',
			message:
				'Expected "&:focus:before" (".a-block:before") not to include "inline-flex" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125 (plugin/stylelint-safari-background-clip)',
		},
	],
});
