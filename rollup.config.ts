/* eslint-disable import/no-extraneous-dependencies */
import typescript from "@rollup/plugin-typescript";
import livereload from "rollup-plugin-livereload";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const name = process.env.npm_package_name || "";
const watch = process.env.ROLLUP_WATCH;
const version = process.env.npm_package_version;

const banner = `
/*!
 * @package CheckoutAPI-spike v${version}
 */`;

export default {
	input: "./src/index.ts",
	output: [
		{
			file: `build/${name}.min.js`,
			format: "umd",
			name: "Payoneer",
			noConflict: true,
			sourcemap: watch,
			esModule: false,
			extend: true,
			banner,
			plugins: [terser({ toplevel: true, ecma: 5, keep_fnames: false, ie8: false })],
		},
		{
			file: `build/${name}.js`,
			format: "umd",
			name: "Payoneer",
			noConflict: true,
			sourcemap: watch,
			extend: true,
			esModule: false,
			banner,
		},
	],
	plugins: [
		watch && livereload(),
		typescript(),
		babel({
			exclude: "node_modules/**",
			babelHelpers: "bundled",
			presets: ["@babel/preset-env", "@babel/preset-typescript"],
		}),
		nodeResolve({ extensions: [".js", ".ts"] }),
		commonjs({
			include: "node_modules/**",
			extensions: [".js", ".ts"],
		}),
		json(),
	],
};
