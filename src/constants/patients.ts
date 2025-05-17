import { Patient } from "../models/Patient";

export const fakePatients: Patient[] = [
  {
    id: "P-001",
    name: "Alice Smith",
    illnesses: [
      {
        id: "illness-001",
        diagnosis: "Bronchitis",
        sl_from: "2025-03-01",
        sl_until: "2025-03-14",
        treatments: [
          {
            id: "treatment-001",
            name: "Antibiotic course",
            description: "7-day antibiotic treatment to clear infection",
            startDate: "2025-03-01",
            endDate: "2025-03-07",
          },
          {
            id: "treatment-002",
            name: "Cough suppressant",
            description: "Used to reduce coughing frequency",
            startDate: "2025-03-01",
            endDate: "2025-03-14",
          },
        ],
      },
    ],
    medications: [
      {
        id: "medication-001",
        name: "Amoxicillin",
        sideEffects: "Nausea, diarrhea, allergic reaction",
      },
      {
        id: "medication-002",
        name: "Dextromethorphan",
        sideEffects: "Drowsiness, dizziness",
      },
    ],
  },
  {
    id: "P-002",
    name: "Bob Johnson",
    illnesses: [
      {
        id: "illness-002",
        diagnosis: "Seasonal Allergies",
        sl_from: "2025-04-01",
        sl_until: "2025-04-30",
        treatments: [
          {
            id: "treatment-003",
            name: "Antihistamine",
            description: "Daily antihistamine tablets for allergy symptoms",
            startDate: "2025-04-01",
            endDate: "2025-04-30",
          },
        ],
      },
      {
        id: "illness-003",
        diagnosis: "Sprained Ankle",
        sl_from: "2025-05-05",
        sl_until: "2025-05-20",
        treatments: [
          {
            id: "treatment-004",
            name: "Physical therapy",
            description: "Exercises to restore ankle mobility and strength",
            startDate: "2025-05-06",
            endDate: "2025-05-20",
          },
        ],
      },
    ],
    medications: [
      {
        id: "medication-003",
        name: "Loratadine",
        sideEffects: "Dry mouth, headache",
      },
      {
        id: "medication-004",
        name: "Ibuprofen",
        sideEffects: "Stomach pain, nausea",
      },
    ],
  },
];
