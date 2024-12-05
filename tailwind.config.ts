import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'mw-gray': '#EBEBEB',
        'mw-purple': {
          '500': '#8B5CF6'
        },
        'mw-red': {
          '100': '#FFE5E5',
          '200': '#FFB3B3',
          '300': '#FF8080',
          '400': '#FF4D4D',
          '500': '#FF1A1A',
          '700': '#CC0000',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;