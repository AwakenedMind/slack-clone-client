module.exports = {
	extends: ['airbnb', "airbnb/hooks"],
	plugins: ['react', 'jsx-ally', 'import'],
	rules: {'react/jsx-filename-extension'},
	globals: {
		document: 1,
	},
	parser: "babel-eslint",
	env: {
		browser: 1
	}
};
