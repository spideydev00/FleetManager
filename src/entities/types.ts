// User related types
export enum UserRole {
  CREATOR = "Creatore",
  MANAGER = "Manager",
  USER = "User",
}

// Helper function to convert string to UserRole
export function stringToUserRole(role: string): UserRole {
  switch (role) {
    case "Creatore":
      return UserRole.CREATOR;
    case "Manager":
      return UserRole.MANAGER;
    case "User":
      return UserRole.USER;
    default:
      return UserRole.USER;
  }
}

export interface User {
  id: string;
  role: UserRole;
  nome: string;
  email: string;
  azienda?: string;
  telefono?: string;
  dataCreazione?: string;
  ultimoAccesso?: string;
}

export interface Attachment {
  id: string;
  driverId: string;
  nome: string;
  tipo: string;
  dimensione: number;
  dataCaricamento: string;
  url: string;
}

export interface Driver {
  id: string;
  nomeDriver: string;
  centroCosto: string;
  societa: string;
  noleggiatore?: string;
  marca: string;
  modello: string;
  targa: string;
  alimentazione: string;
  emissioni: string;
  inizioContratto?: string;
  scadenzaContratto?: string;
  canoneMensile: number;
  kmContrattuali: number;
  allegati?: Attachment[];
}

// Order related types
export interface Order {
  id: string;
  ordine: string;
  nome_driver: string;
  marca: string;
  modello: string;
  fornitore: string;
  data_ordine: string;
  consegnata: boolean;
  driver_id: string;
}

export interface OrderToMake {
  id: string;
  nome_driver: string;
  driver_id: string;
  scelta_auto: string;
  rda: string;
  offerte: string;
  verifica: string;
  firme: string;
  stato: "Non iniziata" | "In corso" | "Completata";
}

// Fuel card related types
export interface FuelCard {
  id: string;
  targa: string;
  nome_driver: string;
  societa: string;
  dataRichiesta: string;
  alimentazione: string;
  stato: "Non arrivata" | "In attesa" | "Arrivata";
  personale: string;
  driver_id: string;
}