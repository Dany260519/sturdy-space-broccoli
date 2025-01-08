const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

const { resetMultiplayerGame, CreateSelectorMultiplayer } = require('./script.js');

describe('resetMultiplayerGame', () => {
});
