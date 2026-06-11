// ---------------------------------------------------------------------------
// Mulvane EMS Protocols — data model
//
// This single file drives the entire app. To add / edit a protocol, edit the
// RAW arrays below; every screen renders from this data. Protocol `body` is
// intentionally empty for now — we will fill each one in from the official PDF
// (including extracted diagrams / dosing tables) once the source file is in
// hand.
//
// Source: Mulvane EMS Protocols table of contents, effective May 1, 2022.
// PDF page numbers are intentionally omitted — navigation is by category.
//
// NOTE: Adult and Pediatric share many protocol titles (Chest Pain, Seizures,
// Burns, etc.), so protocol ids are prefixed with their category id to stay
// globally unique: `<categoryId>/<title-slug>`.
// ---------------------------------------------------------------------------

export type Protocol = {
  id: string;
  title: string;
  body?: string; // filled in later from the PDF
};

export type Section = {
  title?: string; // optional sub-heading within a category (e.g. "Cardiac")
  protocols: Protocol[];
};

export type Category = {
  id: string;
  title: string;
  subtitle?: string;
  accent: string; // header / button color
  sections: Section[];
};

// Authoring shape: sections hold plain title strings; ids are generated below.
type RawCategory = {
  id: string;
  title: string;
  subtitle?: string;
  accent: string;
  sections: { title?: string; protocols: string[] }[];
};

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const RAW: RawCategory[] = [
  {
    id: 'practices',
    title: 'Practices',
    subtitle: 'Policies & standards',
    accent: '#475569',
    sections: [
      {
        protocols: [
          'Confidentiality / Consent / Refusal',
          'Physician on Scene / DNR',
          'Infection Control',
          'Quality Assurance',
        ],
      },
    ],
  },
  {
    id: 'triage-transport',
    title: 'Triage / Transport',
    subtitle: 'Destination, alerts & assessment',
    accent: '#0e7490',
    sections: [
      {
        protocols: [
          'Patient Transport / Destination',
          'Type 1 Assist',
          'Triage Guidelines',
          'General Assessment Protocol',
          'Inter-Facility Transfer',
          'Burn Alert Criteria',
          'Rapid Fetal Assessment',
          'STEMI Alert',
          'Stroke Alert',
          'Trauma Alert Criteria',
          'Triage / Mass Casualty',
          'Glasgow Coma Scale',
          'Firearms / Air Ambulance Transport',
          'Hazmat Response / Extrication',
        ],
      },
    ],
  },
  {
    id: 'procedures',
    title: 'Procedures',
    subtitle: 'Skills & interventions',
    accent: '#7c3aed',
    sections: [
      {
        protocols: [
          'Medical Procedures Criteria',
          'Adult Cardiac Arrest: CCR',
          'Adult Cardiac Arrest: CPR',
          'AED',
          'Chest Decompression',
          'CPAP',
          'DefibTech',
          'External Cardiac Pacing',
          'Fire Rehab',
          'Intramuscular Medication Administration',
          'Intranasal Medication Administration',
          'Intraosseous Access / Infusion',
          'Intravenous Access',
          'Needle Cricothyrotomy',
          'Restraint Procedures',
          'Spinal Motion Restriction',
          'Surgical Cricothyrotomy',
          'Synchronized Cardioversion',
          'Taser Dart Removal',
          'Topical Hemostatic Agent',
        ],
      },
    ],
  },
  {
    id: 'adult',
    title: 'Adult',
    subtitle: 'Adult patient protocols',
    accent: '#b91c1c',
    sections: [
      {
        title: 'Cardiac',
        protocols: [
          'Cardiac Arrest',
          'Management / Post Resuscitation',
          'Termination of Efforts',
          'Chest Pain',
          'Dysrhythmia / Bradycardia',
          'Dysrhythmia / Tachycardia with Pulse',
        ],
      },
      {
        title: 'Medical',
        protocols: [
          'Abdominal Pain / Discomfort',
          'Abuse / Neglect',
          'Altered Mental Status / Unresponsive',
          'Anaphylaxis / Allergic Reactions',
          'Dehydration',
          'Diabetic Emergencies',
          'Nausea and/or Vomiting',
          'OB/GYN: Childbirth',
          'OB/GYN: Pre-Eclampsia / Eclampsia',
          'Overdose / Toxic Exposure',
          'Pain Management',
          'Acute Agitation / Excited Delirium',
          'Respiratory: Asthma / COPD',
          'Respiratory: Pulmonary Edema / CHF',
          'Seizures',
          'Sepsis',
          'Stroke',
        ],
      },
      {
        title: 'Environmental',
        protocols: [
          'Carbon Monoxide Poisoning',
          'Hyperthermia',
          'Hypothermia',
        ],
      },
      {
        title: 'Trauma',
        protocols: [
          'Burns',
          'Chest / Abdominal Injuries',
          'Drowning / Near Drowning',
          'Head Injuries',
          'Hemorrhage Control',
          'Isolated Trauma',
          'Multi-System Trauma',
          'Shock / Hypoperfusion',
          'Spinal Motion Restriction',
        ],
      },
    ],
  },
  {
    id: 'pediatric',
    title: 'Pediatric',
    subtitle: 'Pediatric patient protocols',
    accent: '#1d4ed8',
    sections: [
      {
        protocols: ['Pediatric Emergencies / Vital Signs'],
      },
      {
        title: 'Cardiac',
        protocols: [
          'CPR Procedure',
          'Cardiac Arrest',
          'Management / Post Resuscitation',
          'Termination of Resuscitation',
          'Chest Pain',
          'Dysrhythmia / Bradycardia',
          'Dysrhythmia / Tachycardia with Pulse',
          'Newborn Resuscitation',
        ],
      },
      {
        title: 'Medical',
        protocols: [
          'Abdominal Pain',
          'Abuse / Neglect',
          'Altered Mental Status / Unresponsive',
          'Anaphylaxis / Allergic Reaction',
          'Dehydration',
          'Diabetic Emergencies',
          'Nausea and/or Vomiting',
          'Overdose / Toxic Exposure',
          'Pain Management',
          'Respiratory Emergencies',
          'Seizures',
          'Sepsis',
          'Stroke',
        ],
      },
      {
        title: 'Environmental',
        protocols: [
          'Carbon Monoxide Poisoning',
          'Drowning',
          'Hyperthermia',
          'Hypothermia',
        ],
      },
      {
        title: 'Trauma',
        protocols: [
          'Burns',
          'Chest / Abdominal Injuries',
          'Head Injuries',
          'Isolated Trauma',
          'Multi-Systems Trauma',
          'Shock / Hypoperfusion',
          'Spinal Motion Restriction',
        ],
      },
    ],
  },
];

export const CATEGORIES: Category[] = RAW.map((c) => ({
  id: c.id,
  title: c.title,
  subtitle: c.subtitle,
  accent: c.accent,
  sections: c.sections.map((s) => ({
    title: s.title,
    protocols: s.protocols.map((title) => ({
      id: `${c.id}/${slug(title)}`,
      title,
    })),
  })),
}));

// Flattened index used by the global search bar.
export type SearchHit = {
  protocol: Protocol;
  categoryId: string;
  categoryTitle: string;
  sectionTitle?: string;
};

export const SEARCH_INDEX: SearchHit[] = CATEGORIES.flatMap((c) =>
  c.sections.flatMap((s) =>
    s.protocols.map((protocol) => ({
      protocol,
      categoryId: c.id,
      categoryTitle: c.title,
      sectionTitle: s.title,
    })),
  ),
);

export const findCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

export const findProtocol = (id: string): SearchHit | undefined =>
  SEARCH_INDEX.find((h) => h.protocol.id === id);
