/**
 * Simple Theme System
 * Just changes primary accent color - keeping it simple!
 */

export interface Theme {
  name: string;
  label: string;
  color: string; // Hex color for preview
  primary: {
    light: string;
    dark: string;
  };
}

export const themes: Theme[] = [
  {
    name: "zinc",
    label: "Zinc (Default)",
    color: "#18181b",
    primary: {
      light: "oklch(0.205 0 0)",
      dark: "oklch(0.922 0 0)",
    },
  },
  {
    name: "blue",
    label: "Blue",
    color: "#3b82f6",
    primary: {
      light: "oklch(0.6 0.2 250)",
      dark: "oklch(0.7 0.2 250)",
    },
  },
  {
    name: "green",
    label: "Green",
    color: "#22c55e",
    primary: {
      light: "oklch(0.65 0.25 145)",
      dark: "oklch(0.75 0.25 145)",
    },
  },
  {
    name: "red",
    label: "Red",
    color: "#ef4444",
    primary: {
      light: "oklch(0.6 0.25 25)",
      dark: "oklch(0.7 0.25 25)",
    },
  },
  {
    name: "orange",
    label: "Orange",
    color: "#f97316",
    primary: {
      light: "oklch(0.65 0.22 50)",
      dark: "oklch(0.75 0.22 50)",
    },
  },
  {
    name: "yellow",
    label: "Yellow",
    color: "#eab308",
    primary: {
      light: "oklch(0.75 0.18 95)",
      dark: "oklch(0.8 0.18 95)",
    },
  },
  {
    name: "purple",
    label: "Purple",
    color: "#a855f7",
    primary: {
      light: "oklch(0.6 0.25 300)",
      dark: "oklch(0.7 0.25 300)",
    },
  },
  {
    name: "pink",
    label: "Pink",
    color: "#ec4899",
    primary: {
      light: "oklch(0.65 0.25 350)",
      dark: "oklch(0.75 0.25 350)",
    },
  },
  {
    name: "teal",
    label: "Teal",
    color: "#14b8a6",
    primary: {
      light: "oklch(0.65 0.15 190)",
      dark: "oklch(0.75 0.15 190)",
    },
  },
  {
    name: "indigo",
    label: "Indigo",
    color: "#6366f1",
    primary: {
      light: "oklch(0.6 0.22 275)",
      dark: "oklch(0.7 0.22 275)",
    },
  },
];
