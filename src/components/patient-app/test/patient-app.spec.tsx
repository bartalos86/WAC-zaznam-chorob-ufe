import { newSpecPage } from '@stencil/core/testing';
import { PatientApp } from '../patient-app';

describe('patient-app', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PatientApp],
      html: `<patient-app></patient-app>`,
    });
    expect(page.root).toEqualHtml(`
      <patient-app>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </patient-app>
    `);
  });
});
