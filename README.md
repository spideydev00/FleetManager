# TARS - Fleet Management System

Un sistema completo di gestione flotta aziendale costruito con React, TypeScript, Vite e Supabase.

## 🚀 Caratteristiche Principali

- **Gestione Driver**: Anagrafica completa con documenti allegati
- **Gestione Ordini**: Workflow completo dall'ordine alla consegna
- **Fuel Cards**: Monitoraggio richieste e stati delle carte carburante
- **Reports e Analytics**: Dashboard con grafici e esportazione Excel
- **Sistema Multi-Ruolo**: Creatore, Manager e User con permessi differenziati
- **Dark Mode**: Interfaccia adattiva chiara/scura
- **Responsive Design**: Ottimizzato per desktop e mobile

## 🛠️ Stack Tecnologico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database PostgreSQL + Auth + Storage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **File Processing**: SheetJS (xlsx)

## 📦 Installazione

### Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn
- Account Supabase

### Setup Locale

1. **Clona il repository**
```bash
git clone https://github.com/your-username/tars-fleet-management.git
cd tars-fleet-management
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura le variabili d'ambiente**
```bash
cp .env.example .env.local
```

Modifica `.env.local` con le tue credenziali Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Avvia il server di sviluppo**
```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 🗄️ Setup Database Supabase

### 1. Crea le tabelle principali

```sql
-- Enum per i ruoli utente
CREATE TYPE user_role AS ENUM ('Creatore', 'Manager', 'User');
CREATE TYPE stato AS ENUM ('Non iniziata', 'In corso', 'Completata');
CREATE TYPE stato_fuel_card AS ENUM ('Non arrivata', 'In attesa', 'Arrivata');

-- Tabella utenti
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'User'::user_role,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  azienda TEXT,
  telefono TEXT,
  data_creazione TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_accesso TIMESTAMP WITH TIME ZONE
);

-- Tabella drivers
CREATE TABLE drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_driver TEXT NOT NULL,
  centro_costo TEXT,
  societa TEXT NOT NULL,
  noleggiatore TEXT,
  marca TEXT NOT NULL,
  modello TEXT NOT NULL,
  targa TEXT,
  alimentazione TEXT,
  emissioni TEXT,
  inizio_contratto DATE,
  scadenza_contratto DATE,
  canone_mensile DECIMAL(10,2) DEFAULT 0,
  km_contrattuali INTEGER DEFAULT 0,
);

-- Tabella ordini
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ordine TEXT NOT NULL,
  nome_driver TEXT NOT NULL,
  marca TEXT NOT NULL,
  modello TEXT NOT NULL,
  fornitore TEXT NOT NULL,
  data_ordine DATE NOT NULL,
  consegnata BOOLEAN DEFAULT FALSE,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
);

-- Tabella ordini da fare
CREATE TABLE orders_to_make (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_driver TEXT NOT NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  scelta_auto stato NOT NULL DEFAULT 'Non iniziata'::stato,
  rda stato NOT NULL DEFAULT 'Non iniziata'::stato,
  offerte stato NOT NULL DEFAULT 'Non iniziata'::stato,
  verifica stato NOT NULL DEFAULT 'Non iniziata'::stato,
  firme stato NOT NULL DEFAULT 'Non iniziata'::stato,
  stato stato NOT NULL DEFAULT 'Non iniziata'::stato,
);

-- Tabella fuel cards
CREATE TABLE fuel_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  targa TEXT NOT NULL,
  nome_driver TEXT NOT NULL,
  societa TEXT NOT NULL,
  data_richiesta DATE,
  alimentazione TEXT,
  stato stato_fuel_card NOT NULL DEFAULT 'Non arrivata'::stato_fuel_card,
  referente TEXT,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
);

-- Tabella allegati
CREATE TABLE attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  dimensione INTEGER NOT NULL,
  url TEXT NOT NULL,
  data_caricamento TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Configura Storage per documenti

```sql
-- Crea bucket per documenti driver
INSERT INTO storage.buckets (id, name, public) VALUES ('driver-documents', 'driver-documents', false);

