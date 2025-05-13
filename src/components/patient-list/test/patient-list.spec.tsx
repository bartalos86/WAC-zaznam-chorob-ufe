import { newSpecPage } from '@stencil/core/testing';
import { PatientList } from '../patient-list';
import Patient from '../../../models/Patient';

describe('patient-list', () => {
  const mockPatients: Patient[] = [
    { id: 'P001', name: 'Jana Nováková', illnesses: [] },
    { id: 'P002', name: 'Anna Horváthová', illnesses: [] }
  ];

  it('renders with patient data', async () => {
    const page = await newSpecPage({
      components: [PatientList],
      html: `<patient-list></patient-list>`,
    })

    page.rootInstance.setTestPatients(mockPatients)
    await page.waitForChanges()

    const table = page.root.shadowRoot.querySelector('#patient-list')
    expect(table).toBeTruthy()

    const rows = page.root.shadowRoot.querySelectorAll('tbody tr')
    expect(rows.length).toBe(2)

    const firstPatientRow = rows[0]
    const cells = firstPatientRow.querySelectorAll('td')
    expect(cells[0].textContent).toBe('P-00')
    expect(cells[1].textContent).toBe('Jana Nováková')
  })

  it('emits entry-clicked event when a patient row button is clicked', async () => {
    const page = await newSpecPage({
      components: [PatientList],
      html: `<patient-list></patient-list>`,
    })

    page.rootInstance.setTestPatients(mockPatients);
    await page.waitForChanges();

    const eventSpy = jest.fn()
    page.root.addEventListener('entry-clicked', eventSpy)

    const button: HTMLButtonElement = page.root.shadowRoot.querySelector('tbody tr:first-child td.icon md-filled-icon-button')
    button.click()

    expect(eventSpy).toHaveBeenCalled()

    const eventDetail = JSON.parse(eventSpy.mock.calls[0][0].detail)
    expect(eventDetail).toEqual({
      path: './patient',
      queryParams: {
        name: 'Jana Nováková',
      }
    })
  })

  it('renders empty table when there are no patients', async () => {
    const page = await newSpecPage({
      components: [PatientList],
      html: `<patient-list></patient-list>`,
    })

    const component = page.rootInstance as PatientList
    component.patients = []
    await page.waitForChanges()

    const table = page.root.shadowRoot.querySelector('#patient-list')
    expect(table).toBeTruthy()

    const rows = page.root.shadowRoot.querySelectorAll('tbody tr')
    expect(rows.length).toBe(0)
  })
})
