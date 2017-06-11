import { alias, tag, Events, Store, Tag } from '@storefront/core';

@alias('recordCount')
@tag('gb-record-count', require('./index.html'))
class RecordCount {

  init() {
    this.flux.on(Events.RECORD_COUNT_UPDATED, this.updateRecordCount);
    this.flux.on(Events.PAGE_UPDATED, this.updatePageRange);
  }

  updateRecordCount = (total: number) => this.set({ total });

  updatePageRange = ({ from, to }: Store.Page) => this.set({ from, to });
}

interface RecordCount extends Tag<any, RecordCount.State> { }
namespace RecordCount {
  export interface State {
    from?: number;
    to?: number;
    total?: number;
  }
}

export default RecordCount;
