import { newE2EPage } from '@stencil/core/testing';

describe('random-patient', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<random-patient></random-patient>');

    const element = await page.find('random-patient');
    expect(element).toHaveClass('hydrated');
  });
});
