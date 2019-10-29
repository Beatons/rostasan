/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import express from 'express';
import { join } from 'path';
import {readFileSync} from 'fs';
import {renderModuleFactory} from '@angular/platform-server';
import {REQUEST, RESPONSE} from '@nguniversal/express-engine/tokens';
import {enableProdMode, ValueProvider} from '@angular/core';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
export const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, provideModuleMap } = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', (_, options, callback) => {
	console.log('html engine');
	renderModuleFactory(AppServerModuleNgFactory, {
		// Our index.html
		document: template,
		url: options.req.url,
		// DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
		extraProviders:
			[
				provideModuleMap(LAZY_MODULE_MAP),
				<ValueProvider>{
					provide: REQUEST,
					useValue: options.req,
				},
				<ValueProvider>{
					provide: RESPONSE,
					useValue: options.req.res,
				},
			],
	}).then(html => {
		console.log('callback');
		callback(null, html);
	});
});

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

app.get('/', (req, res) => {
	res.sendFile(join(DIST_FOLDER, 'index.html'), {req});
});

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render( join(DIST_FOLDER,'index.html'), { req });
});

if (!process.env.FUNCTION_NAME) {
	app.listen(PORT, () => {
		console.log(`Node server listening on http://localhost:${PORT}`);
	});
}
