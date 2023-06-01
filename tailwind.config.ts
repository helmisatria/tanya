import type { Config } from "tailwindcss";

export default {
   content: ["./app/**/*.{js,jsx,ts,tsx}"],
   theme: {
      extend: {
        lineHeight: {
          '140%': "140%",
        },
        letterSpacing: {
          tighter: "-0.04em",
        }
      },
   },
   plugins: [
      require('@tailwindcss/forms')
   ],
} satisfies Config;
