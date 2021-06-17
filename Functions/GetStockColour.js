function GetStockColour (stock) {
  switch (stock) {
    case 'AGNC Investment Corp':
    case 'American Capital Agency Corp':
      return '#000'
    case 'Annaly Capital Management, Inc': return '#031f48'
    case 'Antero Midstream': return '#2d578b'
    case 'Apple': return '#f5f5f7'
    case 'Apollo Commercial Real Estate Finance, Inc.': return '#007D55'
    case 'Ares Capital Corporation': return '#012a40'
    case 'Aviva': return '#004fb6'
    case 'Brookfield Property Partners L.P.':
    case 'Brookfield Renewable Partners L.P.':
      return '#0F3557'
    case 'Coca-Cola': return '#F70000'
    case 'Chimera Investment': return '#000'
    case 'Dynex Capital, Inc.': return '#031554'
    case 'Enbridge':
    case 'Enbridge Inc':
      return '#ffb81c'
    case 'Federal Realty Investment Trust': return '#262626'
    case 'M&G Plc': return '#055a60'
    case 'Main Street Capital Corp': return '#166214'
    case 'Mondelez International, Inc': return '#4f2170'
    case 'MPLX LP': return '#ed174f'
    case 'National Retail Properties': return '#175591'
    case 'Oneok Inc': return '#007fc8'
    case 'Oxford Lane Capital Corp':
    case 'Oxford Square Capital Corp':
      return '#22282d'
    case 'Phillips 66 Partners LP': return '#DA2B1F'
    case 'Realty Income': return '#faa635'
    case 'Sage Group Plc': return '#00815D'
    case 'Shell Midstream Partners, L.P.': return '#f7d117'
    case 'Sherwin-Williams Co': return '#4e739f'
    case 'SPDR S&P UK Dividend': return '#213f31'
    case 'Starbucks': return '#008248'
    case 'Target Corp': return 'rgb(204, 0, 0)'
    case 'T. Row Price Group Inc': return '#05C3DE'
    case 'Unilever': return '#1f36c7'
    case 'Vanguard FTSE 100 GBP': return '#96151d'
    case 'Vanguard FTSE All-World High Dividend Yield': return '#96151d'
    case 'Vanguard Global Aggregate Bond': return '#96151d'
    case 'Vanguard S&P 500': return '#96151d'
    case 'Vanguard USD Treasury Bond': return '#96151d'
    case 'Verizon Communications Inc': return '#000'
    case 'Walmart': return '#0071DC'
    case 'West Pharmaceutical': return '#4080b0'
    default:
      // console.log(stock)
      return '#ececec'
  }
}

export default GetStockColour
