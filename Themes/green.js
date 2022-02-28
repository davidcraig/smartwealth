import ratingColours from './base/ratingColours'

const link = '#29bb15'

const baseHue = '150deg';

const styles = [
  { var: '--color-bg', val: `hsl(${baseHue} 12% 21%)` },
  { var: '--color-text', val: '#ececec' },
  { var: '--color-bg-alt', val: `hsl(${baseHue} 12% 24%)` },
  { var: '--color-bg-card-header', val: `hsl(${baseHue} 12% 24%)` },
  { var: '--color-border', val: `hsl(${baseHue} 12% 32%)` },
  { var: '--color-heading', val: '#e0e8ff' },
  { var: '--color-button', val: `hsl(${baseHue} 100% 44%)` },
  { var: '--color-link', val: link },
  ...ratingColours
]

export default styles
