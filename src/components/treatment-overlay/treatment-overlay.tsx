import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';
import AXIOS_INSTANCE from '../../api/axios_instance';
import type { Illness } from '../../models/Illness';
import type { Treatment } from '../../models/Treatment';
import { v4 as uuidv4 } from 'uuid';

@Component({
  tag: 'treatment-overlay',
  styleUrl: 'treatment-overlay.css',
  shadow: true,
})
export class TreatmentOverlay {
  @State() buttonText: string = 'Pridať';
  @State() _updateTrigger: number = 0;
  @Prop() patientId: string;
  @Prop() illness: Illness;
  @Event() closeOverlay: EventEmitter<void>;

  // For handling inputs when adding/editing a treatment
  private treatmentNameInput: HTMLInputElement;
  private treatmentDescriptionInput: HTMLInputElement;
  private treatmentStartInput: HTMLInputElement;
  private treatmentEndInput: HTMLInputElement;
  private treatmentIdInput: HTMLInputElement;
  // Messages for validating input fields
  @State() nameValidation: string = 'Meno liečby nesmie byť prázdne!';
  @State() descriptionValidation: string = 'Popis liečby nesmie byť prázdny!';
  @State() startValidation: string = 'Začiatok liečby nesmie byť nešpecifikovaný!';
  @State() endValidation: string = 'Koniec liečby nesmie byť nešpecifikovaný!';

  async componentWillLoad() {
    if (!this.illness?.id) {
      console.warn('Illness not defined, skipping treatment fetch.');
      return;
    }
    try {
      type data = {
        message: string,
        treatments: Treatment[],
        status: string,
      }
      const response = await AXIOS_INSTANCE.get<data>('patients/' + this.patientId + '/illnesses/' + this.illness.id + '/treatments');
      console.log(response);
      this.illness.treatments = response.data.treatments;
    } catch (e) {
      console.error(e);
    }
  }

  get isCompleted() {
    return !!this.illness.sl_until;
  }

  private handleButtonText = () => {
    this.buttonText = this.treatmentIdInput?.value ? 'Upraviť' : 'Pridať';
  }

  private resetInputFields = () => {
    this.treatmentIdInput = null;
    this.treatmentNameInput.value = '';
    this.treatmentDescriptionInput.value = '';
    this.treatmentStartInput.value = '';
    this.treatmentEndInput.value = '';
    // reset validation messages
    this.nameValidation = 'Meno liečby nesmie byť prázdne!';
    this.descriptionValidation = 'Popis liečby nesmie byť prázdny!';
    this.startValidation = 'Začiatok liečby nesmie byť nešpecifikovaný!';
    this.endValidation = 'Koniec liečby nesmie byť nešpecifikovaný!';
    // set button text to add label
    this.buttonText = 'Pridať';
  }

  private clearValidationMessages = () => {
    // clear validation messages
    this.nameValidation = '';
    this.descriptionValidation = '';
    this.startValidation = '';
    this.endValidation = '';
  }

  private handleAdd = async () => {
    const newTreatment = {
      name: this.treatmentNameInput.value,
      description: this.treatmentDescriptionInput.value,
      startDate: this.treatmentStartInput.value,
      endDate: this.treatmentEndInput.value,
      id: null,
    };
    try {
      type data = {
        message: string,
        treatment: Treatment,
        status: string,
      }
      const response = await AXIOS_INSTANCE.post<data>(
        `patients/${this.patientId}/illnesses/${this.illness.id}/treatments`,
        newTreatment
      );
      newTreatment.id = response.data.treatment.id;
      // // Add new treatment
      // if (newTreatment.description) {
      //   this.illness.treatments = [...(this.illness.treatments || []), newTreatment];
      // }
      // // Clear the fields
      // this.resetInputFields();
      // this._updateTrigger++;
    } catch (e) {
      console.error(e);
      newTreatment.id = uuidv4();
    }
    // Migrated to here because of FE fake functionality for Azure deployment
    if (newTreatment.description) {
      this.illness.treatments = [...(this.illness.treatments || []), newTreatment];
    }
    this.resetInputFields();
    this._updateTrigger++;
  }

