/**
 * Legal pages: Privacy policy here; the Terms and conditions are versioned in
 * ./terms (guests accept one exact version, so old ones must stay readable).
 * Romanian is the binding version; EN and DE are faithful translations.
 * Placeholders in [brackets] must be filled in by the owner before going live.
 */
export type LegalDoc = { title: string; updated: string; intro?: string; sections: { id?: string; h: string; p?: string[]; ul?: string[] }[] };

const CO = {
  name: "SERENITY ADMIN APARTAMENTE SRL",
  cui: "47339489",
  regCom: "J32/2691/2022",
  address: "Fundătura Lupeni nr. 2, 550205 Sibiu, România",
  email: "serenityhouseap@gmail.com",
};

const roPrivacy: LegalDoc = {
  title: "Politica de confidențialitate",
  updated: "28.10.2026",
  intro:
    "Această politică explică ce date personale prelucrăm când vizitați site-ul, ne scrieți sau rezervați un apartament, de ce le prelucrăm și ce drepturi aveți, conform Regulamentului (UE) 2016/679 (GDPR).",
  sections: [
    {
      h: "1. Operatorul de date",
      p: [`Operatorul datelor este ${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. Pentru orice întrebare legată de datele personale, scrieți-ne la ${CO.email}.`],
    },
    {
      h: "2. Ce date prelucrăm",
      ul: [
        "Date de rezervare: nume, e-mail, telefon, țară, datele sejurului, apartamentul, numărul de persoane, prețul și nota opțională.",
        "Date despre plată: starea plății și identificatorul tranzacției NETOPIA. Nu primim și nu stocăm datele cardului.",
        "Datele cerute de lege pentru evidența turiștilor cazați, atunci când legea o impune.",
        "Mesajele trimise prin formularul de contact sau pe e-mail.",
        "Jurnale tehnice ale serverului (de exemplu, adresa IP, data și ora, pagina accesată), pentru securitate și funcționare.",
        "Evidența acceptării termenilor și a regulilor casei: data și ora, adresa IP, browserul, versiunea termenilor și textul bifat.",
        "Dacă apare o pagubă: fotografiile și video-urile apartamentului, devizele sau facturile de reparație și corespondența cu dumneavoastră.",
      ],
    },
    { h: "2a. Check-in online", p: ["Înainte de sosire vă putem cere să completați formularul de check-in online: nume complet, adresa de domiciliu, email, opțional telefonul, opțional CNP-ul (doar pentru cetățenii români, dacă doriți să apară pe factură) și, opțional, datele firmei pentru factură. Folosim aceste date pentru emiterea facturii (obligație legală, art. 6 alin. (1) lit. c GDPR) și pentru evidența oaspeților cerută de lege. CNP-ul este stocat criptat (AES-256) și este accesibil doar operatorului. Datele de check-in se păstrează 10 ani, ca documente justificative contabile, apoi se șterg."] },
      {
      h: "3. Scopuri și temeiuri legale",
      ul: [
        "Încheierea și executarea contractului de cazare (rezervare, plată, comunicări despre sejur, acces în apartament): art. 6 alin. (1) lit. b GDPR.",
        "Obligații legale (evidență contabilă și facturare, evidența turiștilor și alte obligații din domeniul turismului, colectarea taxei locale): art. 6 alin. (1) lit. c GDPR.",
        "Interesul legitim (securitatea site-ului, prevenirea fraudei, răspunsul la mesajele dumneavoastră): art. 6 alin. (1) lit. f GDPR.",
        "Interesul legitim de a dovedi încheierea contractului și de a constata, exercita sau apăra un drept în justiție, de exemplu o pretenție pentru pagube (evidența acceptării, dovezile pagubei): art. 6 alin. (1) lit. f GDPR.",
      ],
      p: ["Nu trimitem e-mailuri de marketing și nu facem profilare sau decizii automate."],
    },
    {
      h: "4. Cui transmitem datele",
      ul: [
        "NETOPIA Payments (NETOPIA FINANCIAL SERVICES S.A.), pentru procesarea plăților.",
        "Vercel Inc., pentru găzduirea site-ului.",
        "Neon, pentru baza de date.",
        "Resend, pentru trimiterea e-mailurilor legate de rezervare.",
        "Contabilul nostru, pentru evidența contabilă.",
        "Booking.com, doar pentru rezervările făcute prin Booking.com.",
        "Autoritățile publice, atunci când legea ne obligă.",
      ],
      p: ["Furnizorii de servicii prelucrează datele doar la instrucțiunile noastre, pe baza unor contracte de prelucrare a datelor."],
    },
    {
      h: "5. Transferuri în afara SEE",
      p: [
        "Unii furnizori (de exemplu, Vercel) pot prelucra date în Statele Unite. În aceste cazuri, transferul este protejat prin clauzele contractuale standard aprobate de Comisia Europeană.",
      ],
    },
    {
      h: "6. Cât timp păstrăm datele",
      ul: [
        "Datele de rezervare și documentele contabile: 10 ani, conform Legii contabilității nr. 82/1991.",
        "Mesajele de contact: 2 ani.",
        "Evidența acceptării termenilor și dovezile unei pagube: 3 ani de la sfârșitul sejurului, termenul general de prescripție (art. 2517 Cod civil). Dacă o pretenție este în curs, până la soluționarea ei definitivă.",
        "Jurnalele tehnice: 30 de zile.",
      ],
    },
    {
      h: "7. Drepturile dumneavoastră",
      p: ["Aveți dreptul:"],
      ul: [
        "de acces la datele dumneavoastră;",
        "la rectificarea datelor inexacte;",
        "la ștergerea datelor, când nu mai avem un temei să le păstrăm;",
        "la restricționarea prelucrării;",
        "la portabilitatea datelor;",
        "de opoziție la prelucrarea bazată pe interesul legitim;",
        "de a depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), www.dataprotection.ro.",
      ],
    },
    {
      h: "8. Cookie-uri",
      p: [
        "Folosim doar cookie-uri strict necesare: un cookie de sesiune pentru zona de administrare, folosit doar de proprietar. Nu folosim cookie-uri de analiză, de urmărire sau de publicitate, iar fonturile sunt găzduite pe propriul server. De aceea nu vă cerem consimțământul pentru cookie-uri.",
      ],
    },
    {
      h: "9. Securitate",
      p: [
        "Site-ul folosește conexiune criptată (HTTPS), iar accesul la date este limitat la persoanele care au nevoie de ele. Plățile se fac pe pagina securizată a NETOPIA Payments, cu 3-D Secure.",
      ],
    },
    {
      h: "10. Modificări",
      p: [
        "Putem actualiza această politică. Versiunea curentă este întotdeauna publicată pe această pagină, cu data ultimei actualizări. Politica este disponibilă în română, engleză și germană; în caz de neconcordanță, prevalează versiunea în limba română.",
      ],
    },
    {
      h: "11. Contact",
      p: [`Pentru exercitarea drepturilor sau orice întrebare: ${CO.email}. Vă răspundem în cel mult o lună de la primirea cererii.`],
    },
  ],
};

