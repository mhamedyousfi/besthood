'use strict';

describe('Donates E2E Tests:', function () {
  describe('Test Donates page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/donates');
      expect(element.all(by.repeater('donate in donates')).count()).toEqual(0);
    });
  });
});
