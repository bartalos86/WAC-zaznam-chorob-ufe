import { newSpecPage } from '@stencil/core/testing';
import { RandomPatient } from '../random-patient';

describe('random-patient', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [RandomPatient],
      html: `<random-patient></random-patient>`,
    });
    expect(page.root).toEqualHtml(`
      <random-patient>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </random-patient>
    `);
  });
});
