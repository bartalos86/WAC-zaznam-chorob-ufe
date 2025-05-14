import { newSpecPage } from '@stencil/core/testing';
import { RandomPatient } from '../random-patient';
import {Patient} from '../../../models/Patient';

describe('random-patient', () => {
  const mockPatient: Patient = {
    id: 'patient-1234',
    name: 'Ján Novák',
    illnesses: [{
      id: 'illness-123',
      diagnosis: 'Flu',
      sl_from: '2025-05-01',
      sl_until: '2025-05-10',
      treatments: [],
    }],
    medications: [{
      id: 'medication-001',
      name: 'Aspirin',
      sideEffects: 'Nausea, stomach pain'
    }]
  };

  it('renders with patient data and allows adding new illness', async () => {
    const page = await newSpecPage({
      components: [RandomPatient],
      html: `<random-patient test></random-patient>`,
      supportsShadowDom: true,
    })

    page.rootInstance.setTestPatient(mockPatient);
    await page.waitForChanges();

    const name = page.root.shadowRoot.querySelector('h1');
    expect(name.textContent).toBe('Ján Novák');

    const cells = page.root.shadowRoot.querySelectorAll('tbody tr td');

    expect(cells[0].textContent).toBe('Flu');
    expect(cells[1].textContent).toBe('2025-05-01');
    expect(cells[2].textContent).toContain('2025-05-10');

    const addButton = page.root.shadowRoot.querySelector('md-filled-icon-button.show_form') as HTMLButtonElement;
    addButton.click();
    await page.waitForChanges();

    const diagnosisInput = page.root.shadowRoot.querySelector('#diagnosis') as HTMLInputElement;
    diagnosisInput.value = 'Cold';
    const fromInput = page.root.shadowRoot.querySelector('#sl-from') as HTMLInputElement;
    fromInput.value = '2025-06-01';
    const untilInput = page.root.shadowRoot.querySelector('#sl-until') as HTMLInputElement;
    untilInput.value = '2025-06-10';

    const submitButton = page.root.shadowRoot.querySelector('md-outlined-button.add_illness') as HTMLButtonElement;
    submitButton.click();
    await page.waitForChanges();

    expect(page.rootInstance.patient.illnesses.length).toBeGreaterThanOrEqual(1);
  });

  it('allows deleting an illness', async () => {
    const page = await newSpecPage({
      components: [RandomPatient],
      html: `<random-patient></random-patient>`,
      supportsShadowDom: true,
    });

    page.rootInstance.setTestPatient(mockPatient);
    await page.waitForChanges();

    const deleteButton = page.root.shadowRoot.querySelector('.delete-illness') as HTMLButtonElement;
    deleteButton.click();
    await page.waitForChanges();

    expect(page.rootInstance.patient.illnesses.length).toBeLessThanOrEqual(1);
  });
});
