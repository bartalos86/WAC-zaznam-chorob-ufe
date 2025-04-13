import { Component, Host, h, Event, EventEmitter, State } from '@stencil/core';

type Patient = {
  id: string,
  name: string,
  illnesses: {
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
  @State() isAdding = false
  @State() edit = {
    isActive: false,
    id: ''
  }

  private diagnosisInput: HTMLInputElement
  private fromInput: HTMLInputElement
  private untilInput: HTMLInputElement


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
      illnesses: [
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

  toggleAdd() {
    this.isAdding = !this.isAdding
  }

  toggleEdit(id: string = null) {
    const active = !this.edit.isActive
    this.edit = {
      isActive: active,
      id: id
    }
  }

  async addIllness(e: Event) {
    e.preventDefault()

    const diagnosis = this.diagnosisInput.value
    const from = this.fromInput.value
    const until = this.untilInput.value


    this.patient = {
      ...this.patient,
      illnesses: [
        ...this.patient.illnesses,
        {
          id: `I${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          diagnosis,
          sickLeaveFrom: from,
          sickLeaveUntil: until,
        }
      ]
    }


    this.diagnosisInput.value = ""
    this.fromInput.value = ""
    this.untilInput.value = ""

    this.toggleAdd()
  }

  async editIllness(e: Event) {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const input = form.querySelector('input')
    const date = input.value
    const id = input.dataset.id

    // call backend

    const illness = this.patient.illnesses.find(i => i.id === id)
    if ( !illness ) {
      this.toggleEdit()
      return
    }

    illness.sickLeaveUntil = date
    this.toggleEdit()
  }


  deleteIllness(id: string) {
    return async () => {
      //call backend

      this.patient = {
        ...this.patient,
        illnesses: this.patient.illnesses.filter(i => i.id !== id)
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
              <th>Začiatok PN</th>
              <th>Koniec PN</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              this.patient.illnesses.map(i =>
                <tr data-id={i.id}>
                  <td>{i.diagnosis}</td>
                  <td>{i.sickLeaveFrom}</td>
                  <td>
                    {
                      this.edit.isActive && this.edit.id === i.id ?
                        <form onSubmit={this.editIllness.bind(this)}>
                          <input type='date' required data-id={i.id} />
                          <div>
                            <md-filled-icon-button>
                              <md-icon>check_circle</md-icon>
                            </md-filled-icon-button>
                            <md-filled-icon-button type='reset' onClick={() => this.toggleEdit()}>
                              <md-icon>cancel</md-icon>
                            </md-filled-icon-button>
                          </div>
                        </form> :
                        <>
                          {i.sickLeaveUntil}
                          <md-filled-icon-button onClick={() => this.toggleEdit(i.id)}>
                            <md-icon>edit</md-icon>
                          </md-filled-icon-button>
                        </>
                    }
                  </td>
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

        {
          this.isAdding ?
            <form onSubmit={this.addIllness.bind(this)}>
              <h>
                Pridať chorobu pre pacienta
              </h>
              <md-outlined-text-field label="Diagnóza" id='diagnosis' required ref={e => this.diagnosisInput = e}></md-outlined-text-field>
              Začiatok PN:
              <input type='date' id='sl-from' required ref={e => this.fromInput = e}></input>
              Koniec PN:
              <input type='date' id='sl-until' required ref={e => this.untilInput = e}></input>

              <div>
                <md-outlined-button>Submit</md-outlined-button>
                <md-outlined-button type='reset' onClick={() => this.toggleAdd()}>Zrušiť</md-outlined-button>
              </div>
            </form> :
            <md-filled-icon-button onClick={() => this.toggleAdd()}>
              <md-icon>add</md-icon>
            </md-filled-icon-button>
        }
      </Host>
    );
  }
}
