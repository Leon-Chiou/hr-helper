export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export type AppMode = 'data' | 'draw' | 'group';

export interface DrawHistory {
  id: string;
  participant: Participant;
  timestamp: number;
}
