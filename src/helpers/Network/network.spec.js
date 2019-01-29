import Network from './index.js';
import cordovaMocks from '@/cordovaMocks';
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.window = window;
global.document = window.document;
let networkInstance;

beforeEach(() => {
  cordovaMocks.initMocks();
  networkInstance = new Network();
});
afterEach(() => cordovaMocks.destroyMocks());

describe('helpers/Network', () => {
  it('exports a function', () => {
    expect(typeof Network === 'function').toBe(true);
  });

  it('creates event listeners and sets navigator.conneciton on itself upon instantiation', (done) => {
    expect(networkInstance.connection).toBeTruthy();

    const onlineCallbackMock = jest.fn();
    const offlineCallbackMock = jest.fn(() => done());

    networkInstance.on('online', onlineCallbackMock);
    networkInstance.on('offline', offlineCallbackMock);

    document.dispatchEvent(new Event('online'));
    document.dispatchEvent(new Event('offline'));

    expect(onlineCallbackMock).toHaveBeenCalled();
    expect(offlineCallbackMock).toHaveBeenCalled();
  });

  it('gives you a correct Boolean when isOnline() method is called', () => {
    expect(networkInstance.connection.type).toBe('wifi');
    expect(networkInstance.isOnline()).toBe(true);
    networkInstance.connection.type = 'none';
    expect(networkInstance.isOnline()).toBe(false);
  });
});
