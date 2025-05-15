import { newSpecPage } from '@stencil/core/testing';
import { TreatmentOverlay } from '../treatment-overlay';
import { Illness } from '../../../models/Illness';

describe('treatment-overlay', () => {
  const mockIllness: Illness = {
    id: 'illness-123',
    diagnosis: 'Flu',
    sl_from: '2025-05-01',
    sl_until: '2025-05-10',
    treatments: [{
      id: '1234-1234',
      name: 'TestTreatment',
      description: 'Lorem Ipsum',
      startDate: '2025-05-01',
      endDate: '2025-05-02'
    }],
  };

  it('renders with a diagnosis title', async () => {
    const page = await newSpecPage({
      components: [TreatmentOverlay],
      html: `<treatment-overlay patient-id="patient-1"></treatment-overlay>`,
      supportsShadowDom: true,
    });

    page.rootInstance.illness = mockIllness;
    await page.waitForChanges();

    expect(page.root.shadowRoot.textContent).toContain('Liečba pre Flu');
  });

  it('renders input fields and add button', async () => {
    const page = await newSpecPage({
      components: [TreatmentOverlay],
      html: `<treatment-overlay patient-id="patient-1"></treatment-overlay>`,
      supportsShadowDom: true,
    });

    page.rootInstance.illness = mockIllness;
    await page.waitForChanges();

    const inputs = page.root.shadowRoot.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(5); // name, description, start, end, hidden ID
    expect(page.root.shadowRoot.querySelector('button.proceed').textContent).toContain('Pridať');
  });

  it('validates empty input fields', async () => {
    const page = await newSpecPage({
      components: [TreatmentOverlay],
      html: `<treatment-overlay patient-id="patient-1"></treatment-overlay>`,
      supportsShadowDom: true,
    });

    page.rootInstance.illness = mockIllness;
    await page.waitForChanges();

    const button = page.root.shadowRoot.querySelector('button.proceed') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(page.root.shadowRoot.textContent).toContain('Meno liečby nesmie byť prázdne!');
    expect(page.root.shadowRoot.textContent).toContain('Popis liečby nesmie byť prázdny!');
  });
});
