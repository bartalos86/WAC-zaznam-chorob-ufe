import { Component, h, Host, State, Event, EventEmitter } from '@stencil/core';

type Patient = {
  id: string;
  name: string;
}

@Component({
  tag: 'patient-list',
  styleUrl: 'patient-list.css',
  shadow: true,
})
export class PatientList {
  @Event({ eventName: "entry-clicked"}) entryClicked: EventEmitter<string>;

  @State() patients: Patient[] = [
    { id: 'P001', name: 'Jana Nováková' },
    { id: 'P002', name: 'Peter Kovács' },
    { id: 'P003', name: 'Michaela Horváthová' },
    { id: 'P004', name: 'Martin Svoboda' },
    { id: 'P005', name: 'Zuzana Veselá' },
    { id: 'P006', name: 'Tomáš Nagy' },
    { id: 'P007', name: 'Katarína Tóthová' },
    { id: 'P008', name: 'Marek Balog' },
    { id: 'P009', name: 'Eva Kováčová' },
    { id: 'P010', name: 'Juraj Lukáč' },
  ]

  render() {
    function getEventDetail(patientID: string) {
      return JSON.stringify({
        path: './patient',
        queryParams: {
          id: patientID
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
              this.patients.map(p =>
                <tr>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td class='icon'>
                    <md-filled-icon-button class='button' onClick={ () => this.entryClicked.emit(getEventDetail(p.id))}>
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
