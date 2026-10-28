/**
 * Terms and conditions, version 2026-10-28. FROZEN: guests accepted this exact
 * text and its SHA-256 sits in their acceptance record. Never edit this file;
 * copy it to a new version file and register that in ./index.ts instead.
 * Romanian is the binding version; EN and DE are faithful translations.
 */
import type { LegalDoc } from "../legal";

// Frozen copy of the company facts as they read in this version.
const CO = {
  name: "SERENITY ADMIN APARTAMENTE SRL",
  cui: "47339489",
  regCom: "J32/2691/2022",
  address: "Fundătura Lupeni nr. 2, 550206 Sibiu, România",
  email: "serenityhouseap@gmail.com",
};

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
        "E-mailul de confirmare indică versiunea acestor termeni pe care ați acceptat-o și conține un link permanent la textul ei integral. Ca dovadă a încheierii contractului, păstrăm evidența acceptării (data și ora, adresa IP, browserul și versiunea termenilor); detalii în politica de confidențialitate.",
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
      h: "11. Obligațiile oaspetelui",
      p: [
        "Folosiți apartamentul și dotările lui cu grijă și respectați regulile casei, precum și liniștea vecinilor.",
        "Dacă la sosire găsiți ceva deteriorat, murdar sau lipsă, trimiteți-ne o fotografie în aceeași zi, pe e-mail sau pe telefon, ca să nu vă fie atribuit.",
        "Încălcarea gravă a regulilor casei (de exemplu, petreceri sau depășirea numărului de persoane) ne dă dreptul să încheiem cazarea fără rambursare.",
      ],
    },
    {
      id: "damage",
      h: "12. Pagube minore: costul real, cel mult 500 lei",
      p: [
        "Răspundeți pentru pagubele produse în timpul sejurului apartamentului, dotărilor lui și clădirii, dincolo de uzura normală. Persoana care a făcut rezervarea răspunde față de noi și pentru pagubele produse de persoanele cazate împreună cu ea sau primite de ea în apartament.",
        "Pentru pagubele minore plătiți doar costul real al curățării, reparației sau înlocuirii, dovedit cu factură, bon fiscal sau deviz scris, dar cel mult 500 lei (aproximativ 100 euro) pe sejur, oricâte pagube minore ar fi.",
        "Uzura normală nu se plătește.",
        "Sunt pagube minore, de exemplu:",
      ],
      ul: [
        "pete pe textile, saltele, canapele, covoare sau pereți care cer curățare specială;",
        "pahare, vase sau alte obiecte mici sparte ori lipsă;",
        "zgârieturi sau urme minore pe mobilier, uși, pardoseli ori pereți;",
        "fumatul în apartament, inclusiv țigări electronice, care cere aerisire și curățare specială;",
        "pierderea cheii, a telecomenzii sau a cartelei de acces.",
      ],
    },
    {
      h: "13. Pagube mai mari: costul integral",
      p: [
        "Pentru pagubele mai mari, de exemplu un geam spart, un aparat electrocasnic sau o piesă de mobilier distrusă ori o inundație provocată, plătiți costul integral, fără limita de 500 lei: costul real al reparației sau, dacă bunul nu se poate repara, al înlocuirii cu un bun echivalent, dovedit prin factură sau deviz scris. Dacă reparația ne obligă să anulăm rezervări, datorați și valoarea nopților pierdute, dovedită cu rezervările anulate.",
        "Limita de 500 lei se aplică pagubelor minore luate împreună. O pagubă care, singură, costă mai mult de 500 lei este o pagubă mai mare și se plătește integral.",
      ],
    },
    {
      h: "14. Cum constatăm pagubele și cum se plătesc",
      ul: [
        "Verificăm apartamentul după plecare și documentăm orice pagubă prin fotografii sau video cu dată și oră.",
        "Vă anunțăm în scris, la adresa de e-mail din rezervare, în cel mult 7 zile de la check-out: ce s-a întâmplat, fotografiile, suma cerută și dovada costului (factură, bon fiscal sau deviz scris). Dacă atunci avem doar un deviz, vă trimitem factura finală în cel mult 30 de zile, iar suma datorată este cea din factura finală, fără a depăși limita de 500 lei pentru pagubele minore.",
        "Aveți la dispoziție 14 zile de la primirea notificării pentru a răspunde: puteți contesta paguba sau suma și ne puteți trimite propriile dovezi. Analizăm răspunsul cu bună-credință și vă comunicăm decizia în scris.",
        "Plătiți prin transfer bancar sau prin link de plată cu cardul, în 14 zile de la notificare ori de la factura finală, dacă aceasta vine mai târziu, sau, dacă ați contestat, în 14 zile de la decizia noastră. Pentru suma plătită emitem un document justificativ.",
        "Dacă nu plătiți în acest termen, sunteți de drept în întârziere, fără altă formalitate (art. 1523 din Codul civil), iar noi putem recupera suma în instanță, de exemplu prin procedura cererii cu valoare redusă sau prin procedura europeană cu privire la cererile cu valoare redusă. Puteți apela oricând și la soluționarea alternativă a litigiilor de la punctul 17.",
      ],
    },
    {
      h: "15. Răspunderea operatorului",
      p: [
        "Ne asigurăm că apartamentul corespunde descrierii de pe site și este curat și funcțional la sosire.",
        "Nu răspundem pentru întreruperi ale utilităților sau ale serviciilor terților (de exemplu, energie electrică, apă, internet) care nu ne sunt imputabile; le remediem cât mai repede posibil. Răspunderea pentru bunurile oaspeților se aplică în limitele prevăzute de Codul civil.",
        "Răspunderea noastră totală față de dumneavoastră este limitată la valoarea rezervării, cu excepția cazurilor în care legea nu permite o astfel de limitare (de exemplu, culpa gravă sau intenția).",
      ],
    },
    {
      h: "16. Forța majoră",
      p: [
        "Niciuna dintre părți nu răspunde pentru neexecutarea obligațiilor cauzată de forța majoră, adică un eveniment extern, imprevizibil, absolut invincibil și inevitabil (art. 1351 Cod civil). Dacă din acest motiv nu vă putem caza, vă rambursăm integral suma plătită.",
      ],
    },
    {
      h: "17. Reclamații și soluționarea litigiilor",
      p: [
        "Pentru orice nemulțumire, scrieți-ne la serenityhouseap@gmail.com. Vă răspundem cât mai repede și încercăm mai întâi să rezolvăm problema pe cale amiabilă.",
        "Ca și consumator, vă puteți adresa Autorității Naționale pentru Protecția Consumatorilor (ANPC), www.anpc.ro.",
        "Pentru soluționarea alternativă a litigiilor (SAL), puteți depune o cerere la https://reclamatiisal.anpc.ro, conform Ordinului ANPC nr. 449/2022, cu modificările ulterioare.",
      ],
    },
    {
      h: "18. Legea aplicabilă și instanța competentă",
      p: [
        "Contractul este guvernat de legea română. Dacă aveți reședința obișnuită în alt stat, păstrați protecția oferită de normele imperative ale legii acelui stat (art. 6 din Regulamentul (CE) nr. 593/2008, Roma I).",
        "Litigiile care nu se rezolvă amiabil se judecă de instanța competentă potrivit legii, inclusiv potrivit regulilor de competență care protejează consumatorii (Regulamentul (UE) nr. 1215/2012).",
        "Termenii sunt disponibili în română, engleză și germană. Versiunea în limba română este cea obligatorie și prevalează în caz de neconcordanță.",
      ],
    },
    {
      h: "19. Contact",
      p: [`${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. E-mail: ${CO.email}`],
    },
  ],
};

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
        "The confirmation email states the version of these terms you accepted and links to its full text, which stays online. As proof of the contract, we keep a record of your acceptance (date and time, IP address, browser and terms version); see the privacy policy.",
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
      h: "11. Guest obligations",
      p: [
        "Please use the apartment and its equipment with care and respect the house rules and the neighbours’ quiet.",
        "If anything is damaged, dirty or missing when you arrive, send us a photo the same day, by email or phone, so it is not attributed to you.",
        "A serious breach of the house rules (for example, a party or more guests than booked) entitles us to end the stay without a refund.",
      ],
    },
    {
      id: "damage",
      h: "12. Minor damage: the real cost, up to 500 lei",
      p: [
        "You are liable for damage caused during your stay to the apartment, its equipment and the building, beyond normal wear and tear. The person who made the booking is also liable to us for damage caused by the people staying with them or invited into the apartment.",
        "For minor damage you pay only the real cost of cleaning, repair or replacement, shown by an invoice, a receipt or a written estimate, and at most 500 lei (about €100) per stay, however many minor damages there are.",
        "Normal wear and tear costs you nothing.",
        "Minor damage includes, for example:",
      ],
      ul: [
        "stains on textiles, mattresses, sofas, rugs or walls that need special cleaning;",
        "broken or missing glasses, dishes or other small items;",
        "minor scratches or marks on furniture, doors, floors or walls;",
        "smoking in the apartment, including e-cigarettes, which requires airing and special cleaning;",
        "a lost key, remote control or access card.",
      ],
    },
    {
      h: "13. Larger damage: the full cost",
      p: [
        "For larger damage, for example a broken window, a destroyed appliance or piece of furniture, or a flood you caused, you pay the full cost, without the 500 lei limit: the actual cost of the repair or, if the item cannot be repaired, of replacing it with an equivalent one, shown by an invoice or a written estimate. If the repair forces us to cancel bookings, you also owe the value of the nights lost, shown by the cancelled bookings.",
        "The 500 lei limit applies to all minor damage taken together. A single damage that costs more than 500 lei on its own is larger damage and is paid in full.",
      ],
    },
    {
      h: "14. How we report damage and how it is paid",
      ul: [
        "We check the apartment after you leave and record any damage with dated photos or video.",
        "We notify you in writing, at the email address used for the booking, within 7 days after check-out: what happened, the photos, the amount claimed and proof of the cost (invoice, receipt or written estimate). If at that point we only have an estimate, we send the final invoice within 30 days, and the amount owed is the one on the final invoice, never above the 500 lei limit for minor damage.",
        "You have 14 days from receiving our notice to respond: you can dispute the damage or the amount and send us your own evidence. We consider your response in good faith and give you our decision in writing.",
        "You pay by bank transfer or through a card payment link within 14 days of our notice or of the final invoice, whichever comes later, or, if you disputed it, within 14 days of our decision. We issue a receipt for the amount paid.",
        "If you do not pay within that term, you are in default by law without further notice (art. 1523 Romanian Civil Code), and we may recover the amount in court, for example through the Romanian small claims procedure or the European Small Claims Procedure. You may also use the alternative dispute resolution in section 17 at any time.",
      ],
    },
    {
      h: "15. Operator liability",
      p: [
        "We make sure the apartment matches its description on the website and is clean and in working order on arrival.",
        "We are not liable for interruptions of utilities or third-party services (for example electricity, water, internet) that are not our fault; we fix them as quickly as possible. Liability for guests’ belongings applies within the limits set by the Romanian Civil Code.",
        "Our total liability towards you is limited to the booking value, except where the law does not allow such a limitation (for example gross negligence or intent).",
      ],
    },
    {
      h: "16. Force majeure",
      p: [
        "Neither party is liable for failing to perform its obligations due to force majeure, meaning an external, unforeseeable, absolutely irresistible and unavoidable event (art. 1351 Romanian Civil Code). If for this reason we cannot accommodate you, we refund the full amount paid.",
      ],
    },
    {
      h: "17. Complaints and dispute resolution",
      p: [
        "For any complaint, write to us at serenityhouseap@gmail.com. We reply as soon as possible and first try to resolve the matter amicably.",
        "As a consumer, you can contact the Romanian National Authority for Consumer Protection (ANPC), www.anpc.ro.",
        "For alternative dispute resolution (SAL), you can file a request at https://reclamatiisal.anpc.ro, under ANPC Order no. 449/2022, as amended.",
      ],
    },
    {
      h: "18. Applicable law and jurisdiction",
      p: [
        "The contract is governed by Romanian law. If you live in another country, you keep the protection of the mandatory rules of that country’s law (art. 6 of Regulation (EC) No 593/2008, Rome I).",
        "Disputes that cannot be settled amicably go to the court that has jurisdiction under the law, including the jurisdiction rules that protect consumers (Regulation (EU) No 1215/2012).",
        "These terms are available in Romanian, English and German. The Romanian version is binding and prevails in case of any discrepancy.",
      ],
    },
    {
      h: "19. Contact",
      p: [`${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. Email: ${CO.email}`],
    },
  ],
};

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
        "Die Bestätigungs-E-Mail nennt die Version dieser Bedingungen, die Sie akzeptiert haben, und verlinkt ihren vollständigen Text, der online bleibt. Als Nachweis des Vertrags speichern wir Ihre Zustimmung (Datum und Uhrzeit, IP-Adresse, Browser und Version der Bedingungen); siehe Datenschutzerklärung.",
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
      h: "11. Pflichten des Gastes",
      p: [
        "Bitte behandeln Sie das Apartment und seine Ausstattung sorgfältig und beachten Sie die Hausordnung und die Ruhe der Nachbarn.",
        "Ist bei Ihrer Ankunft etwas beschädigt, verschmutzt oder fehlt etwas, schicken Sie uns noch am selben Tag ein Foto per E-Mail oder Telefon, damit es Ihnen nicht zugerechnet wird.",
        "Ein schwerer Verstoß gegen die Hausordnung (zum Beispiel eine Party oder mehr Personen als gebucht) berechtigt uns, den Aufenthalt ohne Erstattung zu beenden.",
      ],
    },
    {
      id: "damage",
      h: "12. Kleinere Schäden: die tatsächlichen Kosten, höchstens 500 Lei",
      p: [
        "Sie haften für Schäden, die während Ihres Aufenthalts am Apartment, an seiner Ausstattung und am Gebäude entstehen und über die normale Abnutzung hinausgehen. Die Person, die gebucht hat, haftet uns gegenüber auch für Schäden durch ihre Mitreisenden oder durch Personen, die sie in das Apartment eingeladen hat.",
        "Für kleinere Schäden zahlen Sie nur die tatsächlichen Kosten für Reinigung, Reparatur oder Ersatz, belegt durch Rechnung, Kassenbeleg oder schriftlichen Kostenvoranschlag, höchstens jedoch 500 Lei (etwa 100 €) pro Aufenthalt, unabhängig von der Zahl kleinerer Schäden.",
        "Normale Abnutzung kostet Sie nichts.",
        "Kleinere Schäden sind zum Beispiel:",
      ],
      ul: [
        "Flecken auf Textilien, Matratzen, Sofas, Teppichen oder Wänden, die eine Spezialreinigung erfordern;",
        "zerbrochene oder fehlende Gläser, Geschirrteile oder andere kleine Gegenstände;",
        "kleinere Kratzer oder Spuren an Möbeln, Türen, Böden oder Wänden;",
        "Rauchen im Apartment, auch E-Zigaretten, was Lüften und Spezialreinigung erfordert;",
        "ein verlorener Schlüssel, eine verlorene Fernbedienung oder Zugangskarte.",
      ],
    },
    {
      h: "13. Größere Schäden: die vollen Kosten",
      p: [
        "Bei größeren Schäden, zum Beispiel einer zerbrochenen Fensterscheibe, einem zerstörten Gerät oder Möbelstück oder einem von Ihnen verursachten Wasserschaden, zahlen Sie die vollen Kosten ohne die Grenze von 500 Lei: die tatsächlichen Kosten der Reparatur oder, wenn der Gegenstand nicht repariert werden kann, des Ersatzes durch einen gleichwertigen, belegt durch Rechnung oder schriftlichen Kostenvoranschlag. Müssen wir wegen der Reparatur Buchungen stornieren, schulden Sie auch den Wert der entgangenen Nächte, belegt durch die stornierten Buchungen.",
        "Die Grenze von 500 Lei gilt für alle kleineren Schäden zusammen. Ein einzelner Schaden, der für sich mehr als 500 Lei kostet, ist ein größerer Schaden und wird voll bezahlt.",
      ],
    },
    {
      h: "14. Wie wir Schäden melden und wie sie bezahlt werden",
      ul: [
        "Wir prüfen das Apartment nach Ihrer Abreise und dokumentieren jeden Schaden mit datierten Fotos oder Videos.",
        "Wir benachrichtigen Sie schriftlich an die E-Mail-Adresse der Buchung, innerhalb von 7 Tagen nach dem Check-out: was passiert ist, die Fotos, den geforderten Betrag und den Kostennachweis (Rechnung, Kassenbeleg oder schriftlicher Kostenvoranschlag). Liegt uns dann nur ein Kostenvoranschlag vor, senden wir die endgültige Rechnung innerhalb von 30 Tagen; geschuldet ist der Betrag der endgültigen Rechnung, bei kleineren Schäden nie mehr als 500 Lei.",
        "Sie haben 14 Tage ab Erhalt unserer Mitteilung, um zu antworten: Sie können den Schaden oder den Betrag bestreiten und uns eigene Nachweise schicken. Wir prüfen Ihre Antwort nach Treu und Glauben und teilen Ihnen unsere Entscheidung schriftlich mit.",
        "Sie zahlen per Banküberweisung oder über einen Kartenzahlungslink innerhalb von 14 Tagen nach unserer Mitteilung oder nach der endgültigen Rechnung, je nachdem, was später kommt, oder, wenn Sie widersprochen haben, innerhalb von 14 Tagen nach unserer Entscheidung. Für den gezahlten Betrag erhalten Sie einen Beleg.",
        "Zahlen Sie nicht fristgerecht, geraten Sie ohne weitere Mahnung kraft Gesetzes in Verzug (Art. 1523 rumänisches Zivilgesetzbuch), und wir können den Betrag gerichtlich geltend machen, zum Beispiel im rumänischen Verfahren für geringfügige Forderungen oder im Europäischen Verfahren für geringfügige Forderungen. Sie können jederzeit auch die alternative Streitbeilegung nach Abschnitt 17 nutzen.",
      ],
    },
    {
      h: "15. Haftung des Betreibers",
      p: [
        "Wir sorgen dafür, dass das Apartment der Beschreibung auf der Website entspricht und bei Ihrer Ankunft sauber und funktionsfähig ist.",
        "Wir haften nicht für Unterbrechungen von Versorgungsleistungen oder Diensten Dritter (zum Beispiel Strom, Wasser, Internet), die wir nicht zu vertreten haben; wir beheben sie so schnell wie möglich. Die Haftung für Gegenstände der Gäste gilt in den Grenzen des rumänischen Zivilgesetzbuchs.",
        "Unsere Gesamthaftung Ihnen gegenüber ist auf den Buchungswert begrenzt, außer wenn das Gesetz eine solche Begrenzung nicht zulässt (zum Beispiel bei grober Fahrlässigkeit oder Vorsatz).",
      ],
    },
    {
      h: "16. Höhere Gewalt",
      p: [
        "Keine Partei haftet für die Nichterfüllung ihrer Pflichten aufgrund höherer Gewalt, also eines äußeren, unvorhersehbaren, absolut unüberwindbaren und unvermeidbaren Ereignisses (Art. 1351 rumänisches Zivilgesetzbuch). Können wir Sie aus diesem Grund nicht unterbringen, erstatten wir den gezahlten Betrag vollständig.",
      ],
    },
    {
      h: "17. Beschwerden und Streitbeilegung",
      p: [
        "Bei Beschwerden schreiben Sie uns an serenityhouseap@gmail.com. Wir antworten so schnell wie möglich und versuchen zunächst, die Angelegenheit gütlich zu klären.",
        "Als Verbraucher können Sie sich an die rumänische Verbraucherschutzbehörde (ANPC) wenden, www.anpc.ro.",
        "Für die alternative Streitbeilegung (SAL) können Sie einen Antrag unter https://reclamatiisal.anpc.ro stellen, gemäß ANPC-Verordnung Nr. 449/2022 in der geänderten Fassung.",
      ],
    },
    {
      h: "18. Anwendbares Recht und Gerichtsstand",
      p: [
        "Der Vertrag unterliegt rumänischem Recht. Wohnen Sie in einem anderen Staat, behalten Sie den Schutz der zwingenden Vorschriften des dortigen Rechts (Art. 6 der Verordnung (EG) Nr. 593/2008, Rom I).",
        "Streitigkeiten, die nicht gütlich beigelegt werden, entscheidet das nach dem Gesetz zuständige Gericht, einschließlich der Zuständigkeitsregeln zum Schutz von Verbrauchern (Verordnung (EU) Nr. 1215/2012).",
        "Diese Bedingungen liegen auf Rumänisch, Englisch und Deutsch vor. Die rumänische Fassung ist verbindlich und bei Abweichungen maßgeblich.",
      ],
    },
    {
      h: "19. Kontakt",
      p: [`${CO.name}, ${CO.address}, CUI ${CO.cui}, ${CO.regCom}. E-Mail: ${CO.email}`],
    },
  ],
};

export const TERMS_2026_10_28: Record<"ro" | "en" | "de", LegalDoc> = { ro: roTerms, en: enTerms, de: deTerms };

