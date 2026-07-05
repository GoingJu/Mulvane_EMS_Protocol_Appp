// Central place for colors / spacing so we can rebrand to match the logo later.
export type ThemeColors = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  primary: string;
  headerText: string;
};

const light: ThemeColors = {
  bg: '#f1f5f9',
  card: '#ffffff',
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  primary: '#b91c1c', // EMS red — placeholder until we match the official logo
  headerText: '#ffffff',
};

const dark: ThemeColors = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#f1f5f9',
  muted: '#94a3b8',
  border: '#334155',
  primary: '#ef4444',
  headerText: '#ffffff',
};

export const palettes = { light, dark };

export const space = (n: number) => n * 4;
export const radius = 14;

// Static default (light) for any code not yet wired to ThemeContext.
export const theme = {
  colors: light,
  space,
  radius,
};
