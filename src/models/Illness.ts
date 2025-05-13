import { Treatment } from "./Treatment";

export type Illness = {
    id: string,
    diagnosis: string,
    sl_from: string,
    sl_until: string,
    treatments?: Treatment[],
};
