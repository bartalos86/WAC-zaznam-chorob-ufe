import { Component, Host, h, Event, EventEmitter, State } from '@stencil/core';
import {Patient} from '../../models/Patient';
import type { Illness } from '../../models/Illness';
import { fakePatients } from '../../constants/patients';
import { axiosStore } from '../../api/axios_instance/axiosStore';

@Component({
  tag: 'random-patient',
  styleUrl: 'random-patient.css',
  shadow: true,
})
export class RandomPatient {
  @Event({ eventName: "entry-clicked" }) entryClicked: EventEmitter<string>

  @State() patient: Patient
  @State() isAdding = false
  @State() edit = {
    isActive: false,
    id: ''
  }
  // Use-Case 2 - treatments
  @State() showOverlay = false;
  @State() activeIllness: Illness = null;
  // Medication overlay
  @State() showMedicationOverlay = false;

  private diagnosisInput: HTMLInputElement
  private fromInput: HTMLInputElement
  private untilInput: HTMLInputElement

  // for tests only
  setTestPatient(testPatient: Patient) {
    this.patient = testPatient;
  }

  async componentWillLoad() {
    const url = new URL(window.location.href)
    const patientName = url.searchParams.get('name')

    if (!patientName) {
      console.warn("No 'name' query parameter found in URL.")
      return
    }
    // fetch the damn user
    const api = axiosStore.getAxiosInstance();

    try {
      type data = {
        message: string,
        patients: Patient[],
        status: string
      }

      const response = await api.get<data>(`/patients?name=${patientName}`)
      if (response.data.patients.length != 1) {
        console.log('Unfortunate')
        return
      }
      this.patient = response.data.patients.at(0)
    } catch (e: unknown) {
      console.log('unfortunate again')
      console.error(e)
      this.tryToGetFakePatient(patientName)
    }
  }

  tryToGetFakePatient(name: string) {
      console.log(`Searching through fake data (reason: Azure frontend instance)`);
      const patients = fakePatients;
      patients.forEach(patient => {
        if (patient.name === name) {
          this.patient = patient;
          return;
        }
      });
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
    const api = axiosStore.getAxiosInstance();

    try {
      const response = await api.post<Illness>(`/patients/${this.patient.id}/illnesses`, {
        diagnosis: illness.diagnosis,
        sl_from: illness.sl_from,
        sl_until: illness.sl_until
      })

      illness.id = response.data.id
    } catch (e: unknown) {
      console.log('unfortunate again but you keep trying')
      console.error(e)
    }

    if ( !Array.isArray(this.patient.illnesses) ) {
      this.patient.illnesses = [illness]
    } else {
      this.patient = {
        ...this.patient,
        illnesses: [
          ...this.patient.illnesses,
          illness
        ]
      }
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
    if (!illness) {
      this.toggleEdit()
      return
    }
    const api = axiosStore.getAxiosInstance();

    try {
      await api.patch(`/patients/${this.patient.id}/illnesses`, {
        illness_id: id,
        sl_until: date
      })
    } catch (e: unknown) {
      console.log('Quite unfortunate indeed')
      console.error(e)
      // Removed return because of fake functionality for Azure
      // return
    }

    illness.sl_until = date
    this.toggleEdit()
  }

  deleteIllness(id: string) {
    return async () => {
      try {
        const api = axiosStore.getAxiosInstance();

        await api.delete(`/patients/${this.patient.id}/illnesses?illness_id=${id}`)
      } catch (e: unknown) {
        console.log('Quite unfortunate indeed')
        console.error(e)
        // Removed return because of fake functionality for Azure
        // return
      }
      this.patient = {
        ...this.patient,
        illnesses: this.patient.illnesses.filter(i => i.id !== id)
      }
    }
  }

  // Toggle the medication overlay
  toggleMedicationOverlay() {
    this.showMedicationOverlay = !this.showMedicationOverlay;
  }

  render() {
    function getEventDetail() {
      return JSON.stringify({
        path: '/'
      })
    }

    return (
      <Host>
        <md-filled-icon-button onClick={() => this.entryClicked.emit(getEventDetail())}>
          <md-icon>arrow_back</md-icon>
        </md-filled-icon-button>
        <h1>{this.patient?.name}</h1>


        <div class="medication-management">
          <md-outlined-button onClick={() => this.toggleMedicationOverlay()}>
            <md-icon slot="icon">medication</md-icon>
            Lieky pacienta
          </md-outlined-button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Diagnóza</th>
              <th>Začiatok PN</th>
              <th>Koniec PN</th>
              <th>Liečba</th> {/*Use Case 2 - treatments*/}
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              this.patient?.illnesses?.map(i =>
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
                        (
                          <div class='date-edit'>
                            {i.sl_until}
                            <md-filled-icon-button onClick={() => this.toggleEdit(i.id)}>
                              <md-icon>edit</md-icon>
                            </md-filled-icon-button>
                          </div>
                        )
                    }
                  </td>

                  {/*Use Case 2 - treatments*/}
                  <td class="icon">
                    <md-filled-icon-button onClick={() => {
                      this.activeIllness = i
                      this.showOverlay = true
                    }}>
                      <md-icon>{(i.treatments?.length > 0) ? 'edit_note' : 'playlist_add'}</md-icon>
                    </md-filled-icon-button>
                  </td>

                  <td class='icon'>
                    <md-filled-icon-button class='delete-illness' onClick={this.deleteIllness(i.id)}>
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
                <md-outlined-button class='add_illness'>Vytvoriť</md-outlined-button>
                <md-outlined-button type='reset' onClick={() => this.toggleAdd()}>Zrušiť</md-outlined-button>
              </div>
            </form> :
            <md-filled-icon-button class='show_form' onClick={() => this.toggleAdd()}>
              <md-icon>add</md-icon>
            </md-filled-icon-button>
        }

        {/*Use Case 2 - treatments*/}
        {
          this.showOverlay && this.activeIllness &&
          <treatment-overlay
            patientId={this.patient?.id}
            illness={this.activeIllness}
            onCloseOverlay={() => {
              this.showOverlay = false;
              this.activeIllness = null;
            }}>
          </treatment-overlay>
        }

        {/* Medication overlay */}
        {
          this.showMedicationOverlay && this.patient &&
          <medication-overlay
            patientId={this.patient?.id}
            patient={this.patient}
            onCloseOverlay={() => {
              this.showMedicationOverlay = false;
            }}>
          </medication-overlay>
        }

      </Host>
    );
  }
}
