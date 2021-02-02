const join = require("path").join;
const CopyPlugin = require("copy-webpack-plugin");
const buildDir = join(__dirname, "build");

module.exports = {
	entry: join(__dirname, "src/Game.ts"),
	output: {
		path: buildDir,
		filename: "vibration.js",
		library: "vibe",
	},
	module: {
		rules: [ { test: /\.ts$/, use: "ts-loader" }]
	},
	resolve: {
		extensions: [ ".ts", ".js" ]
	},
	plugins: [
		new CopyPlugin([
			{ from: join(__dirname, "www"), to: buildDir }
		])
	],
	externals: {
		phaser: "Phaser"
	}
}