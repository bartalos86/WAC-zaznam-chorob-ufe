import { newE2EPage } from '@stencil/core/testing'

describe('random-patient', () => {
  it('renders with patient data', async () => {
    const page = await newE2EPage({
      url: '/?id=P001'
    })

    await page.setContent('<random-patient></random-patient>')
    await page.waitForChanges()

    const patientName = await page.find('random-patient >>> h1')
    expect(patientName).toBeTruthy()
    expect(patientName.textContent).toBe('Ján Novák')
    
    const rows = await page.findAll('random-patient >>> table tbody tr')
    expect(rows.length).toBe(2)
  })

  it('emits entry-clicked event when back button is clicked', async () => {
    const page = await newE2EPage({
      url: '/?id=P001'
    })

    await page.setContent('<random-patient></random-patient>')
    await page.waitForChanges()
    
    const eventSpy = await page.spyOnEvent('entry-clicked')
    
    const backButton = await page.find('random-patient >>> md-filled-icon-button')
    await backButton.click()
    
    expect(eventSpy).toHaveReceivedEvent()
    
    const eventDetail = JSON.parse(eventSpy.firstEvent.detail)
    expect(eventDetail.path).toBe('/')
  })

  it('can edit illness end date', async () => {
    const page = await newE2EPage({
      url: '/?id=P001'
    })

    await page.setContent('<random-patient></random-patient>')
    await page.waitForChanges()
    
    const editButton = await page.find('random-patient >>> tbody tr:first-child td:nth-child(3) md-filled-icon-button')
    await editButton.click()
    await page.waitForChanges()
    
    const dateInput = await page.find('random-patient >>> tbody tr:first-child td:nth-child(3) input')
    expect(dateInput).toBeTruthy()

    await dateInput.type('2025-04-15')
    
    const confirmButton = await page.find('random-patient >>> tbody tr:first-child td:nth-child(3) md-filled-icon-button')
    await confirmButton.click()
    await page.waitForChanges()
    
    const dateInput2 = await page.find('random-patient >>> tbody tr:first-child td:nth-child(3) input')
    expect(dateInput2).toBeNull()
  })

  it('can delete an illness', async () => {
    const page = await newE2EPage({
      url: '/?id=P001'
    })

    await page.setContent('<random-patient></random-patient>')
    await page.waitForChanges()
    
    let rows = await page.findAll('random-patient >>> table tbody tr')
    const initialCount = rows.length

    const deleteButton = await page.find('random-patient >>> tbody tr:first-child td.icon md-filled-icon-button')
    await deleteButton.click()
    await page.waitForChanges()
    
    rows = await page.findAll('random-patient >>> table tbody tr')
    expect(rows.length).toBe(initialCount - 1)
  })
})