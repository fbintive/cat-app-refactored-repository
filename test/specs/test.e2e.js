// import { expect, $, browser } from '@wdio/globals';
/* eslint-disable no-undef */
require('@wdio/globals');

describe('Electron Testing', () => {
  it('Should get proper app title', async () => {
    await expect(browser).toHaveTitle('(Not just)Daily cat fact app');
  });
  it('Should get proper header text', async () => {
    await expect($('h1')).toHaveTextContaining('Get you random daily cat fact');
  });
});
/* eslint-enable no-undef */
