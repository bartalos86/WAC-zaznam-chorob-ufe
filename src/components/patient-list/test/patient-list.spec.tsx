import { newSpecPage } from '@stencil/core/testing';
import { PatientList } from '../patient-list';

describe('patient-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PatientList],
      html: `<patient-list></patient-list>`,
    });
    expect(page.root).toEqualHtml(`
      <patient-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </patient-list>
    `);
  });
});
