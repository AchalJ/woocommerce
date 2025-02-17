/**
 * External Dependencies
 */
const { jestConfig } = require( '@automattic/puppeteer-utils' );
const { WC_E2E_SCREENSHOTS } = process.env;
const path = require( 'path' );
const fs = require( 'fs' );

/**
 * Internal Dependencies
 */
const { getAppRoot } = require( '../utils' );

const failureSetup = [];
if ( WC_E2E_SCREENSHOTS ) {
	failureSetup.push(
		path.resolve( __dirname, '../build/setup/jest.failure.js' )
	);
}
const setupFilesAfterEnv = [
	path.resolve( __dirname, '../build/setup/jest.setup.js' ),
	...failureSetup,
	'expect-puppeteer',
];

const appPath = getAppRoot();
const localJestSetupFile = path.resolve(
	appPath,
	'plugins/woocommerce/tests/e2e/config/jest.setup.js'
);
if ( fs.existsSync( localJestSetupFile ) ) {
	setupFilesAfterEnv.push( localJestSetupFile );
}

const combinedConfig = {
	...jestConfig,
	moduleNameMapper: {
		'@woocommerce/e2e/tests/(.*)': appPath + 'tests/e2e/$1',
	},

	setupFiles: [ '<rootDir>/config/env.setup.js' ],
	// A list of paths to modules that run some code to configure or set up the testing framework
	// before each test
	setupFilesAfterEnv,

	// Sort test path alphabetically. This is needed so that `activate-and-setup` tests run first
	testSequencer: '<rootDir>/config/jest-custom-sequencer.js',
	// Set the test timeout in milliseconds.
	testTimeout: parseInt( global.process.env.jest_test_timeout ),

	transformIgnorePatterns: [
		...jestConfig.transformIgnorePatterns,
		'node_modules/(?!(woocommerce)/)',
	],
	roots: [ appPath + 'tests/e2e/specs' ],
};

if ( process.env.jest_test_spec ) {
	combinedConfig.testMatch = [ process.env.jest_test_spec ];
}

module.exports = combinedConfig;
