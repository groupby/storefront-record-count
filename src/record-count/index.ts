import { configurable, provide, tag, Events, Selectors, Store, Tag } from '@storefront/core';

@configurable
@provide('recordCount')
@tag('gb-record-count', require('./index.html'))
class RecordCount {
  props: RecordCount.Props = {
    labels: {
      noResults: 'No results found',
    },
  };
  state: RecordCount.State = {
    total: this.select(Selectors.recordCount),
    query: this.select(Selectors.currentQuery),
  };

  init() {
    this.subscribe(Events.RECORD_COUNT_UPDATED, this.updateRecordCount);
    this.subscribe(Events.PAGE_UPDATED, this.updatePageRange);
    this.subscribe(Events.PRODUCTS_UPDATED, this.updateQuery);

    // force update on start to avoid race condition issues
    // total and query already set in constructor
    this.updatePageRange(this.select(Selectors.pageObject));
  }

  updateRecordCount = (total: number) => this.set({ total });

  updatePageRange = ({ from, to }: Store.Page) => this.set({ from, to, hasResults: !!to });

  updateQuery = () => this.set({ query: this.select(Selectors.currentQuery) });
}

interface RecordCount extends Tag<RecordCount.Props, RecordCount.State> {}
namespace RecordCount {
  export interface Props extends Tag.Props {
    labels?: {
      noResults?: string;
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
