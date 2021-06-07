function GetSectorColour (sector) {
  switch (sector) {
    case 'Financials': return '#1c59dd'
    case 'Real Estate': return '#dc9c3a'
    case 'Energy': return '#3edd4e'
    case 'ETF': return '#efe97a'
    case 'Consumer Staples': return '#f40096'
    case 'Consumer Discretionary': return '#ef40c9'
    case 'Communication Services': return '#bff400'
    case 'Industrials': return '#704422'
    case 'Utilities': return '#dc9c3a'
    case 'Materials': return '#fff'
    case 'Information Technology': return '#018c03'
    case 'Health Care': return '#6795f7'
  }
}

export default GetSectorColour