-- Policy per accesso ai documenti
CREATE POLICY "Users can upload driver documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'driver-documents');
CREATE POLICY "Users can view driver documents" ON storage.objects FOR SELECT USING (bucket_id = 'driver-documents');
CREATE POLICY "Users can delete driver documents" ON storage.objects FOR DELETE USING (bucket_id = 'driver-documents');
```

### 3. Funzione automatica per registrazione utenti

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  role_text TEXT := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'User');
  nome_text TEXT := COALESCE(
                    NULLIF(NEW.raw_user_meta_data->>'nome', ''), 
                    split_part(NEW.email, '@', 1),    
                    'Sconosciuto'                      
                   );
  existing_user_count INTEGER;
BEGIN
  -- Check if user already exists
  SELECT COUNT(*) INTO existing_user_count 
  FROM public.users 
  WHERE id = NEW.id;

  IF existing_user_count = 0 THEN
    -- New user: insert with metadata or default role
    INSERT INTO public.users (
      id,
      role,
      nome,
      email,
      azienda,
      telefono,
      created_at,
      ultimo_accesso
    )
    VALUES (
      NEW.id,
      role_text::public.user_role,
      nome_text,
      NEW.email,
      NEW.raw_user_meta_data->>'azienda',
      NEW.raw_user_meta_data->>'telefono',
      now(),
      now()
    );
  ELSE
    -- Existing user: update only non-role fields
    UPDATE public.users 
    SET
      email          = NEW.email,
      ultimo_accesso = now()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger per la funzione
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 🔐 Autenticazione e Ruoli

### Ruoli Utente

- **Creatore**: Accesso completo a tutte le funzionalità
- **Manager**: Gestione completa eccetto configurazioni sistema
- **User**: Accesso in sola lettura e operazioni base

### Primo Accesso

1. Registra il primo utente direttamente in Supabase Auth
2. Modifica manualmente il ruolo in `users.role` = 'Creatore'
3. Accedi con le credenziali create

## 📁 Struttura del Progetto

```
src/
├── components/                 # Componenti React
│   ├── Auth/                  # Autenticazione e profili
│   ├── Dashboard/             # Dashboard principale
│   ├── DriversManager/        # Gestione driver
│   ├── OrdersManager/         # Gestione ordini
│   ├── FuelCardsManager/      # Gestione fuel cards
│   ├── ReportsManager/        # Reports e analytics
│   └── Layout/                # Componenti layout
├── types.ts                   # Definizioni TypeScript
├── utils/                     # Utility functions
└── supabase.ts               # Configurazione Supabase
```

## 📋 Comandi Utili

```bash
# Sviluppo
npm run dev              # Avvia server di sviluppo
npm run build            # Build per produzione
npm run preview          # Preview build locale
npm run lint             # Linting del codice

# Database
npm run db:types         # Genera tipi TypeScript da Supabase
```

## 🔧 Funzionalità Avanzate

### Import/Export Excel
- Supporto per import massivo da file Excel
- Export dati con filtri applicati
- Template Excel preformattati

### Sistema di Allegati
- Upload documenti per ogni driver
- Storage sicuro su Supabase Storage
- Gestione tipi file e dimensioni

### Reports e Analytics
- Dashboard interattiva con grafici
- Filtri dinamici avanzati
- Statistiche flotta in tempo reale

## 🤝 Collegamento a GitHub

### Setup Repository

1. **Crea repository su GitHub**
```bash
# Vai su github.com e crea un nuovo repository
```

2. **Collega il progetto locale**
```bash
git init
git add .
git commit -m "Initial commit: TARS Fleet Management System"
git branch -M main
git remote add origin https://github.com/your-username/tars-fleet-management.git
git push -u origin main
```

3. **Configurazione per sviluppo**
```bash
# Crea branch di sviluppo
git checkout -b develop
git push -u origin develop

# Per nuove features
git checkout -b feature/nome-feature
git push -u origin feature/nome-feature
```

### Workflow Git Consigliato

```bash
# Daily workflow
git checkout develop
git pull origin develop
git checkout -b feature/nuova-funzionalita

# Lavora sulla feature...
git add .
git commit -m "feat: aggiungi nuova funzionalità"
git push origin feature/nuova-funzionalita

# Crea Pull Request su GitHub
# Dopo merge:
git checkout develop
git pull origin develop
git branch -d feature/nuova-funzionalita
```

## 🐛 Troubleshooting

### Problemi Comuni

1. **Errore di connessione Supabase**
   - Verifica le credenziali in `.env.local`
   - Controlla le policy RLS nel database

2. **Errore di import Excel**
   - Verifica formato colonne
   - Controlla encoding del file

3. **Problemi di autenticazione**
   - Verifica trigger `handle_new_user`
   - Controlla ruoli nella tabella `users`

## 📞 Supporto

Per segnalazioni bug o richieste di funzionalità:
1. Apri un issue su GitHub
2. Fornisci dettagli dell'errore e screenshot
3. Includi informazioni sull'ambiente (browser, OS, etc.)

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

---

**Sviluppato da SpideyDev** 
© 2025 - Tutti i diritti riservati
