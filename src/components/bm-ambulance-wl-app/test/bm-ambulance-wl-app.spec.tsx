import { newSpecPage } from '@stencil/core/testing';
import { BmAmbulanceWlApp } from '../bm-ambulance-wl-app';

describe('bm-ambulance-wl-app', () => {

  it('renders editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [BmAmbulanceWlApp],
      html: `<bm-ambulance-wl-app base-path="/"></bm-ambulance-wl-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual ("bm-ambulance-wl-editor");

  });

  it('renders list', async () => {
    const page = await newSpecPage({
      url: `http://localhost/ambulance-wl/`,
      components: [BmAmbulanceWlApp],
      html: `<bm-ambulance-wl-app base-path="/ambulance-wl/"></bm-ambulance-wl-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual("bm-ambulance-wl-list");
  });
});
