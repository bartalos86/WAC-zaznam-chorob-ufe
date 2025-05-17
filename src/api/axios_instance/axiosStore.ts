import axios, { AxiosInstance } from 'axios';

let baseURL: string | null = null;
let instance: AxiosInstance | null = null;

export const axiosStore = {
  setBaseURL(url: string): void {
    baseURL = url;
    instance = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  getAxiosInstance(): AxiosInstance {
    if (!instance) {
       throw new Error("Axios baseURL has not been set. Call setBaseURL first.");
    }
    return instance;
  }
};
