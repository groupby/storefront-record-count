import { alias, configurable, tag, Events, Selectors, Store, Tag } from '@storefront/core';

@configurable
@alias('recordCount')
@tag('gb-record-count', require('./index.html'))
class RecordCount {

  props: RecordCount.Props = {
    labels: {
      noResults: 'No results found'
    }
  };
  state: RecordCount.State = {
    query: Selectors.currentQuery(this.flux.store.getState())
  };

  init() {
    this.flux.on(Events.RECORD_COUNT_UPDATED, this.updateRecordCount);
    this.flux.on(Events.PAGE_UPDATED, this.updatePageRange);
    this.flux.on(Events.PRODUCTS_UPDATED, this.updateQuery);
  }

  updateRecordCount = (total: number) => this.set({ total });

  updatePageRange = ({ from, to }: Store.Page) => this.set({ from, to, hasResults: !!to });

  updateQuery = () => this.set({ query: Selectors.currentQuery(this.flux.store.getState()) });
}

interface RecordCount extends Tag<RecordCount.Props, RecordCount.State> { }
namespace RecordCount {
  export interface Props extends Tag.Props {
    labels?: {
      noResults?: string
    };
  }
  export interface State {
    from?: number;
    to?: number;
    hasResults?: boolean;
    total?: number;
    query?: string;
  }
}

export default RecordCount;
