import { newSpecPage } from '@stencil/core/testing'
import { PatientApp } from '../patient-app'

describe('patient-app', () => {
  it('renders with default path', async () => {
    const originalNavigation = window.navigation;
    window.navigation = {
      addEventListener: jest.fn(),
      navigate: jest.fn()
    }

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
      },
      writable: true
    })

    const page = await newSpecPage({
      components: [PatientApp],
      html: `<patient-app></patient-app>`,
    })

    // Verify component rendered
    expect(page.root).toBeTruthy()

    // Check if the state is set correctly
    const patientApp = page.rootInstance as PatientApp
    expect(patientApp.element).toBe('list')

    // Clean up
    window.navigation = originalNavigation
  })

  it('renders patient element when path is patient', async () => {
    // Mock window.navigation
    const originalNavigation = window.navigation
    window.navigation = {
      addEventListener: jest.fn(),
      navigate: jest.fn()
    }

    // Mock location with /patient path
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/patient',
      },
      writable: true
    })

    const page = await newSpecPage({
      components: [PatientApp],
      html: `<patient-app base-path="/"></patient-app>`,
    })

    const patientApp = page.rootInstance as PatientApp
    expect(patientApp.element).toBe('patient')

    // Clean up
    window.navigation = originalNavigation
  })
})