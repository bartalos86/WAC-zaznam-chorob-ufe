import { newE2EPage } from '@stencil/core/testing';

describe('patient-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<patient-list></patient-list>');

    const element = await page.find('patient-list');
    expect(element).toHaveClass('hydrated');
  });
});
