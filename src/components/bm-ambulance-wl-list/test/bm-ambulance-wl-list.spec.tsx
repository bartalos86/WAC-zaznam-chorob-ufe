import { newSpecPage } from '@stencil/core/testing';
import { BmAmbulanceWlList } from '../bm-ambulance-wl-list';

describe('bm-ambulance-wl-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BmAmbulanceWlList],
      html: `<bm-ambulance-wl-list></bm-ambulance-wl-list>`,
    });
    expect(page.root).toEqualHtml(`
      <bm-ambulance-wl-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bm-ambulance-wl-list>
    `);
  });
});