const enPrivacy: LegalDoc = {
  title: "Privacy policy",
  updated: "28 October 2026",
  intro:
    "This policy explains what personal data we process when you visit the website, write to us or book an apartment, why we process it and what rights you have under Regulation (EU) 2016/679 (GDPR). This is a translation; the Romanian version prevails.",
  sections: [
    {
      h: "1. Data controller",
      p: [`The controller is ${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. For any question about your personal data, email us at ${CO.email}.`],
    },
    {
      h: "2. What data we process",
      ul: [
        "Booking data: name, email, phone, country, stay dates, apartment, number of guests, price and the optional note.",
        "Payment data: payment status and the NETOPIA transaction ID. We never receive or store card details.",
        "The data required by law for registering accommodated guests, where the law requires it.",
        "Messages sent through the contact form or by email.",
        "Technical server logs (for example IP address, date and time, page requested), for security and operation.",
        "The record of your acceptance of the terms and house rules: date and time, IP address, browser, terms version and the text you ticked.",
        "If damage occurs: photos and videos of the apartment, repair estimates or invoices, and our correspondence with you.",
      ],
    },
    { h: "2a. Online check-in", p: ["Before arrival we may ask you to complete the online check-in form: full name, home address, email, optionally your phone, optionally your CNP (Romanian personal numeric code, only for Romanian citizens who want it on the invoice) and optionally company details for the invoice. We use these data to issue the invoice (legal obligation, Art. 6(1)(c) GDPR) and for the guest records required by law. The CNP is stored encrypted (AES-256) and is accessible only to the operator. Check-in data are kept for 10 years as accounting records, then deleted."] },
      {
      h: "3. Purposes and legal bases",
      ul: [
        "Concluding and performing the accommodation contract (booking, payment, messages about your stay, access to the apartment): art. 6(1)(b) GDPR.",
        "Legal obligations (accounting and invoicing, guest registration and other tourism obligations, collecting the local tax): art. 6(1)(c) GDPR.",
        "Legitimate interest (website security, fraud prevention, replying to your messages): art. 6(1)(f) GDPR.",
        "Legitimate interest in proving the contract and in establishing, exercising or defending legal claims, for example a damage claim (acceptance record, evidence of damage): art. 6(1)(f) GDPR.",
      ],
      p: ["We do not send marketing emails and do not carry out profiling or automated decision-making."],
    },
    {
      h: "4. Who receives the data",
      ul: [
        "NETOPIA Payments (NETOPIA FINANCIAL SERVICES S.A.), to process payments.",
        "Vercel Inc., to host the website.",
        "Neon, for the database.",
        "Resend, to send booking-related emails.",
        "Our accountant, for bookkeeping.",
        "Booking.com, only for bookings made through Booking.com.",
        "Public authorities, when the law requires it.",
      ],
      p: ["Service providers process the data only on our instructions, under data processing agreements."],
    },
    {
      h: "5. Transfers outside the EEA",
      p: [
        "Some providers (for example Vercel) may process data in the United States. In those cases the transfer is protected by the standard contractual clauses approved by the European Commission.",
      ],
    },
    {
      h: "6. How long we keep the data",
      ul: [
        "Booking data and accounting records: 10 years, under Romanian Accounting Law no. 82/1991.",
        "Contact messages: 2 years.",
        "The acceptance record and any evidence of damage: 3 years after the end of the stay, the general limitation period (art. 2517 Romanian Civil Code). If a claim is pending, until it is finally settled.",
        "Technical logs: 30 days.",
      ],
    },
    {
      h: "7. Your rights",
      p: ["You have the right:"],
      ul: [
        "to access your data;",
        "to have inaccurate data corrected;",
        "to have your data erased when we no longer have a reason to keep it;",
        "to restrict processing;",
        "to data portability;",
        "to object to processing based on legitimate interest;",
        "to lodge a complaint with the Romanian data protection authority (ANSPDCP), www.dataprotection.ro.",
      ],
    },
    {
      h: "8. Cookies",
      p: [
        "We use only strictly necessary cookies: a session cookie for the admin area, used only by the owner. We use no analytics, tracking or advertising cookies, and fonts are self-hosted. That is why we do not ask for cookie consent.",
      ],
    },
    {
      h: "9. Security",
      p: [
        "The website uses an encrypted connection (HTTPS), and access to data is limited to the people who need it. Payments are made on the secure NETOPIA Payments page, with 3-D Secure.",
      ],
    },
    {
      h: "10. Changes",
      p: [
        "We may update this policy. The current version is always published on this page, with the date of the last update. The policy is available in Romanian, English and German; in case of any discrepancy, the Romanian version prevails.",
      ],
    },
    {
      h: "11. Contact",
      p: [`To exercise your rights or for any question: ${CO.email}. We reply within one month of receiving your request.`],
    },
  ],
};

