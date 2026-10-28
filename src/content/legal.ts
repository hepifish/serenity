/**
 * Legal pages: Terms and conditions + Privacy policy.
 * Romanian is the binding version; EN and DE are faithful translations.
 * Placeholders in [brackets] must be filled in by the owner before going live.
 */

export type LegalDoc = { title: string; updated: string; intro?: string; sections: { h: string; p?: string[]; ul?: string[] }[] };

const CO = {
  name: "SERENITY ADMIN APARTAMENTE SRL",
  cui: "47339489",
  regCom: "J32/2691/2022",
  address: "Fundătura Lupeni nr. 2, 550205 Sibiu, România",
  email: "serenityhouseap@gmail.com",
};

// ───────────────────────── Română (versiunea obligatorie) ─────────────────────────

const roTerms: LegalDoc = {
  title: "Termeni și condiții",
  updated: "28.10.2026",
  intro:
    "Acești termeni se aplică rezervărilor făcute direct pe acest site pentru apartamentele Serenity din Sibiu. Vă rugăm să îi citiți înainte de a rezerva. Prin bifarea căsuței de acceptare și plata rezervării, confirmați că i-ați citit și îi acceptați.",
  sections: [
    {
      h: "1. Operatorul",
      p: [
        `Serviciile sunt oferite de ${CO.name}, cu sediul în ${CO.address}, CUI ${CO.cui}, înregistrată la Registrul Comerțului sub nr. ${CO.regCom}. Societatea nu este înregistrată în scopuri de TVA.`,
        "Apartamentele se află în Fundătura Lupeni nr. 2, Sibiu. Certificat de clasificare: [nr. certificat de clasificare].",
        `E-mail: ${CO.email}`,
      ],
    },
    {
      h: "2. Definiții",
      ul: [
        "„Operatorul”, „noi”: SERENITY ADMIN APARTAMENTE SRL.",
        "„Oaspetele”, „dumneavoastră”: persoana care face rezervarea și persoanele cazate împreună cu ea.",
        "„Apartamentul”: unitatea de cazare rezervată (Film Studio, Gothic Chambers, Art Station sau, după deschidere, Pink Panther).",
        "„Rezervarea”: cazarea într-un apartament, pentru datele și numărul de persoane alese pe site.",
        "„Sejurul”: perioada dintre data sosirii (check-in) și data plecării (check-out).",
      ],
    },
    {
      h: "3. Rezervare și încheierea contractului",
      p: [
        "Pe site alegeți apartamentul și datele, apoi completați numele, adresa de e-mail, telefonul, țara și, opțional, o notă. Pentru a continua trebuie să acceptați acești termeni.",
        "După trimiterea formularului, apartamentul este reținut pentru dumneavoastră timp de 20 de minute, cât să finalizați plata. Dacă plata nu este finalizată în acest interval, rezervarea expiră și datele devin din nou disponibile.",
        "Contractul se încheie în momentul în care plata este confirmată și vă trimitem e-mailul de confirmare a rezervării. Acest e-mail conține detaliile rezervării și suma plătită.",
        "Fiecare apartament găzduiește cel mult 4 persoane. Sejurul minim este afișat la rezervare (de regulă 2 nopți).",
        "Puteți rezerva apartamentele și prin Booking.com. Pentru acele rezervări se aplică termenii și politicile afișate pe Booking.com, nu acești termeni.",
      ],
    },
    {
      h: "4. Prețuri și taxe",
      p: [
        "Prețurile sunt afișate în lei (RON). Prețul total al rezervării cuprinde:",
      ],
      ul: [
        "tariful pe noapte, pentru fiecare noapte a sejurului;",
        "taxa de curățenie, o singură dată pe sejur;",
        "taxa specială pentru promovarea turistică a municipiului Sibiu, de 2% din valoarea cazării (HCL nr. 462/2025 a Consiliului Local Sibiu), afișată separat. O colectăm de la dumneavoastră și o virăm municipiului.",
      ],
    },
    {
      h: "5. Plată",
      p: [
        "Plătiți integral, online, în momentul rezervării. Plata se face prin NETOPIA Payments (NETOPIA FINANCIAL SERVICES S.A.), pe pagina securizată a procesatorului, cu autentificare 3-D Secure.",
        "Acceptăm carduri Visa și Mastercard, Apple Pay și Google Pay, precum și carduri de vacanță (Edenred, Up Romania, Pluxee). Prețul este același indiferent de metoda de plată.",
        "Nu primim și nu stocăm datele cardului dumneavoastră. Acestea sunt introduse și prelucrate exclusiv de NETOPIA Payments.",
      ],
    },
    {
      h: "6. Factura",
      p: [
        "Pentru fiecare rezervare, SERENITY ADMIN APARTAMENTE SRL emite factură prin sistemul RO e-Factura.",
        "Dacă doriți factură pe o firmă, scrieți denumirea firmei și CUI-ul în câmpul de notă la rezervare.",
      ],
    },
    {
      h: "7. Anulare, modificare și rambursare",
      p: ["Această secțiune reprezintă și politica noastră de returnare și rambursare."],
      ul: [
        "Anulare gratuită cu cel puțin 7 zile înainte de data sosirii: primiți înapoi întreaga sumă plătită.",
        "Anulare cu mai puțin de 7 zile înainte de data sosirii sau neprezentare: se reține 100% din valoarea rezervării, iar suma nu se rambursează.",
        "Anularea se face prin e-mail la serenityhouseap@gmail.com, menționând numele și datele rezervării. Data anulării este data primirii e-mailului.",
        "Rambursarea se face pe metoda de plată folosită inițial (card bancar sau card de vacanță), în cel mult 14 zile de la anulare.",
        "Modificarea datelor este posibilă la cerere, în funcție de disponibilitate. O diferență de preț se achită sau se rambursează, după caz.",
        "Putem anula noi rezervarea doar în caz de forță majoră sau dacă apartamentul devine inutilizabil. În acest caz vă rambursăm integral suma plătită.",
      ],
    },
    {
      h: "8. Dreptul de retragere",
      p: [
        "Dreptul de retragere de 14 zile nu se aplică rezervărilor de cazare, deoarece acestea sunt servicii de cazare prestate la o dată sau într-o perioadă anume (art. 16 lit. l din OUG nr. 34/2014). Anularea este posibilă doar în condițiile de la punctul 7.",
      ],
    },
    {
      h: "9. Prestarea serviciului: acces, check-in și check-out",
      ul: [
        "Înainte de sosire vă trimitem pe e-mail instrucțiunile de acces în apartament.",
        "Check-in-ul se face începând cu ora 15:00, fără recepție, cu cheia din cutia cu cifru (self check-in).",
        "Check-out-ul se face până la ora 11:00.",
      ],
    },
    {
      h: "10. Regulile casei",
      ul: [
        "Fumatul este interzis în apartament.",
        "Animalele de companie nu sunt acceptate.",
        "Petrecerile și evenimentele nu sunt permise.",
        "Liniște între orele 22:00 și 07:00.",
        "În apartament pot fi cazate cel mult 4 persoane, respectiv numărul de persoane din rezervare.",
      ],
    },
    {
      h: "11. Obligațiile și răspunderea oaspetelui",
      p: [
        "Folosiți apartamentul și dotările lui cu grijă și respectați regulile casei, precum și liniștea vecinilor.",
        "Răspundeți pentru pagubele produse în apartament dincolo de uzura normală, de dumneavoastră sau de persoanele cazate cu dumneavoastră, până la 500 RON, la fel ca în politica afișată pe Booking.com. Vă anunțăm în scris, cu dovezi, înainte de a solicita plata.",
        "Încălcarea gravă a regulilor casei (de exemplu, petreceri sau depășirea numărului de persoane) ne dă dreptul să încheiem cazarea fără rambursare.",
      ],
    },
    {
      h: "12. Răspunderea operatorului",
      p: [
        "Ne asigurăm că apartamentul corespunde descrierii de pe site și este curat și funcțional la sosire.",
        "Nu răspundem pentru întreruperi ale utilităților sau ale serviciilor terților (de exemplu, energie electrică, apă, internet) care nu ne sunt imputabile; le remediem cât mai repede posibil. Răspunderea pentru bunurile oaspeților se aplică în limitele prevăzute de Codul civil.",
        "Răspunderea noastră totală față de dumneavoastră este limitată la valoarea rezervării, cu excepția cazurilor în care legea nu permite o astfel de limitare (de exemplu, culpa gravă sau intenția).",
      ],
    },
    {
      h: "13. Forța majoră",
      p: [
        "Niciuna dintre părți nu răspunde pentru neexecutarea obligațiilor cauzată de forța majoră, adică un eveniment extern, imprevizibil, absolut invincibil și inevitabil (art. 1351 Cod civil). Dacă din acest motiv nu vă putem caza, vă rambursăm integral suma plătită.",
      ],
    },
    {
      h: "14. Reclamații și soluționarea litigiilor",
      p: [
        "Pentru orice nemulțumire, scrieți-ne la serenityhouseap@gmail.com. Vă răspundem cât mai repede și încercăm mai întâi să rezolvăm problema pe cale amiabilă.",
        "Ca și consumator, vă puteți adresa Autorității Naționale pentru Protecția Consumatorilor (ANPC), www.anpc.ro.",
        "Pentru soluționarea alternativă a litigiilor (SAL), puteți depune o cerere la https://reclamatiisal.anpc.ro, conform Ordinului ANPC nr. 449/2022, cu modificările ulterioare.",
      ],
    },
    {
      h: "15. Legea aplicabilă și instanța competentă",
      p: [
        "Contractul este guvernat de legea română. Litigiile care nu se rezolvă amiabil sunt soluționate de instanțele competente din Sibiu, fără a vă priva de protecția oferită de normele imperative aplicabile consumatorilor.",
        "Termenii sunt disponibili în română, engleză și germană. În caz de neconcordanță, prevalează versiunea în limba română.",
      ],
    },
    {
      h: "16. Contact",
      p: [`${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. E-mail: ${CO.email}`],
    },
  ],
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
      ],
    },
    { h: "2a. Check-in online", p: ["Înainte de sosire vă putem cere să completați formularul de check-in online: nume complet, adresa de domiciliu, email, opțional telefonul, opțional CNP-ul (doar pentru cetățenii români, dacă doriți să apară pe factură) și, opțional, datele firmei pentru factură. Folosim aceste date pentru emiterea facturii (obligație legală, art. 6 alin. (1) lit. c GDPR) și pentru evidența oaspeților cerută de lege. CNP-ul este stocat criptat (AES-256) și este accesibil doar operatorului. Datele de check-in se păstrează 10 ani, ca documente justificative contabile, apoi se șterg."] },
      {
      h: "3. Scopuri și temeiuri legale",
      ul: [
        "Încheierea și executarea contractului de cazare (rezervare, plată, comunicări despre sejur, acces în apartament): art. 6 alin. (1) lit. b GDPR.",
        "Obligații legale (evidență contabilă și facturare, evidența turiștilor și alte obligații din domeniul turismului, colectarea taxei locale): art. 6 alin. (1) lit. c GDPR.",
        "Interesul legitim (securitatea site-ului, prevenirea fraudei, răspunsul la mesajele dumneavoastră): art. 6 alin. (1) lit. f GDPR.",
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

// ───────────────────────── English ─────────────────────────

const enTerms: LegalDoc = {
  title: "Terms and conditions",
  updated: "28 October 2026",
  intro:
    "These terms apply to bookings made directly on this website for the Serenity apartments in Sibiu. Please read them before you book. By ticking the acceptance box and paying for your booking, you confirm that you have read and accept them. This is a translation; the Romanian version prevails.",
  sections: [
    {
      h: "1. The operator",
      p: [
        `The services are provided by ${CO.name}, registered office ${CO.address}, tax ID (CUI) ${CO.cui}, Trade Register no. ${CO.regCom}. The company is not registered for VAT.`,
        "The apartments are located at Fundătura Lupeni nr. 2, Sibiu. Classification certificate: [nr. certificat de clasificare].",
        `Email: ${CO.email}`,
      ],
    },
    {
      h: "2. Definitions",
      ul: [
        "“Operator”, “we”, “us”: SERENITY ADMIN APARTAMENTE SRL.",
        "“Guest”, “you”: the person making the booking and the people staying with them.",
        "“Apartment”: the booked accommodation unit (Film Studio, Gothic Chambers, Art Station or, once open, Pink Panther).",
        "“Booking”: accommodation in an apartment for the dates and number of guests chosen on the website.",
        "“Stay”: the period between the arrival date (check-in) and the departure date (check-out).",
      ],
    },
    {
      h: "3. Booking and conclusion of the contract",
      p: [
        "On the website you choose the apartment and dates, then enter your name, email address, phone number, country and, optionally, a note. To continue you must accept these terms.",
        "Once you submit the form, the apartment is held for you for 20 minutes so you can complete the payment. If the payment is not completed within that time, the booking expires and the dates become available again.",
        "The contract is concluded when the payment is confirmed and we send you the booking confirmation email. This email contains the booking details and the amount paid.",
        "Each apartment sleeps up to 4 guests. The minimum stay is shown when booking (usually 2 nights).",
        "You can also book the apartments through Booking.com. Those bookings are governed by the terms and policies shown on Booking.com, not by these terms.",
      ],
    },
    {
      h: "4. Prices and taxes",
      p: ["Prices are shown in Romanian lei (RON). The total booking price includes:"],
      ul: [
        "the nightly rate, for each night of the stay;",
        "the cleaning fee, once per stay;",
        "the Sibiu special tourism promotion tax (“taxa specială pentru promovarea turistică”) of 2% of the accommodation value (Sibiu Local Council Decision no. 462/2025), shown separately. We collect it from you and pay it to the municipality.",
      ],
    },
    {
      h: "5. Payment",
      p: [
        "You pay the full amount online at the time of booking. Payment is processed by NETOPIA Payments (NETOPIA FINANCIAL SERVICES S.A.) on the processor’s secure page, with 3-D Secure authentication.",
        "We accept Visa and Mastercard cards, Apple Pay and Google Pay, as well as Romanian holiday voucher cards (card de vacanță: Edenred, Up Romania, Pluxee). The price is the same whatever payment method you use.",
        "We never receive or store your card details. They are entered and processed only by NETOPIA Payments.",
      ],
    },
    {
      h: "6. Invoice",
      p: [
        "For each booking, SERENITY ADMIN APARTAMENTE SRL issues an invoice through the Romanian e-Factura system.",
        "If you need an invoice for a company, write the company name and tax ID (CUI) in the note field when booking.",
      ],
    },
    {
      h: "7. Cancellation, changes and refunds",
      p: ["This section is also our return and refund policy."],
      ul: [
        "Free cancellation at least 7 days before the arrival date: you get the full amount paid back.",
        "Cancellation less than 7 days before the arrival date, or no-show: 100% of the booking value is charged and is not refunded.",
        "To cancel, email serenityhouseap@gmail.com with your name and booking dates. The cancellation date is the date we receive your email.",
        "Refunds go back to the original payment method (bank card or holiday voucher card) within 14 days of the cancellation.",
        "Date changes are possible on request, subject to availability. Any price difference is paid or refunded, as the case may be.",
        "We may cancel a booking only in case of force majeure or if the apartment becomes unusable. In that case we refund the full amount paid.",
      ],
    },
    {
      h: "8. Right of withdrawal",
      p: [
        "The 14-day right of withdrawal does not apply to accommodation bookings, because they are accommodation services provided on a specific date or for a specific period (Romanian Government Emergency Ordinance no. 34/2014, art. 16 letter l). Cancellation is possible only under the conditions in section 7.",
      ],
    },
    {
      h: "9. Delivery of the service: access, check-in and check-out",
      ul: [
        "Before your arrival we email you the instructions for accessing the apartment.",
        "Check-in is from 15:00, without a reception desk, using the key from the key box (self check-in).",
        "Check-out is until 11:00.",
      ],
    },
    {
      h: "10. House rules",
      ul: [
        "No smoking in the apartment.",
        "No pets.",
        "No parties or events.",
        "Quiet hours from 22:00 to 07:00.",
        "No more than 4 guests per apartment, and no more than the number of guests in the booking.",
      ],
    },
    {
      h: "11. Guest obligations and liability",
      p: [
        "Please use the apartment and its equipment with care and respect the house rules and the neighbours’ quiet.",
        "You are liable for damage to the apartment beyond normal wear and tear caused by you or the people staying with you, up to 500 RON, the same as in the policy shown on Booking.com. We will inform you in writing, with evidence, before asking for payment.",
        "A serious breach of the house rules (for example, a party or more guests than booked) entitles us to end the stay without a refund.",
      ],
    },
    {
      h: "12. Operator liability",
      p: [
        "We make sure the apartment matches its description on the website and is clean and in working order on arrival.",
        "We are not liable for interruptions of utilities or third-party services (for example electricity, water, internet) that are not our fault; we fix them as quickly as possible. Liability for guests’ belongings applies within the limits set by the Romanian Civil Code.",
        "Our total liability towards you is limited to the booking value, except where the law does not allow such a limitation (for example gross negligence or intent).",
      ],
    },
    {
      h: "13. Force majeure",
      p: [
        "Neither party is liable for failing to perform its obligations due to force majeure, meaning an external, unforeseeable, absolutely irresistible and unavoidable event (art. 1351 Romanian Civil Code). If for this reason we cannot accommodate you, we refund the full amount paid.",
      ],
    },
    {
      h: "14. Complaints and dispute resolution",
      p: [
        "For any complaint, write to us at serenityhouseap@gmail.com. We reply as soon as possible and first try to resolve the matter amicably.",
        "As a consumer, you can contact the Romanian National Authority for Consumer Protection (ANPC), www.anpc.ro.",
        "For alternative dispute resolution (SAL), you can file a request at https://reclamatiisal.anpc.ro, under ANPC Order no. 449/2022, as amended.",
      ],
    },
    {
      h: "15. Applicable law and jurisdiction",
      p: [
        "The contract is governed by Romanian law. Disputes that cannot be settled amicably go to the competent courts in Sibiu, without depriving you of the protection given by mandatory consumer law.",
        "These terms are available in Romanian, English and German. In case of any discrepancy, the Romanian version prevails.",
      ],
    },
    {
      h: "16. Contact",
      p: [`${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. Email: ${CO.email}`],
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
      ],
    },
    { h: "2a. Online check-in", p: ["Before arrival we may ask you to complete the online check-in form: full name, home address, email, optionally your phone, optionally your CNP (Romanian personal numeric code, only for Romanian citizens who want it on the invoice) and optionally company details for the invoice. We use these data to issue the invoice (legal obligation, Art. 6(1)(c) GDPR) and for the guest records required by law. The CNP is stored encrypted (AES-256) and is accessible only to the operator. Check-in data are kept for 10 years as accounting records, then deleted."] },
      {
      h: "3. Purposes and legal bases",
      ul: [
        "Concluding and performing the accommodation contract (booking, payment, messages about your stay, access to the apartment): art. 6(1)(b) GDPR.",
        "Legal obligations (accounting and invoicing, guest registration and other tourism obligations, collecting the local tax): art. 6(1)(c) GDPR.",
        "Legitimate interest (website security, fraud prevention, replying to your messages): art. 6(1)(f) GDPR.",
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

// ───────────────────────── Deutsch ─────────────────────────

const deTerms: LegalDoc = {
  title: "Allgemeine Geschäftsbedingungen",
  updated: "28.10.2026",
  intro:
    "Diese Bedingungen gelten für Buchungen, die direkt auf dieser Website für die Serenity Apartments in Sibiu vorgenommen werden. Bitte lesen Sie sie vor der Buchung. Mit dem Ankreuzen des Bestätigungsfelds und der Zahlung der Buchung bestätigen Sie, dass Sie sie gelesen haben und akzeptieren. Dies ist eine Übersetzung; maßgeblich ist die rumänische Fassung.",
  sections: [
    {
      h: "1. Betreiber",
      p: [
        `Die Leistungen werden erbracht von ${CO.name}, Sitz ${CO.address}, Steuernummer (CUI) ${CO.cui}, Handelsregister-Nr. ${CO.regCom}. Die Gesellschaft ist nicht umsatzsteuerpflichtig registriert.`,
        "Die Apartments befinden sich in der Fundătura Lupeni nr. 2, Sibiu. Klassifizierungszertifikat: [nr. certificat de clasificare].",
        `E-Mail: ${CO.email}`,
      ],
    },
    {
      h: "2. Begriffe",
      ul: [
        "„Betreiber“, „wir“: SERENITY ADMIN APARTAMENTE SRL.",
        "„Gast“, „Sie“: die buchende Person und die mit ihr untergebrachten Personen.",
        "„Apartment“: die gebuchte Unterkunft (Film Studio, Gothic Chambers, Art Station oder, nach Eröffnung, Pink Panther).",
        "„Buchung“: die Unterbringung in einem Apartment für die auf der Website gewählten Daten und Personenzahl.",
        "„Aufenthalt“: der Zeitraum zwischen Anreisetag (Check-in) und Abreisetag (Check-out).",
      ],
    },
    {
      h: "3. Buchung und Vertragsschluss",
      p: [
        "Auf der Website wählen Sie das Apartment und die Daten und geben dann Ihren Namen, Ihre E-Mail-Adresse, Telefonnummer, Ihr Land und optional eine Notiz ein. Um fortzufahren, müssen Sie diese Bedingungen akzeptieren.",
        "Nach dem Absenden des Formulars wird das Apartment 20 Minuten für Sie reserviert, damit Sie die Zahlung abschließen können. Wird die Zahlung in dieser Zeit nicht abgeschlossen, verfällt die Buchung und die Daten sind wieder verfügbar.",
        "Der Vertrag kommt zustande, sobald die Zahlung bestätigt ist und wir Ihnen die Buchungsbestätigung per E-Mail senden. Diese E-Mail enthält die Buchungsdetails und den gezahlten Betrag.",
        "Jedes Apartment bietet Platz für höchstens 4 Personen. Der Mindestaufenthalt wird bei der Buchung angezeigt (in der Regel 2 Nächte).",
        "Sie können die Apartments auch über Booking.com buchen. Für diese Buchungen gelten die auf Booking.com angezeigten Bedingungen und Richtlinien, nicht diese Bedingungen.",
      ],
    },
    {
      h: "4. Preise und Steuern",
      p: ["Die Preise werden in rumänischen Lei (RON) angezeigt. Der Gesamtpreis der Buchung umfasst:"],
      ul: [
        "den Übernachtungspreis für jede Nacht des Aufenthalts;",
        "die Reinigungsgebühr, einmal pro Aufenthalt;",
        "die Sondersteuer zur Tourismusförderung der Stadt Sibiu („taxa specială pentru promovarea turistică“) in Höhe von 2 % des Übernachtungswerts (Beschluss Nr. 462/2025 des Stadtrats Sibiu), gesondert ausgewiesen. Wir erheben sie bei Ihnen und führen sie an die Stadt ab.",
      ],
    },
    {
      h: "5. Zahlung",
      p: [
        "Sie zahlen den vollen Betrag online bei der Buchung. Die Zahlung wird von NETOPIA Payments (NETOPIA FINANCIAL SERVICES S.A.) auf der sicheren Seite des Zahlungsdienstleisters mit 3-D-Secure-Authentifizierung abgewickelt.",
        "Wir akzeptieren Visa und Mastercard, Apple Pay und Google Pay sowie rumänische Urlaubsgutscheinkarten (card de vacanță: Edenred, Up Romania, Pluxee). Der Preis ist bei jeder Zahlungsart derselbe.",
        "Wir erhalten und speichern Ihre Kartendaten niemals. Sie werden ausschließlich von NETOPIA Payments erfasst und verarbeitet.",
      ],
    },
    {
      h: "6. Rechnung",
      p: [
        "Für jede Buchung stellt SERENITY ADMIN APARTAMENTE SRL eine Rechnung über das rumänische e-Factura-System aus.",
        "Wenn Sie eine Rechnung auf eine Firma benötigen, geben Sie bei der Buchung den Firmennamen und die Steuernummer (CUI) im Notizfeld an.",
      ],
    },
    {
      h: "7. Stornierung, Änderung und Erstattung",
      p: ["Dieser Abschnitt ist zugleich unsere Rückgabe- und Erstattungsrichtlinie."],
      ul: [
        "Kostenlose Stornierung bis spätestens 7 Tage vor dem Anreisetag: Sie erhalten den gezahlten Betrag vollständig zurück.",
        "Stornierung weniger als 7 Tage vor dem Anreisetag oder Nichterscheinen: 100 % des Buchungswerts werden berechnet und nicht erstattet.",
        "Zum Stornieren schreiben Sie an serenityhouseap@gmail.com mit Ihrem Namen und den Buchungsdaten. Maßgeblich ist der Tag, an dem Ihre E-Mail bei uns eingeht.",
        "Erstattungen erfolgen auf das ursprüngliche Zahlungsmittel (Bankkarte oder Urlaubsgutscheinkarte) innerhalb von 14 Tagen nach der Stornierung.",
        "Eine Änderung der Daten ist auf Anfrage und je nach Verfügbarkeit möglich. Ein Preisunterschied wird nachgezahlt oder erstattet.",
        "Wir dürfen eine Buchung nur bei höherer Gewalt oder wenn das Apartment unbenutzbar wird stornieren. In diesem Fall erstatten wir den gezahlten Betrag vollständig.",
      ],
    },
    {
      h: "8. Widerrufsrecht",
      p: [
        "Das 14-tägige Widerrufsrecht gilt nicht für Unterkunftsbuchungen, da es sich um Beherbergungsleistungen für einen bestimmten Termin oder Zeitraum handelt (Art. 16 Buchst. l der rumänischen Dringlichkeitsverordnung Nr. 34/2014). Eine Stornierung ist nur zu den Bedingungen in Abschnitt 7 möglich.",
      ],
    },
    {
      h: "9. Leistungserbringung: Zugang, Check-in und Check-out",
      ul: [
        "Vor Ihrer Anreise senden wir Ihnen per E-Mail die Anweisungen für den Zugang zum Apartment.",
        "Check-in ab 15:00 Uhr, ohne Rezeption, mit dem Schlüssel aus dem Schlüsselsafe (Self-Check-in).",
        "Check-out bis 11:00 Uhr.",
      ],
    },
    {
      h: "10. Hausordnung",
      ul: [
        "Rauchen ist im Apartment nicht erlaubt.",
        "Haustiere sind nicht erlaubt.",
        "Partys und Veranstaltungen sind nicht erlaubt.",
        "Nachtruhe von 22:00 bis 07:00 Uhr.",
        "Höchstens 4 Personen pro Apartment und nicht mehr als die gebuchte Personenzahl.",
      ],
    },
    {
      h: "11. Pflichten und Haftung des Gastes",
      p: [
        "Bitte behandeln Sie das Apartment und seine Ausstattung sorgfältig und beachten Sie die Hausordnung und die Ruhe der Nachbarn.",
        "Sie haften für Schäden am Apartment, die über die normale Abnutzung hinausgehen und von Ihnen oder Ihren Mitreisenden verursacht wurden, bis zu 500 RON, wie in der auf Booking.com angezeigten Richtlinie. Wir informieren Sie schriftlich und mit Nachweisen, bevor wir eine Zahlung verlangen.",
        "Ein schwerer Verstoß gegen die Hausordnung (zum Beispiel eine Party oder mehr Personen als gebucht) berechtigt uns, den Aufenthalt ohne Erstattung zu beenden.",
      ],
    },
    {
      h: "12. Haftung des Betreibers",
      p: [
        "Wir sorgen dafür, dass das Apartment der Beschreibung auf der Website entspricht und bei Ihrer Ankunft sauber und funktionsfähig ist.",
        "Wir haften nicht für Unterbrechungen von Versorgungsleistungen oder Diensten Dritter (zum Beispiel Strom, Wasser, Internet), die wir nicht zu vertreten haben; wir beheben sie so schnell wie möglich. Die Haftung für Gegenstände der Gäste gilt in den Grenzen des rumänischen Zivilgesetzbuchs.",
        "Unsere Gesamthaftung Ihnen gegenüber ist auf den Buchungswert begrenzt, außer wenn das Gesetz eine solche Begrenzung nicht zulässt (zum Beispiel bei grober Fahrlässigkeit oder Vorsatz).",
      ],
    },
    {
      h: "13. Höhere Gewalt",
      p: [
        "Keine Partei haftet für die Nichterfüllung ihrer Pflichten aufgrund höherer Gewalt, also eines äußeren, unvorhersehbaren, absolut unüberwindbaren und unvermeidbaren Ereignisses (Art. 1351 rumänisches Zivilgesetzbuch). Können wir Sie aus diesem Grund nicht unterbringen, erstatten wir den gezahlten Betrag vollständig.",
      ],
    },
    {
      h: "14. Beschwerden und Streitbeilegung",
      p: [
        "Bei Beschwerden schreiben Sie uns an serenityhouseap@gmail.com. Wir antworten so schnell wie möglich und versuchen zunächst, die Angelegenheit gütlich zu klären.",
        "Als Verbraucher können Sie sich an die rumänische Verbraucherschutzbehörde (ANPC) wenden, www.anpc.ro.",
        "Für die alternative Streitbeilegung (SAL) können Sie einen Antrag unter https://reclamatiisal.anpc.ro stellen, gemäß ANPC-Verordnung Nr. 449/2022 in der geänderten Fassung.",
      ],
    },
    {
      h: "15. Anwendbares Recht und Gerichtsstand",
      p: [
        "Der Vertrag unterliegt rumänischem Recht. Streitigkeiten, die nicht gütlich beigelegt werden, werden von den zuständigen Gerichten in Sibiu entschieden, ohne dass Ihnen der Schutz zwingender Verbraucherschutzvorschriften entzogen wird.",
        "Diese Bedingungen liegen auf Rumänisch, Englisch und Deutsch vor. Bei Abweichungen ist die rumänische Fassung maßgeblich.",
      ],
    },
    {
      h: "16. Kontakt",
      p: [`${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. E-Mail: ${CO.email}`],
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
      ],
    },
    { h: "2a. Online-Check-in", p: ["Vor der Anreise können wir Sie bitten, das Online-Check-in-Formular auszufüllen: vollständiger Name, Wohnadresse, E-Mail, optional Telefon, optional die CNP (rumänische persönliche Identifikationsnummer, nur für rumänische Staatsbürger, die sie auf der Rechnung wünschen) und optional Firmendaten für die Rechnung. Wir verwenden diese Daten zur Rechnungsstellung (rechtliche Verpflichtung, Art. 6 Abs. 1 lit. c DSGVO) und für das gesetzlich vorgeschriebene Gästeregister. Die CNP wird verschlüsselt (AES-256) gespeichert und ist nur dem Betreiber zugänglich. Check-in-Daten werden 10 Jahre als Buchhaltungsbelege aufbewahrt und danach gelöscht."] },
      {
      h: "3. Zwecke und Rechtsgrundlagen",
      ul: [
        "Abschluss und Erfüllung des Beherbergungsvertrags (Buchung, Zahlung, Mitteilungen zum Aufenthalt, Zugang zum Apartment): Art. 6 Abs. 1 lit. b DSGVO.",
        "Rechtliche Pflichten (Buchhaltung und Rechnungsstellung, Gästeregistrierung und sonstige touristische Pflichten, Erhebung der lokalen Steuer): Art. 6 Abs. 1 lit. c DSGVO.",
        "Berechtigtes Interesse (Sicherheit der Website, Betrugsprävention, Beantwortung Ihrer Nachrichten): Art. 6 Abs. 1 lit. f DSGVO.",
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

export const LEGAL: Record<"en" | "ro" | "de", { terms: LegalDoc; privacy: LegalDoc }> = {
  ro: { terms: roTerms, privacy: roPrivacy },
  en: { terms: enTerms, privacy: enPrivacy },
  de: { terms: deTerms, privacy: dePrivacy },
};
