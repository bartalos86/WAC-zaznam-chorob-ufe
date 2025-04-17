import { Component, Host, h, Event, EventEmitter, State } from '@stencil/core';
import Patient from '../../models/Patient';
import AXIOS_INSTANCE from '../../api/axios_instance';
import Illness from '../../models/Illness';

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


  async componentWillLoad() {
    const url = new URL(window.location.href)
    const patientName = url.searchParams.get('name')

    if (!patientName) {
      console.warn("No 'name' query parameter found in URL.")
      return
    }
    // fetch the damn user

    try {
      type data = {
        message: string,
        patients: Patient[],
        status: string
      }

      const response = await AXIOS_INSTANCE.get<data>(`/patients?name=${patientName}`)
      if ( response.data.patients.length != 1 ) {
        console.log('Unfortunate')
        return
      } 
      this.patient = response.data.patients.at(0)
    } catch(e: unknown) {
      console.log('unfortunate again')
      console.error(e)
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

    const illness = {
      diagnosis: this.diagnosisInput.value,
      sl_from: this.fromInput.value,
      sl_until: this.untilInput.value,
      id: null
    }

    try {
      const response = await AXIOS_INSTANCE.post<Illness>(`/patients/${this.patient.id}/illnesses`, {
        diagnosis: illness.diagnosis,
        sl_from: illness.sl_from,
        sl_until: illness.sl_until
      })

      illness.id = response.data.id
    } catch(e: unknown) {
      console.log('unfortunate again but you keep trying')
      console.error(e)
    }

    this.patient = {
      ...this.patient,
      illnesses: [
        ...this.patient.illnesses,
        illness
      ]
    }

    this.toggleAdd()
  }

  async editIllness(e: Event) {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const input = form.querySelector('input')
    const date = input.value
    const id = input.dataset.id

    const illness = this.patient.illnesses.find(i => i.id === id)
    if ( !illness ) {
      this.toggleEdit()
      return
    }

    try {
      const response = await AXIOS_INSTANCE.patch(`/patients/${this.patient.id}/illnesses`, {
        illness_id: id,
        sl_until: date
      }) 
    } catch(e: unknown) {
      console.log('Quite unfortunate indeed')
      console.error(e)
      return
    }

    illness.sl_until = date
    this.toggleEdit()
  }


  deleteIllness(id: string) {
    return async () => {
      try {
        const response = await AXIOS_INSTANCE.delete(`/patients/${this.patient.id}/illnesses?illness_id=${id}`)

        this.patient = {
          ...this.patient,
          illnesses: this.patient.illnesses.filter(i => i.id !== id)
        }
      } catch(e: unknown) {
        console.log('Quite unfortunate indeed')
        console.error(e)
        return
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
              this.patient.illnesses?.map(i =>
                <tr data-id={i.id}>
                  <td>{i.diagnosis}</td>
                  <td>{i.sl_from}</td>
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
                          {i.sl_until}
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
              <h2>
                Pridať chorobu pre pacienta
              </h2>
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