const dePrivacy: LegalDoc = {
  title: "Datenschutzerklärung",
  updated: "28.10.2026",
  intro:
    "Diese Erklärung beschreibt, welche personenbezogenen Daten wir verarbeiten, wenn Sie die Website besuchen, uns schreiben oder ein Apartment buchen, warum wir sie verarbeiten und welche Rechte Sie nach der Verordnung (EU) 2016/679 (DSGVO) haben. Dies ist eine Übersetzung; maßgeblich ist die rumänische Fassung.",
  sections: [
    {
      h: "1. Verantwortlicher",
      p: [`Verantwortlicher ist ${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. Bei Fragen zu Ihren personenbezogenen Daten schreiben Sie uns an ${CO.email}.`],
    },
    {
      h: "2. Welche Daten wir verarbeiten",
      ul: [
        "Buchungsdaten: Name, E-Mail, Telefon, Land, Aufenthaltsdaten, Apartment, Personenzahl, Preis und die optionale Notiz.",
        "Zahlungsdaten: Zahlungsstatus und die NETOPIA-Transaktions-ID. Kartendaten erhalten und speichern wir niemals.",
        "Die gesetzlich vorgeschriebenen Daten zur Gästeregistrierung, sofern das Gesetz dies verlangt.",
        "Nachrichten über das Kontaktformular oder per E-Mail.",
        "Technische Server-Logs (zum Beispiel IP-Adresse, Datum und Uhrzeit, aufgerufene Seite) für Sicherheit und Betrieb.",
        "Der Nachweis Ihrer Zustimmung zu den Bedingungen und zur Hausordnung: Datum und Uhrzeit, IP-Adresse, Browser, Version der Bedingungen und der angekreuzte Text.",
        "Bei einem Schaden: Fotos und Videos des Apartments, Kostenvoranschläge oder Reparaturrechnungen und unsere Korrespondenz mit Ihnen.",
      ],
    },
    { h: "2a. Online-Check-in", p: ["Vor der Anreise können wir Sie bitten, das Online-Check-in-Formular auszufüllen: vollständiger Name, Wohnadresse, E-Mail, optional Telefon, optional die CNP (rumänische persönliche Identifikationsnummer, nur für rumänische Staatsbürger, die sie auf der Rechnung wünschen) und optional Firmendaten für die Rechnung. Wir verwenden diese Daten zur Rechnungsstellung (rechtliche Verpflichtung, Art. 6 Abs. 1 lit. c DSGVO) und für das gesetzlich vorgeschriebene Gästeregister. Die CNP wird verschlüsselt (AES-256) gespeichert und ist nur dem Betreiber zugänglich. Check-in-Daten werden 10 Jahre als Buchhaltungsbelege aufbewahrt und danach gelöscht."] },
      {
      h: "3. Zwecke und Rechtsgrundlagen",
      ul: [
        "Abschluss und Erfüllung des Beherbergungsvertrags (Buchung, Zahlung, Mitteilungen zum Aufenthalt, Zugang zum Apartment): Art. 6 Abs. 1 lit. b DSGVO.",
        "Rechtliche Pflichten (Buchhaltung und Rechnungsstellung, Gästeregistrierung und sonstige touristische Pflichten, Erhebung der lokalen Steuer): Art. 6 Abs. 1 lit. c DSGVO.",
        "Berechtigtes Interesse (Sicherheit der Website, Betrugsprävention, Beantwortung Ihrer Nachrichten): Art. 6 Abs. 1 lit. f DSGVO.",
        "Berechtigtes Interesse am Nachweis des Vertrags und an der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen, zum Beispiel einer Schadensforderung (Zustimmungsnachweis, Schadensnachweise): Art. 6 Abs. 1 lit. f DSGVO.",
      ],
      p: ["Wir versenden keine Marketing-E-Mails und führen kein Profiling und keine automatisierten Entscheidungen durch."],
    },
    {
      h: "4. Empfänger der Daten",
      ul: [
        "NETOPIA Payments (NETOPIA FINANCIAL SERVICES S.A.) zur Zahlungsabwicklung.",
        "Vercel Inc. für das Hosting der Website.",
        "Neon für die Datenbank.",
        "Resend für den Versand buchungsbezogener E-Mails.",
        "Unser Buchhalter für die Buchführung.",
        "Booking.com, nur für Buchungen über Booking.com.",
        "Behörden, wenn das Gesetz es verlangt.",
      ],
      p: ["Dienstleister verarbeiten die Daten nur nach unseren Weisungen und auf Grundlage von Auftragsverarbeitungsverträgen."],
    },
    {
      h: "5. Übermittlungen außerhalb des EWR",
      p: [
        "Einige Dienstleister (zum Beispiel Vercel) können Daten in den Vereinigten Staaten verarbeiten. In diesen Fällen ist die Übermittlung durch die von der Europäischen Kommission genehmigten Standardvertragsklauseln abgesichert.",
      ],
    },
    {
      h: "6. Speicherdauer",
      ul: [
        "Buchungsdaten und Buchhaltungsunterlagen: 10 Jahre, gemäß dem rumänischen Buchhaltungsgesetz Nr. 82/1991.",
        "Kontaktnachrichten: 2 Jahre.",
        "Der Zustimmungsnachweis und etwaige Schadensnachweise: 3 Jahre nach Ende des Aufenthalts, die allgemeine Verjährungsfrist (Art. 2517 rumänisches Zivilgesetzbuch). Ist eine Forderung offen, bis zu ihrer endgültigen Erledigung.",
        "Technische Logs: 30 Tage.",
      ],
    },
    {
      h: "7. Ihre Rechte",
      p: ["Sie haben das Recht:"],
      ul: [
        "auf Auskunft über Ihre Daten;",
        "auf Berichtigung unrichtiger Daten;",
        "auf Löschung Ihrer Daten, wenn wir keinen Grund mehr haben, sie aufzubewahren;",
        "auf Einschränkung der Verarbeitung;",
        "auf Datenübertragbarkeit;",
        "auf Widerspruch gegen eine Verarbeitung, die auf berechtigtem Interesse beruht;",
        "auf Beschwerde bei der rumänischen Datenschutzbehörde (ANSPDCP), www.dataprotection.ro.",
      ],
    },
    {
      h: "8. Cookies",
      p: [
        "Wir verwenden nur unbedingt erforderliche Cookies: ein Sitzungs-Cookie für den Verwaltungsbereich, das nur der Eigentümer nutzt. Wir verwenden keine Analyse-, Tracking- oder Werbe-Cookies, und Schriftarten werden auf dem eigenen Server gehostet. Deshalb bitten wir Sie nicht um eine Cookie-Einwilligung.",
      ],
    },
    {
      h: "9. Sicherheit",
      p: [
        "Die Website verwendet eine verschlüsselte Verbindung (HTTPS), und der Zugriff auf Daten ist auf die Personen beschränkt, die ihn benötigen. Zahlungen erfolgen auf der sicheren Seite von NETOPIA Payments mit 3-D Secure.",
      ],
    },
    {
      h: "10. Änderungen",
      p: [
        "Wir können diese Erklärung aktualisieren. Die aktuelle Fassung wird stets auf dieser Seite mit dem Datum der letzten Aktualisierung veröffentlicht. Die Erklärung liegt auf Rumänisch, Englisch und Deutsch vor; bei Abweichungen ist die rumänische Fassung maßgeblich.",
      ],
    },
    {
      h: "11. Kontakt",
      p: [`Zur Ausübung Ihrer Rechte oder bei Fragen: ${CO.email}. Wir antworten innerhalb eines Monats nach Eingang Ihrer Anfrage.`],
    },
  ],
};

export const LEGAL: Record<"en" | "ro" | "de", { privacy: LegalDoc }> = {
  ro: { privacy: roPrivacy },
  en: { privacy: enPrivacy },
  de: { privacy: dePrivacy },
};

