import { newE2EPage } from '@stencil/core/testing';

describe('patient-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<patient-app></patient-app>');

    const element = await page.find('patient-app');
    expect(element).toHaveClass('hydrated');
  });
});
