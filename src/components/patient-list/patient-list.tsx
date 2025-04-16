import { Component, h, Host, State, Event, EventEmitter } from '@stencil/core';
import AXIOS_INSTANCE from '../../api/axios_instance';
import Patient from '../../models/Patient';


@Component({
  tag: 'patient-list',
  styleUrl: 'patient-list.css',
  shadow: true,
})
export class PatientList {
  @Event({ eventName: "entry-clicked"}) entryClicked: EventEmitter<string>;

  @State() patients: Patient[] = [
    { id: 'P001', illnesses: [], name: 'Jana Nováková' },
    { id: 'P002', illnesses: [], name: 'Peter Kovács' },
    { id: 'P003', illnesses: [], name: 'Michaela Horváthová' },
    { id: 'P004', illnesses: [], name: 'Martin Svoboda' },
    { id: 'P005', illnesses: [], name: 'Zuzana Veselá' },
    { id: 'P006', illnesses: [], name: 'Tomáš Nagy' },
    { id: 'P007', illnesses: [], name: 'Katarína Tóthová' },
    { id: 'P008', illnesses: [], name: 'Marek Balog' },
    { id: 'P009', illnesses: [], name: 'Eva Kováčová' },
    { id: 'P010', illnesses: [], name: 'Juraj Lukáč' },
  ]

  async componentWillLoad() {
    try {
      type data = {
        message: string,
        patients: Patient[],
        status: string
      }
      const response = await AXIOS_INSTANCE.get<data>('/patients')

      this.patients = response.data.patients
    } catch (e: unknown) {
        console.log(`Unfortunate`)
        console.error(e)
    } 
  }

  render() {
    function getEventDetail(patientName: string) {
      return JSON.stringify({
        path: './patient',
        queryParams: {
          name: patientName
        }
      })
    }

    return (
      <Host>
        <table id='patient-list'>
          <thead>
            <tr>
              <th>ID pacienta</th>
              <th>Meno pacienta</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              this.patients.map((p, i) =>
                <tr>
                  <td>{`P-0${i}`}</td>
                  <td>{p.name}</td>
                  <td class='icon'>
                    <md-filled-icon-button class='button' onClick={ () => this.entryClicked.emit(getEventDetail(p.name))}>
                      <md-icon>arrow_forward</md-icon>
                    </md-filled-icon-button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </Host>
    );
  }
}
