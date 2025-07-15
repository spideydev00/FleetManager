import React, { useState } from "react";
import { Search, HelpCircle, MessageCircle, Book, Car, FileText, CreditCard, BarChart3, Calendar, Settings } from "lucide-react";
import FAQCard from "./components/FAQCard";
import FAQCategory from "./components/FAQCategory";

interface FAQsProps {
    isDarkMode: boolean;
}

const FAQs: React.FC<FAQsProps> = ({ isDarkMode }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const faqData = [
        // ========== GESTIONE DRIVER ==========
        {
            id: 1,
            category: "driver",
            question: "Come aggiungo un nuovo driver al sistema?",
            answer: "Per aggiungere un nuovo driver: 1) Vai nella sezione 'Gestione Driver' 2) Clicca su 'Nuovo Driver' 3) Compila tutti i campi obbligatori (Nome Driver, Società, Marca, Modello e Alimentazione) 4) Aggiungi informazioni opzionali 5) Clicca 'Salva Driver'. Il sistema assegnerà automaticamente un ID univoco."
        },
        {
            id: 2,
            category: "driver",
            question: "Posso modificare i dati di un driver già inserito?",
            answer: "Sì, puoi modificare qualsiasi dato: 1) Clicca sull'icona matita (Modifica) nella tabella driver 2) Oppure clicca 'Visualizza' e poi 'Modifica' 3) Tutte le modifiche vengono salvate immediatamente nel database 4) Gli ordini e fuel card associate si aggiornano automaticamente con i nuovi dati del driver. Attenzione: modificare marca/modello può influenzare ordini esistenti."
        },
        {
            id: 3,
            category: "driver",
            question: "Come carico documenti per un driver?",
            answer: "Gestione documenti: 1) Clicca 'Visualizza' sul driver desiderato 2) Scorri fino alla sezione 'Allegati' 3) Trascina file nella zona evidenziata o clicca 'Seleziona file' 4) Formati supportati: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX 5) Dimensione massima: 10MB per file 6) Ogni file viene archiviato in modo sicuro su Supabase Storage 7) Puoi scaricare o eliminare documenti in qualsiasi momento."
        },
        {
            id: 4,
            category: "driver",
            question: "Cosa succede se elimino un driver per errore?",
            answer: "L'eliminazione di un driver è DEFINITIVA e comporta: 1) Cancellazione permanente dal database 2) Rimozione automatica di tutti gli ordini associati 3) Eliminazione delle fuel card collegate 4) Cancellazione di tutti i documenti allegati 5) Perdita irreversibile dei dati. IMPORTANTE: Prima di eliminazioni massive, esporta sempre i dati in Excel come backup."
        },
        {
            id: 5,
            category: "driver",
            question: "Come funziona la ricerca e i filtri nella gestione driver?",
            answer: "Sistema di ricerca avanzato: 1) Barra di ricerca: cerca per nome driver, società, marca, modello, targa 2) Ricerca case-insensitive (maiuscole/minuscole indifferenti) 3) Filtri real-time: i risultati si aggiornano mentre digiti 4) Selezione multipla: usa checkbox per operazioni su più driver 5) Ordinamento: clicca sulle intestazioni colonne per ordinare 6) Esportazione filtrata: esporta solo i driver visualizzati dopo filtri."
        },
        {
            id: 6,
            category: "driver",
            question: "Come importo driver da Excel in massa?",
            answer: "Import Excel step-by-step: 1) Prepara file Excel con colonne: nome_driver, societa, marca, modello, targa, alimentazione, emissioni, centro_costo, noleggiatore, inizio_contratto, scadenza_contratto, canone_mensile, km_contrattuali 2) Clicca 'Carica Excel' in Gestione Driver 3) Seleziona il file 4) Il sistema valida i dati e mostra errori eventuali 5) Conferma importazione. ATTENZIONE: L'import sostituisce TUTTI i driver esistenti."
        },
        // ========== GESTIONE ORDINI ==========
        {
            id: 7,
            category: "orders",
            question: "Qual è la differenza tra 'Ordini in Corso' e 'Ordini da Fare'?",
            answer: "DUE SEZIONI DISTINTE: ORDINI DA FARE = Workflow di approvazione pre-ordine con 5 fasi (Scelta Auto → RDA → Offerte → Verifica → Firme). Quando tutte le fasi sono 'Completate', si può creare un ordine ufficiale. ORDINI IN CORSO = Ordini ufficiali emessi con codice ordine, dove si traccia la consegna del veicolo. Gli ordini passano da 'Ordini da Fare' a 'Ordini in Corso' dopo completamento workflow."
        },
        {
            id: 8,
            category: "orders",
            question: "Come funziona il workflow degli 'Ordini da Fare'?",
            answer: "Workflow in 5 fasi sequenziali: 1) SCELTA AUTO: Definizione veicolo e specifiche 2) RDA: Richiesta di Autorizzazione interna 3) OFFERTE: Raccolta preventivi fornitori 4) VERIFICA: Controllo documentazione e conformità 5) FIRME: Approvazioni finali e contratti. Ogni fase può essere: Non iniziata, In corso, Completata. Lo stato generale si calcola automaticamente. Solo con tutte le fasi 'Completate' si può generare l'ordine ufficiale."
        },
        {
            id: 9,
            category: "orders",
            question: "Come funziona la generazione automatica dei codici ordine?",
            answer: "Sistema di codificazione automatica: FORMATO: ORD-YYYY-XXX (es. ORD-2024-001) 1) YYYY = Anno corrente 2) XXX = Numero progressivo a 3 cifre 3) Il sistema trova automaticamente il prossimo numero disponibile 4) Puoi sovrascrivere con un codice personalizzato se necessario 5) Codici univoci: non sono ammessi duplicati 6) Integrazione sistemi esterni: usa codici personalizzati per mappature con altri software aziendali."
        },
        {
            id: 10,
            category: "orders",
            question: "Come importo ordini da Excel? Che formato devo usare?",
            answer: "Import ordini Excel - Formato richiesto: COLONNE OBBLIGATORIE: ordine(si intende il codice dell'ordine), nome_driver, marca, modello, fornitore, data_ordine, consegnata (true/false). FORMATO DATE: YYYY-MM-DD o DD/MM/YYYY. PROCESSO: 1) Clicca 'Carica Excel' in Ordini in Corso 2) Il sistema cerca driver corrispondenti per nome_driver 3) Se trova match esatti, crea ordini 4) Driver non trovati = errore importazione 5) Verifica sempre i dati prima dell'import."
        },
        {
            id: 11,
            category: "orders",
            question: "Posso modificare un ordine dopo averlo creato?",
            answer: "Modifica ordini possibile SEMPRE in ogni momento."
        },
        // ========== FUEL CARDS ==========
        {
            id: 12,
            category: "fuel",
            question: "Come richiedo una fuel card per un driver?",
            answer: "Processo richiesta fuel card: 1) Vai in 'Fuel Cards' → 'Nuova Fuel Card' 2) Cerca e seleziona driver (auto-compila i campi del driver) 3) Inserisci data richiesta 4) Seleziona stato iniziale (solitamente 'Non arrivata') 5) Aggiungi campo 'personale' 6) Salva. Il sistema collega automaticamente la fuel card al driver e eredita tutti i suoi dati veicolo. Una modifica al driver aggiorna automaticamente le fuel cards associate."
        },
        {
            id: 13,
            category: "fuel",
            question: "Cosa significano i diversi stati delle fuel card?",
            answer: "3 Stati fuel card e loro significato: 1) NON ARRIVATA = Richiesta inviata al fornitore, carta non ancora ricevuta dall'azienda, in attesa di produzione/spedizione 2) IN ATTESA = Carta fisica ricevuta dall'azienda ma non ancora consegnata/attivata per il driver finale 3) ARRIVATA = Carta consegnata al driver e completamente operativa per rifornimenti. Usa questi stati per tracciare il ciclo completo di vita delle fuel cards e identificare ritardi."
        },
        {
            id: 14,
            category: "fuel",
            question: "Posso modificare i dati di una fuel card dopo la creazione?",
            answer: "Modifica fuel cards: DATI NON MODIFICABILI (ereditati dal driver): Targa, Nome Driver, Società, Alimentazione - per cambiarli modifica il driver associato. DATI MODIFICABILI: Data richiesta, Stato (Non arrivata/In attesa/Arrivata), personale. PROCESSO: 1) Clicca icona matita sulla fuel card 2) Modifica solo campi consentiti 3) Salva modifiche. Le modifiche al driver padre si riflettono automaticamente su tutte le fuel cards associate."
        },
        {
            id: 15,
            category: "fuel",
            question: "Come importo fuel cards da Excel?",
            answer: "Import fuel cards Excel: COLONNE RICHIESTE: nome_driver (deve corrispondere esattamente), targa, societa, alimentazione, data_richiesta (YYYY-MM-DD), stato, personale. PROCESSO: 1) 'Carica Excel' in Fuel Cards 2) Sistema cerca driver corrispondente per nome_driver 3) Valida coerenza dati (targa deve corrispondere al driver) 4) Crea fuel cards se validazione OK. ERRORI COMUNI: Nome driver non trovato, targa non corrispondente, date formato sbagliato."
        },

        // ========== REPORTS E ANALYTICS ==========
        {
            id: 16,
            category: "reports",
            question: "Come esporto dati in Excel dai Reports?",
            answer: "Export Excel multipli: DASHBOARD: 'Esporta Excel' esporta tutti i driver visibili nella tabella. REPORTS: 1) Applica filtri desiderati (Analisi Dati) 2) Clicca 'Esporta Excel' o 'Esporta Filtrati' 3) Il file include solo dati che rispettano i filtri attivi. SEZIONI SPECIFICHE: Ogni sezione (Driver, Ordini, Fuel Cards) ha export dedicato. FORMATO: File .xlsx con colonne ottimizzate per analisi pivot e formule Excel."
        },
        {
            id: 17,
            category: "reports",
            question: "Come interpreto i grafici delle emissioni CO2?",
            answer: "Analisi emissioni CO2: FASCE EMISSIONI: 0-100 g/km (Ecologico), 101-130 g/km (Efficiente), 131-160 g/km (Standard), 161-200 g/km (Alto), 201+ g/km (Molto Alto). UTILIZZO: 1) Policy aziendale: preferire veicoli fasce basse 2) Incentivi fiscali: molti Paesi premiano emissioni < 130 g/km 3) Compliance ambientale: traccia miglioramenti flotta 4) Budget: veicoli ecologici spesso costano meno in tasse/bolli."
        },
        {
            id: 18,
            category: "reports",
            question: "Come funzionano i filtri avanzati nei Reports?",
            answer: "Sistema filtri avanzati: TIPI FILTRI: 1) STRINGHE: Uguaglianza esatta (es. Società = 'ACME SpA') 2) NUMERI: Operatori >, <, >=, <=, = (es. Canone > 500) 3) DATE: Confronti temporali (es. Scadenza < 2024-12-31). COMBINAZIONI: Filtri multipli in AND (tutti devono essere veri). APPLICAZIONE: 1) Clicca 'Analisi Dati' 2) 'Aggiungi Filtro' 3) Seleziona campo, operatore, valore 4) Grafici si aggiornano automaticamente. MASSIMO 7 colonne visibili contemporaneamente."
        },
        {
            id: 19,
            category: "reports",
            question: "Cosa rappresentano i grafici di distribuzione canoni?",
            answer: "Analisi distribuzione canoni mensili: FASCE: €0-500 (Economico), €501-750 (Medio-Basso), €751-900 (Medio), €901-1150 (Medio-Alto), €1151-1600 (Alto), €1601+ (Premium). UTILIZZO: 1) Budget planning: identifica concentrazioni costi 2) Negoziazione: veicoli fuori fascia da rinegoziare 3) Policy aziendale: definire tetti massimi per categoria 4) Benchmark: confronta con standard mercato."
        },
        {
            id: 20,
            category: "reports",
            question: "Come monitoro le scadenze contrattuali?",
            answer: "Monitoraggio scadenze: DASHBOARD: Sezione 'In Scadenza (6m)' mostra contratti scadenza prossimi 6 mesi. REPORTS: 1) Filtro 'Scadenza Contratto' < data limite 2) Ordina per data crescente 3) Export per pianificare rinnovi. AZIONI PREVENTIVE: 1) Alert 90 giorni prima 2) Contatto noleggiatori per rinnovi 3) Valutazione alternative mercato 4) Budget approvazioni per nuovi contratti."
        },

        // ========== SISTEMA E TROUBLESHOOTING ==========
        {
            id: 21,
            category: "system",
            question: "Come funzionano i permessi utente nel sistema?",
            answer: "3 Livelli di accesso: CREATORE (Admin completo): Tutti i permessi, gestione utenti, configurazioni sistema, database, backup. MANAGER: Gestione completa dati (driver, ordini, fuel cards), reports, export, ma NO configurazioni sistema. USER: Visualizzazione dati, ricerche, export limitati, NO creazione/modifica/eliminazione. ASSEGNAZIONE: Solo il Creatore può modificare ruoli utenti. Permessi NON sono auto-modificabili per sicurezza."
        },
        {
            id: 22,
            category: "system",
            question: "Cosa fare se il sistema è lento o non risponde?",
            answer: "Troubleshooting prestazioni: VERIFICA: 1) Connessione internet stabile 2) Browser aggiornato (Chrome, Firefox, Safari ultimi) 3) Cache browser piena (Ctrl+F5 per refresh forzato) 4) Troppi filtri attivi. SOLUZIONI: 1) Chiudi altre schede browser 2) Riavvia browser 3) Cancella cache e cookies 4) Disattiva estensioni browser 5) Controlla firewall aziendale. Se persiste, contatta supporto tecnico con dettagli browser e errori console."
        },
        {
            id: 23,
            category: "system",
            question: "Come gestisco errori di import Excel?",
            answer: "Risoluzione errori import: ERRORI COMUNI: 1) 'Driver non trovato': Nome driver in Excel non corrisponde esattamente a quello nel sistema 2) 'Formato data invalido': Usa YYYY-MM-DD o DD/MM/YYYY 3) 'Colonna mancante': Verifica intestazioni Excel 4) 'File troppo grande': Max 1000 righe per import. DEBUGGING: 1) Esporta prima i dati esistenti per vedere formato corretto 2) Confronta intestazioni 3) Import piccoli batch per identificare righe problematiche."
        },
        {
            id: 24,
            category: "system",
            question: "Come faccio backup dei miei dati?",
            answer: "Strategia backup completa: AUTOMATICO: Il sistema Supabase fa backup automatici giornalieri. MANUALE: 1) DRIVER: 'Esporta Excel' da Gestione Driver 2) ORDINI: Export da entrambe sezioni Ordini 3) FUEL CARDS: Export da sezione Fuel Cards 4) DOCUMENTI: Download manuale da sezione allegati driver. FREQUENZA CONSIGLIATA: Backup settimanale prima di operazioni massive. STORAGE: Salva backup in cloud aziendale o drive personale sicuro."
        },
        {
            id: 25,
            category: "system",
            question: "Posso accedere al sistema da dispositivi mobili?",
            answer: "Al momento no."
        },
        {
            id: 26,
            category: "system",
            question: "Cosa fare se ho perso la password o non riesco ad accedere?",
            answer: "Contatta l'amministratore del sistema per il reset della password. Il Creatore può reimpostare le password degli altri utenti. Se sei il Creatore e hai perso l'accesso, contatta il supporto tecnico per assistenza. Non esiste un processo di recupero automatico delle password per motivi di sicurezza."
        }
    ];

    const categories = [
        { id: "all", label: "Tutte", icon: Book },
        { id: "driver", label: "Gestione Driver", icon: Car },
        { id: "orders", label: "Ordini", icon: FileText },
        { id: "fuel", label: "Fuel Cards", icon: CreditCard },
        { id: "reports", label: "Reports", icon: BarChart3 },
        { id: "system", label: "Sistema", icon: Settings },
    ];

    const filteredFAQs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleContactSupport = () => {
        const subject = "Richiesta supporto - TARS Fleet Management";
        const body = `Gentile supporto tecnico,

Sto utilizzando il sistema TARS Fleet Management e ho bisogno di assistenza.

Dettagli della richiesta:
- Sezione: FAQ & Supporto
- Data: ${new Date().toLocaleDateString('it-IT')}
- Ora: ${new Date().toLocaleTimeString('it-IT')}

Descrizione del problema o richiesta:
[Inserisci qui la descrizione dettagliata]

Informazioni tecniche:
- Browser: ${navigator.userAgent}
- URL: ${window.location.href}

Grazie per l'assistenza.

Cordiali saluti`;

        const mailtoLink = `mailto:stefano.albera@partners.basf.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        try {
            window.open(mailtoLink, '_blank');
        } catch (error) {
            // Fallback: copia l'email negli appunti
            navigator.clipboard.writeText('stefano.albera@partners.basf.com').then(() => {
                alert('Email copiata negli appunti: stefano.albera@partners.basf.com');
            }).catch(() => {
                alert('Contatta il supporto all\'indirizzo: stefano.albera@partners.basf.com');
            });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(categoryId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        FAQ & Supporto
                    </h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Trova risposte alle domande più comuni sul gestionale flotta
                    </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-blue-50"}`}>
                    <HelpCircle className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                <input
                    type="text"
                    placeholder="Cerca nelle FAQ..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-transparent"
                        }`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <FAQCategory
                        key={category.id}
                        category={category}
                        isActive={activeCategory === category.id}
                        isDarkMode={isDarkMode}
                        onClick={() => handleCategoryClick(category.id)}
                    />
                ))}
            </div>

            {/* Results Count */}
            {searchTerm && (
                <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Trovate <span className="font-medium">{filteredFAQs.length}</span> FAQ corrispondenti alla ricerca "{searchTerm}"
                    </p>
                </div>
            )}

            {/* FAQ Cards */}
            <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                    <div className={`text-center py-12 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} rounded-lg`}>
                        <MessageCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                        <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Nessuna FAQ trovata
                        </h3>
                        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Prova a modificare i termini di ricerca o la categoria
                        </p>
                    </div>
                ) : (
                    filteredFAQs.map((faq) => (
                        <FAQCard
                            key={faq.id}
                            faq={faq}
                            isDarkMode={isDarkMode}
                        />
                    ))
                )}
            </div>

            {/* Contact Support */}
            <div className={`p-6 rounded-lg border-2 border-dashed ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
                }`}>
                <div className="text-center">
                    <MessageCircle className={`w-8 h-8 mx-auto mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                    <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Non trovi quello che cerchi?
                    </h3>
                    <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Contatta il supporto tecnico per assistenza personalizzata
                    </p>
                    <button
                        onClick={handleContactSupport}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Contatta Supporto
                    </button>
                    <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        stefano.albera@partners.basf.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FAQs;
