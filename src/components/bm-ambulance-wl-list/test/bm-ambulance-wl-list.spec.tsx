import { newSpecPage } from '@stencil/core/testing';
import { BmAmbulanceWlList } from '../bm-ambulance-wl-list';

describe('bm-ambulance-wl-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BmAmbulanceWlList],
      html: `<bm-ambulance-wl-list></bm-ambulance-wl-list>`,
    });
    const wlList = page.rootInstance as BmAmbulanceWlList;
    const expectedPatients = wlList?.waitingPatients?.length

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedPatients);

  });
});
