/* eslint-env node */

//@ts-check
'use strict';

const Typescript = require('typescript');
const typescriptPlugin = require('rollup-plugin-typescript');
const uppercamelcase = require('uppercamelcase');

const Package = require('./package.json');

module.exports = [
    {
        input: 'src/index.ts',
        output: {
            file: Package['main'],
            format: 'umd',
            name: uppercamelcase(Package['name']),
            sourcemap: true,
        },
        plugins: [
            typescriptPlugin({
                target: 'ES2015',
                typescript: Typescript,
            }),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            file: Package['module'],
            format: 'es',
            name: Package['name'],
            sourcemap: true,
        },
        plugins: [
            typescriptPlugin({
                target: 'ES2018',
                typescript: Typescript,
            }),
        ],
    },
];
