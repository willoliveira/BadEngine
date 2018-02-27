const gulp = require("gulp");
const gutil = require("gutil");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.js");

gulp.task('build-dev', ['webpack:build-dev'], function() {
    gulp.watch(['src/**/*'], ['webpack:build-dev']);
});

gulp.task('default', ['webpack:build-dev', 'webpack-dev-server']);

gulp.task('build', ['webpack:build']);


gulp.task('webpack:build', function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
	);

	webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('webpack:build-dev', function(callback) {
    // run webpack
	webpack(webpackConfig).run(function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('webpack-dev-server', function(callback) {

    new webpackDevServer(webpack(webpackConfig))
		.listen(8080, 'localhost', function(err) {
			if(err) throw new gutil.PluginError('webpack-dev-server', err);
			gutil.log('[webpack-dev-server]', 'localhost');
		});
});