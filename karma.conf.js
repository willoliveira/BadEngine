const WebpackConfig = require('./webpack.test.js');

module.exports = (config) => {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'src/**/*.spec.ts'
		],
		plugins: [
			'karma-jasmine',
			'karma-chrome-launcher',
			'karma-spec-reporter',
			'karma-jasmine-html-reporter',
			'karma-coverage-istanbul-reporter',
			'karma-webpack'
		],
		specReporter: {
			maxLogLines: 5,				// limit number of lines logged per test
			suppressErrorSummary: true,	// do not print error summary
			suppressFailed: false,		// do not print information about failed tests
			suppressPassed: false,		// do not print information about passed tests
			suppressSkipped: true,		// do not print information about skipped tests
			showSpecTiming: false		// print the time elapsed for each spec
		},
		client:{
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			reports: [ 'html', 'lcovonly' ],
			fixWebpackSourcePaths: true
		},
		reporters: ['spec'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: true,
		mime: {
			'test/x-typescript': ['ts']
		},
		preprocessors: {
		  'src/**/*.spec.ts': ['webpack']
		},
		webpack: WebpackConfig
	});
};
