// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: '(beta) liiist: llama agent model',
    label: '(beta) liiist: llama agent model',
    apiIdentifier: 'liiist: llama agent model',
    description: 'Work in progress',
  },
  {
    id: 'liiist: gpt4 v0.1',
    label: 'liiist: gpt4 v0.1',
    apiIdentifier: 'liiist: gpt v0.1',
    description: 'Work in progress',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
