import { newE2EPage } from '@stencil/core/testing';

describe('bm-ambulance-wl-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bm-ambulance-wl-app></bm-ambulance-wl-app>');

    const element = await page.find('bm-ambulance-wl-app');
    expect(element).toHaveClass('hydrated');
  });
});
