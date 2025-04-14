import { newSpecPage } from '@stencil/core/testing'
import { PatientList } from '../patient-list'

describe('patient-list', () => {
  it('renders with patient data', async () => {
    const page = await newSpecPage({
      components: [PatientList],
      html: `<patient-list></patient-list>`,
    })

    // Verify component rendered
    expect(page.root).toBeTruthy()
    
    // Check if the table is rendered
    const table = page.root.shadowRoot.querySelector('#patient-list')
    expect(table).toBeTruthy()
    
    // Check if the table has 10 patient rows (plus header)
    const rows = page.root.shadowRoot.querySelectorAll('tbody tr')
    expect(rows.length).toBe(10)
    
    // Verify first patient data is rendered correctly
    const firstPatientRow = rows[0]
    const cells = firstPatientRow.querySelectorAll('td')
    expect(cells[0].textContent).toBe('P001')
    expect(cells[1].textContent).toBe('Jana Nováková')
  })

  it('emits entry-clicked event when a patient row button is clicked', async () => {
    const page = await newSpecPage({
      components: [PatientList],
      html: `<patient-list></patient-list>`,
    })
    
    // Create a spy for the custom event
    const eventSpy = jest.fn()
    page.root.addEventListener('entry-clicked', eventSpy)
    
    // Get the button in the first row and click it
    const button: HTMLButtonElement = page.root.shadowRoot.querySelector('tbody tr:first-child td.icon md-filled-icon-button')
    button.click()
    
    // Verify the event was emitted
    expect(eventSpy).toHaveBeenCalled()
    
    // Check event detail is formatted correctly
    const eventDetail = JSON.parse(eventSpy.mock.calls[0][0].detail)
    expect(eventDetail).toEqual({
      path: './patient',
      queryParams: {
        id: 'P001'
      }
    })
  })

  it('renders empty table when there are no patients', async () => {
    const page = await newSpecPage({
      components: [PatientList],
      html: `<patient-list></patient-list>`,
    })
    
    // Manually set patients array to empty
    const component = page.rootInstance as PatientList
    component.patients = []
    await page.waitForChanges()
    
    // Check if table is still rendered but with no rows in tbody
    const table = page.root.shadowRoot.querySelector('#patient-list')
    expect(table).toBeTruthy()
    
    const rows = page.root.shadowRoot.querySelectorAll('tbody tr')
    expect(rows.length).toBe(0)
  })
})