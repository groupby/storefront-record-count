import { Events, Selectors } from '@storefront/core';
import RecordCount from '../../src/record-count';
import suite from './_suite';

const QUERY = 'eyyo';
const STATE = { a: 'b' };

suite('RecordCount', ({ expect, stub, spy, itShouldBeConfigurable, itShouldHaveAlias }) => {
  let recordCount: RecordCount;
  let currentQuery: sinon.SinonStub;

  beforeEach(() => {
    currentQuery = stub(Selectors, 'currentQuery').returns(QUERY);
    RecordCount.prototype.flux = <any>{ store: { getState: () => STATE } };
    recordCount = new RecordCount();
  });

  itShouldBeConfigurable(RecordCount);
  itShouldHaveAlias(RecordCount, 'recordCount');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set default props', () => {
        expect(recordCount.props).to.eql({ labels: { noResults: 'No results found' } });
      });
    });

    describe('state', () => {
      it('should set default state', () => {
        expect(recordCount.state).to.eql({ query: QUERY });
      });
    });
  });

  describe('init()', () => {
    it('should listen for events', () => {
      const on = spy();
      recordCount.flux = <any>{ on, store: { getState: () => null } };
      recordCount.state = {};

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

      expect(set).to.be.calledWith({ to, from, hasResults: true });
    });
  });

  describe('updateQuery()', () => {
    it('should set query', () => {
      const set = recordCount.set = spy();
      const getState = spy();
      recordCount.flux = <any>{ store: { getState } };

      recordCount.updateQuery();

      expect(getState).to.be.called;
      expect(set).to.be.calledWith({ query: QUERY });
    });
  });
});
