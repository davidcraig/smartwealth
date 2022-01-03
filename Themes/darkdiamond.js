import ratingColours from './base/ratingColours'

const link = '#29bb15'

const styles = [
  { var: '--color-bg', val: '#00000d' },
  { var: '--img-bg', val: 'var(--diamond-bg)' },
  { var: '--color-text', val: '#ececec' },
  { var: '--color-bg-alt', val: '#000a20' },
  { var: '--color-bg-card-header', val: '#132551' },
  { var: '--color-border', val: '#494e5c' },
  { var: '--color-heading', val: '#e0e8ff' },
  { var: '--color-button', val: '#00a7e1' },
  { var: '--color-link', val: link },
  ...ratingColours
]

export default styles
