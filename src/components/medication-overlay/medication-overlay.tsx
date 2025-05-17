import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';
import type { Medication } from '../../models/Medication';
import type { Patient } from '../../models/Patient';
import { v4 as uuidv4 } from 'uuid';
import { axiosStore } from '../../api/axios_instance/axiosStore';

@Component({
  tag: 'medication-overlay',
  styleUrl: 'medication-overlay.css',
  shadow: true,
})
export class MedicationOverlay {
  @State() buttonText: string = 'Pridať';
  @State() _updateTrigger: number = 0;
  @Prop() patientId: string;
  @Prop() patient: Patient;
  @Event() closeOverlay: EventEmitter<void>;

  // For handling inputs when adding/editing a medication
  private medicationNameInput: HTMLInputElement;
  private medicationSideEffectsInput: HTMLTextAreaElement;
  private medicationIdInput: HTMLInputElement;

  // Messages for validating input fields
  @State() nameValidation: string = 'Názov lieku nesmie byť prázdny!';
  @State() sideEffectsValidation: string = 'Vedľajšie účinky musia byť špecifikované!';

  async componentWillLoad() {
    const api = axiosStore.getAxiosInstance();

    if (!this.patient?.id) {
      console.warn('Patient not defined, skipping medications fetch.');
      return;
    }
    try {
      const response = await api.get(`patients/${this.patientId}/medications`);
      this.patient.medications = response.data;
    } catch (e) {
      console.error(e);
    }
  }

  private handleButtonText = () => {
    this.buttonText = this.medicationIdInput?.value ? 'Upraviť' : 'Pridať';
  }

  private resetInputFields = () => {
    this.medicationIdInput = null;
    this.medicationNameInput.value = '';
    this.medicationSideEffectsInput.value = '';

    // reset validation messages
    this.nameValidation = 'Názov lieku nesmie byť prázdny!';
    this.sideEffectsValidation = 'Vedľajšie účinky musia byť špecifikované!';

    // set button text to add label
    this.buttonText = 'Pridať';
  }

  private clearValidationMessages = () => {
    // clear validation messages
    this.nameValidation = '';
    this.sideEffectsValidation = '';
  }

  private handleAdd = async () => {
    const newMedication = {
      name: this.medicationNameInput.value,
      sideEffects: this.medicationSideEffectsInput.value,
    };

    const api = axiosStore.getAxiosInstance();

    try {
      const response = await api.post(
        `patients/${this.patientId}/medications`,
        newMedication
      );

      // Add new medication to the list
      if (this.patient.medications === null) {
        this.patient.medications = [];
      }
      this.patient.medications = [...this.patient.medications, response.data];

      // Clear the fields
      this.resetInputFields();
      this._updateTrigger++;
    } catch (e) {
      console.error(e);
      // Added here because of FE fake functionality for Azure deployment
      const response = { data: { id: uuidv4(), name: newMedication.name, sideEffects: newMedication.sideEffects } };
      if (this.patient.medications === null) {
        this.patient.medications = [];
      }
      this.patient.medications = [...this.patient.medications, response.data];
      this.resetInputFields();
      this._updateTrigger++;
    }
  }

  private handleEdit = async (medicationId: string) => {
    const updatedMedication = {
      id: medicationId,
      name: this.medicationNameInput.value,
      sideEffects: this.medicationSideEffectsInput.value,
    };

    const api = axiosStore.getAxiosInstance();


    // Update the existing medication
    try {
      await api.patch(
        `patients/${this.patientId}/medications/${medicationId}`,
        updatedMedication
      );

      // // Update medication in the list
      // this.patient.medications = this.patient.medications.map(medication =>
      //   medication.id === medicationId ? updatedMedication : medication
      // );

      // this.resetInputFields();
      // this._updateTrigger++;
    } catch (e) {
      console.error(e);
    }
    // Migrated to here because of FE fake functionality for Azure deployment
    this.patient.medications = this.patient.medications.map(medication =>
      medication.id === medicationId ? updatedMedication : medication
    );
    this.resetInputFields();
    this._updateTrigger++;
  }

  private handleDelete = async (medicationId: string) => {
    const api = axiosStore.getAxiosInstance();

    try {
      await api.delete(
        `patients/${this.patientId}/medications?medication_id=${medicationId}`
      );


    } catch (e) {
      console.error(e);
    }
    // Migrated to here because of FE fake functionality for Azure deployment
    this.patient.medications = this.patient.medications.filter(medication => medication.id !== medicationId);
    this._updateTrigger++;
  }

  render() {
    if (!this.patient) return <div class="overlay">Chýbajúce údaje o pacientovi.</div>;

    return (
      <div class="overlay">
        <div class="content">
          <h2>Lieky pacienta {this.patient.name}</h2>

          <ul>
            {(this.patient.medications || []).map(m => (
              <li>
                <div class="medication-item">
                  <div class="medication-details">
                    <span class="sideEffects-button" title={'Vedľajšie účinky: ' + m.sideEffects}>💊</span>
                    <strong>{m.name}</strong>
                  </div>
                  <div class="medication-actions">
                    <button class="delete" onClick={() => this.handleDelete(m.id)}>
                      <md-icon>delete</md-icon>
                    </button>
                    <button class="edit" onClick={() => {
                      this.medicationIdInput = document.createElement('input');
                      this.medicationIdInput.value = m.id;
                      this.medicationNameInput.value = m.name;
                      this.medicationSideEffectsInput.value = m.sideEffects;
                      this.clearValidationMessages();
                      this.handleButtonText();
                    }}>
                      <md-icon>edit</md-icon>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <input
              type="text"
              placeholder="Zadajte názov lieku"
              ref={el => this.medicationNameInput = el}
              onInput={() => {
                if (this.medicationNameInput.value === '') this.nameValidation = 'Názov lieku nesmie byť prázdny!'
                else this.nameValidation = '';
              }}
              required
            />
            {<div class="error">{this.nameValidation}</div>}

            <textarea
              placeholder="Zadajte vedľajšie účinky"
              ref={el => this.medicationSideEffectsInput = el as HTMLTextAreaElement}
              onInput={() => {
                if (this.medicationSideEffectsInput.value === '') this.sideEffectsValidation = 'Vedľajšie účinky musia byť špecifikované!'
                else this.sideEffectsValidation = '';
              }}
              required
            />
            {<div class="error">{this.sideEffectsValidation}</div>}

            <button
              onClick={() => {
                if (this.medicationNameInput.value && this.medicationSideEffectsInput.value) {
                  if (this.medicationIdInput?.value) {
                    this.handleEdit(this.medicationIdInput.value);
                  } else {
                    this.handleAdd();
                  }
                } else {
                  // Show validation errors
                  if (!this.medicationNameInput.value) this.nameValidation = 'Názov lieku nesmie byť prázdny!';
                  if (!this.medicationSideEffectsInput.value) this.sideEffectsValidation = 'Vedľajšie účinky musia byť špecifikované!';
                }
              }}
            >
              {this.buttonText}
            </button>

            <button onClick={() => this.closeOverlay.emit()}>
              Zatvoriť
            </button>
          </div>
        </div>
      </div>
    );
  }
}
