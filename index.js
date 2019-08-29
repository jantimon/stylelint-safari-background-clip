const stylelint = require('stylelint');

const ruleName = 'plugin/stylelint-safari-background-clip';
const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: function expected(className, selector, displayValue) {
		return `Expected "${selector}" ("${className}") not to include "${displayValue}" and "background-clip" at the same time. Please see https://bugs.webkit.org/show_bug.cgi?id=169125`;
	},
});

module.exports = stylelint.createPlugin(ruleName, (options) => {
	return (root, result) => {
		let results = {};
		root.walkRules((rule) => {
			const className = getMostInnerClassNameFromSelector(rule);
			console.log(rule.selector, ' >>>', className)
			if (!className) {
				return;
			}
			results[className] = results[className] || {
				displayValues: {},
				hasBackgroundClip: false,
			};
			rule.walkDecls((decl) => {
				if (decl.parent !== rule) {
					return;
				}
				const { prop, value } = decl;
				if (prop === 'display') {
					results[className].displayValues[value] = rule;
				}
				if (prop === 'background-clip' && value === 'text') {
					results[className].hasBackgroundClip = decl;
				}
			});
		});
		const foundClassNames = Object.keys(results);
		foundClassNames.forEach((className) => {
			const resultForClassName = results[className];
			const displayValues = resultForClassName.displayValues;
			const hasBackgroundClip = resultForClassName.hasBackgroundClip;
			const isUsingFlex = displayValues.flex || displayValues['inline-flex'];
			if (!hasBackgroundClip || !isUsingFlex) {
				return;
			}
			const decl = hasBackgroundClip;
			const rule = getParentRule(decl);
			const selector = rule ? rule.selector : '';
			stylelint.utils.report({
				ruleName,
				result,
				node: decl,
				message: messages.expected(className, selector, displayValues.flex ? 'flex' : 'inline-flex'),
			});
		});
	};
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;

function getMostInnerClassNameFromSelector(rule) {
	const selector = rule.selector;
	const selectorWithoutInteractivePseudoClasses = selector.replace(/:([a-z]+)/gi, (_, pseudo) => {
		return pseudo === 'before' || pseudo === 'after' ? ':' + pseudo : '';
	});
	const ruleMatches = selectorWithoutInteractivePseudoClasses.match(/(\.[a-z0-9\-\_]+|&)(|:after|:before)\s*$/i);
	if (!ruleMatches) {
		return;
	}
	const [fullMatch, innerSelector, pseudo] = ruleMatches;
	// Try to replace & with the parent rule selector
	if (innerSelector === '&') {
		const parent = getParentRule(rule);
		// Stop if we can not find a parent (e.g. inside a mixin)
		if (!parent) {
			return;
		}
		const parentMostInnerClassName = getMostInnerClassNameFromSelector(parent);
		// Stop if the recusive call to resolve the & replacement failed
		if (!parentMostInnerClassName) {
			return;
		}
		return parentMostInnerClassName + pseudo

	}
	// Return a class e.g. .my-class or .my-class:before
	return fullMatch;
}

function getParentRule(decl) {
	const parent = decl.parent;
	if (parent && parent.type === 'rule') {
		return parent;
	}
	if (parent) {
		return getParentRule(parent);
	}
}
