import type { Illness } from './Illness';

type Patient = {
    id: string,
    name: string,
    illnesses: Illness[] | null
}


export default Patient
