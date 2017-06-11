import { Events } from '@storefront/core';
import RecordCount from '../../src/record-count';
import suite from './_suite';

suite('RecordCount', ({ expect, spy }) => {
  let recordCount: RecordCount;

  beforeEach(() => recordCount = new RecordCount());

  describe('init()', () => {
    it('should listen for events', () => {
      const on = spy();
      recordCount.flux = <any>{ on };
      recordCount.expose = () => null;

      recordCount.init();

      expect(on).to.be.calledWith(Events.RECORD_COUNT_UPDATED, recordCount.updateRecordCount);
      expect(on).to.be.calledWith(Events.PAGE_UPDATED, recordCount.updatePageRange);
    });
  });

  describe('updateRecordCount()', () => {
    it('should set total', () => {
      const set = recordCount.set = spy();

      recordCount.updateRecordCount(47);

      expect(set).to.be.calledWith({ total: 47 });
    });
  });

  describe('updatePageRange()', () => {
    it('should set total', () => {
      const from = 30;
      const to = 50;
      const set = recordCount.set = spy();

      recordCount.updatePageRange(<any>{ from, to, a: 'b' });

      expect(set).to.be.calledWith({ to, from });
    });
  });
});