  private handleEdit = async (treatmentId: string) => {
    const updatedTreatment = {
      id: treatmentId,
      name: this.treatmentNameInput.value,
      description: this.treatmentDescriptionInput.value,
      startDate: this.treatmentStartInput.value,
      endDate: this.treatmentEndInput.value,
    };
    // Update the existing treatment
    try {
      await AXIOS_INSTANCE.patch<Treatment>(
        `patients/${this.patientId}/illnesses/${this.illness.id}/treatments/${treatmentId}`,
        updatedTreatment
      );
      // this.illness.treatments = this.illness.treatments.map(treatment =>
      //   treatment.id === treatmentId ? updatedTreatment : treatment
      // );
      // this.resetInputFields();
      // this._updateTrigger++;
    } catch (e) {
      console.error(e);
    }
    // Migrated to here because of FE fake functionality for Azure deployment
    this.illness.treatments = this.illness.treatments.map(treatment =>
      treatment.id === treatmentId ? updatedTreatment : treatment
    );
    this.resetInputFields();
    this._updateTrigger++;
  }

  private handleDelete = async (treatmentId: string) => {
    // Delete treatment
    try {
      await AXIOS_INSTANCE.delete(
        `patients/${this.patientId}/illnesses/${this.illness.id}/treatments/${treatmentId}`
      );
      // this.illness.treatments = this.illness.treatments.filter(treatment => treatment.id !== treatmentId);
      // this._updateTrigger++;
    } catch (e) {
      console.error(e);
    }
    // Migrated to here because of FE fake functionality for Azure deployment
    this.illness.treatments = this.illness.treatments.filter(treatment => treatment.id !== treatmentId);
    this._updateTrigger++;
  }

  render() {
    if (!this.illness) return <div class="overlay">Chýbajúce údaje o chorobe.</div>;
    return (
      <div class="overlay">
        <div class="content">
          <h2>Liečba pre {this.illness.diagnosis}</h2>

          <ul>
            {(this.illness.treatments || []).map(t => (
              <li>
                <div class="treatment-item">
                  <div class="treatment-details">
                    <span class="description-button" title={'Popis liečby: ' + t.description}>📃</span>
                    <strong>{t.name}</strong> 🟢{t.startDate}🔴{t.endDate}
                  </div>
                  <div class="treatment-actions">
                    <button class="delete" onClick={() => this.handleDelete(t.id)}>
                      <md-icon>delete</md-icon>
                    </button>
                    <button class="edit" onClick={() => {
                      this.treatmentIdInput.value = t.id;
                      this.treatmentNameInput.value = t.name;
                      this.treatmentDescriptionInput.value = t.description;
                      this.treatmentStartInput.value = t.startDate;
                      this.treatmentEndInput.value = t.endDate;
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
              placeholder="Zadajte meno liečby"
              ref={el => this.treatmentNameInput = el}
              onInput={() => {
                if (this.treatmentNameInput.value === '') this.nameValidation = 'Meno liečby nesmie byť prázdne!'
                else this.nameValidation = '';
              }}
              required
            />
            {<div class="error">{this.nameValidation}</div>}
            <input
              type="text"
              placeholder="Zadajte popis liečby"
              ref={el => this.treatmentDescriptionInput = el}
              onInput={() => {
                if (this.treatmentDescriptionInput.value === '') this.descriptionValidation = 'Popis liečby nesmie byť prázdny!'
                else this.descriptionValidation = '';
              }}
              required
            />
            {<div class="error">{this.descriptionValidation}</div>}
            <input
              type="date"
              placeholder="Začiatok liečby"
              ref={el => this.treatmentStartInput = el}
              onInput={() => {
                if (this.treatmentStartInput.value === '') this.startValidation = 'Začiatok liečby nesmie byť nešpecifikovaný!'
                else this.startValidation = '';
              }}
              required
            />
            {<div class="error">{this.startValidation}</div>}
            <input
              type="date"
              placeholder="Koniec liečby"
              ref={el => this.treatmentEndInput = el}
              onInput={() => {
                if (this.treatmentEndInput.value === '') this.endValidation = 'Koniec liečby nesmie byť nešpecifikovaný!'
                else this.endValidation = '';
              }}
              required
            />
            {<div class="error">{this.endValidation}</div>}
            <input
              type="hidden"
              ref={el => this.treatmentIdInput = el}
            />
            <button class="proceed" onClick={() => {
              const treatmentId = this.treatmentIdInput.value;
              if (!this.treatmentDescriptionInput.value || !this.treatmentNameInput.value ||
                !this.treatmentEndInput.value || !this.treatmentStartInput.value) return;

              if (treatmentId) {
                this.handleEdit(treatmentId);
              } else {
                this.handleAdd();
              }
            }}>
              {this.buttonText}
            </button>
          </div>

          <button onClick={() => this.closeOverlay.emit()} class="close">
            Zavrieť
          </button>
        </div>
      </div>
    );
  }
}
