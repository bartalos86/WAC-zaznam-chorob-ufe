import { Component, Host, h, Event, EventEmitter, State } from '@stencil/core';

type Patient = {
  id: string,
  name: string,
  ilnesses: {
    id: string,
    diagnosis: string,
    sickLeaveFrom: string,
    sickLeaveUntil: string
  }[]
}

@Component({
  tag: 'random-patient',
  styleUrl: 'random-patient.css',
  shadow: true,
})
export class RandomPatient {
  @Event({ eventName: "entry-clicked"}) entryClicked: EventEmitter<string>

  @State() patient: Patient

  componentWillLoad() {
    const url = new URL(window.location.href)
    const patientID = url.searchParams.get('id')

    if (!patientID) {
      console.warn("No 'id' query parameter found in URL.")
      return
    }
    // fetch the damn user

    this.patient = {
      id: "P001",
      name: "Ján Novák",
      ilnesses: [
        {
          id: "I001",
          diagnosis: "Chrípka",
          sickLeaveFrom: "2025-04-01",
          sickLeaveUntil: "2025-04-07"
        },
        {
          id: "I002",
          diagnosis: "Zlomená noha",
          sickLeaveFrom: "2025-03-15",
          sickLeaveUntil: "2025-03-30"
        }
      ]
    }
  }

  deleteIllness(id: string) {
    return () => {
      //call backen

      this.patient = {
        ...this.patient,
        ilnesses: this.patient.ilnesses.filter(i => i.id !== id)
      }
    }
  }

  render() {
    function getEventDetail() {
      return JSON.stringify({
        path: '/'
      })
    }

    return (
      <Host>
        <md-filled-icon-button onClick={ () => this.entryClicked.emit(getEventDetail())}>
          <md-icon>arrow_back</md-icon>
        </md-filled-icon-button>
        <h1>{this.patient.name}</h1>

        <table>
          <thead>
            <tr>
              <th>Diagnóza</th>
              <th>PN Od</th>
              <th>PN Do</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              this.patient.ilnesses.map(i =>
                <tr data-id={i.id}>
                  <td>{i.diagnosis}</td>
                  <td>{i.sickLeaveFrom}</td>
                  <td>{i.sickLeaveUntil}</td>
                  <td class='icon'>
                    <md-filled-icon-button class='button' onClick= {this.deleteIllness(i.id)}>
                      <md-icon>delete</md-icon>
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
