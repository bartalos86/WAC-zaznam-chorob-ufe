import type { Illness } from './Illness';
import type { Medication } from './Medication';

export type Patient = {
    id: string,
    name: string,
    illnesses: Illness[] | null,
    medications: Medication[] | null
}


//export default Patient
