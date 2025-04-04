import { newE2EPage } from '@stencil/core/testing';

describe('cv1-zaznam-chorob-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<cv1-zaznam-chorob-app></cv1-zaznam-chorob-app>');

    const element = await page.find('cv1-zaznam-chorob-app');
    expect(element).toHaveClass('hydrated');
  });
});
