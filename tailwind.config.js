/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
          typography: ({ theme }) => ({
            invert: {
              css: {
                color: theme('colors.slate.300'),
                h1: { color: theme('colors.white') },
                h2: { color: theme('colors.white') },
                a: { color: theme('colors.blue.400') },
                strong: { color: theme('colors.white') },
                img: {
                  borderRadius: theme('borderRadius.lg'),
                  marginTop: theme('spacing.4'),
                  marginBottom: theme('spacing.4'),
                },
              },
            },
          }),
        },
      },      
    plugins: [require('@tailwindcss/typography')],
  }
  