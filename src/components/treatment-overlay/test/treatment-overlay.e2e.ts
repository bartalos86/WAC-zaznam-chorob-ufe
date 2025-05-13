import { newE2EPage } from '@stencil/core/testing';

describe('treatment-overlay', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<treatment-overlay></treatment-overlay>');

    const element = await page.find('treatment-overlay');
    expect(element).toHaveClass('hydrated');
  });
});
