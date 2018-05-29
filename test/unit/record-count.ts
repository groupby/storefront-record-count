import { Events, Selectors } from '@storefront/core';
import RecordCount from '../../src/record-count';
import suite from './_suite';

const QUERY = 'eyyo';

suite('RecordCount', ({ expect, stub, spy, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let recordCount: RecordCount;
  let select: sinon.SinonSpy;

  beforeEach(() => {
    select = RecordCount.prototype.select = spy(() => QUERY);
    RecordCount.prototype.flux = <any>{};
    recordCount = new RecordCount();
  });

  afterEach(() => {
    delete RecordCount.prototype.select;
  });

  itShouldBeConfigurable(RecordCount);
  itShouldProvideAlias(RecordCount, 'recordCount');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set default props', () => {
        expect(recordCount.props).to.eql({ labels: { noResults: 'No results found' } });
      });
    });

    describe('state', () => {
      it('should set default state', () => {
        expect(recordCount.state).to.eql({
          query: QUERY,
          total: QUERY,
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for events', () => {
      const subscribe = (recordCount.subscribe = spy());
      recordCount.updatePageRange = () => null;
      recordCount.updateRecordCount = () => null;
      recordCount.updateQuery = () => null;

      recordCount.init();

      expect(subscribe).to.be.calledWith(Events.RECORD_COUNT_UPDATED, recordCount.updateRecordCount);
      expect(subscribe).to.be.calledWith(Events.PAGE_UPDATED, recordCount.updatePageRange);
    });
  });

  describe('onBeforeMount()', () => {
    it('should call updatePageRange', () => {
      const updatePageRange = (recordCount.updatePageRange = spy());

      recordCount.onBeforeMount();

      expect(updatePageRange).to.be.calledOnce;
      expect(select).to.be.calledWithExactly(Selectors.pageObject);
    });
  });

  describe('updateRecordCount()', () => {
    it('should set total', () => {
      const set = (recordCount.set = spy());

      recordCount.updateRecordCount(47);

      expect(set).to.be.calledWith({ total: 47 });
    });
  });

  describe('updatePageRange()', () => {
    it('should set total', () => {
      const from = 30;
      const to = 50;
      const set = (recordCount.set = spy());

      recordCount.updatePageRange(<any>{ from, to, a: 'b' });

      expect(set).to.be.calledWith({ to, from, hasResults: true });
    });
  });

  describe('updateQuery()', () => {
    it('should set query', () => {
      const set = (recordCount.set = spy());

      recordCount.updateQuery();

      expect(select).to.be.calledWith(Selectors.currentQuery);
      expect(set).to.be.calledWith({ query: QUERY });
    });
  });
});
