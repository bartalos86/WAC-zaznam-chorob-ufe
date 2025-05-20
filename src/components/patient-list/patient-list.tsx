import { Component, h, Host, State, Event, EventEmitter, Prop } from '@stencil/core';
import { fakePatients } from '../../constants/patients';
import {Patient} from '../../models/Patient';
import { v4 as uuidv4 } from 'uuid';
import { axiosStore } from '../../api/axios_instance/axiosStore';


@Component({
  tag: 'patient-list',
  styleUrl: 'patient-list.css',
  shadow: true,
})
export class PatientList {
  @Event({ eventName: "entry-clicked"}) entryClicked: EventEmitter<string>;

  @State() patients: Patient[] = []

  @State() isAdding = false

  private nameInput: HTMLInputElement

  // testing only
  setTestPatients(testingPatients: Patient[]) {
    this.patients = testingPatients;
  }

  async componentWillLoad() {
    const api = axiosStore.getAxiosInstance();

    try {
      type data = {
        message: string,
        patients: Patient[],
        status: string
      }
      const response = await api.get<data>('/patients')

      this.patients = response.data.patients
    } catch (e: unknown) {
        console.log(`Unfortunate`)
        console.error(e)
        console.log(`Populating with fake data (reason: Azure frontend instance)`)
        this.patients = fakePatients
    }
  }

  toggleAdd() {
    this.isAdding = !this.isAdding
  }

  async addPatient(e: Event) {
    const name = ((e.target as HTMLFormElement).querySelector(`#name`) as HTMLInputElement).value
    const api = axiosStore.getAxiosInstance();

    try {
      type data = {
        message: string,
        patient: Patient,
        status: string
      }
      const response = await api.post<data>(`/patients`, {
        name
      })

      this.patients = [
        ...this.patients,
        response.data.patient
      ]
    } catch (e: unknown) {
      console.log(`unfortunate`)
      console.log(e)
      // Added here because of FE fake functionality for Azure deployment
      const fakePatient: Patient = {id: uuidv4(), name: name, medications: [], illnesses: []}
      this.patients = [
        ...this.patients,
        fakePatient
      ]
    }
    this.toggleAdd()
  }

  async deletePatient(name: string) {
    const api = axiosStore.getAxiosInstance();

    try {
      await api.delete(`/patients?name=${name}`)

      // this.patients = this.patients.filter(p => p.name != name)
    } catch(e: unknown) {
      console.log('Damn son, back luck')
      console.log(e)
    }
    // Migrated here because of FE fake functionality for Azure deployment
    this.patients = this.patients.filter(p => p.name != name)
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
                  <td class='icon'>
                    <md-filled-icon-button class='button' onClick={() => this.deletePatient(p.name)}>
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
            <form onSubmit={this.addPatient.bind(this)}>
              <h2>
                Pridať nového pacienta
              </h2>
              <md-outlined-text-field label="Meno pacienta" id='name' required ref={e => this.nameInput = e}></md-outlined-text-field>

              <div>
                <md-outlined-button>Submit</md-outlined-button>
                <md-outlined-button type='reset' onClick={() => this.toggleAdd()}>Zrušiť</md-outlined-button>
              </div>
            </form> :
            <md-filled-icon-button class="add-button" onClick={() => this.toggleAdd()}>
              <md-icon>add</md-icon>
            </md-filled-icon-button>
        }
      </Host>
    );
  }
}
