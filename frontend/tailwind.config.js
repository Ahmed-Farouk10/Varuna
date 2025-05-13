/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        cool: ['cool'],
        flore: ['flore'],
        monogram: ['monogram'],
        darling:['darling'],
        pixel: ['Pixel'],
        wild:['Wildly'],
        coffee:['coffee'],
        cool:['cool'],
        lostar:['Lostar'],
        mine:['mine'],
      },
      fontSize:{
        header:'30em',
        headers: "25em"
      }
    },
  },
  plugins: [],
}