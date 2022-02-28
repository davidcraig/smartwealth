function GetStockColour (stock) {
  switch (stock) {
    case '3M': return '#FF0000'
    case 'A.O. Smith Corporation': return '#007e44'
    case 'AbbVie Inc': return '#071d49'
    case 'Abbott Laboratories': return '#5bc2e7'
    case 'AFLAC Inc.': return '#00A7E1'
    case 'AGNC Investment Corp':
    case 'American Capital Agency Corp':
      return '#000'
    case 'Air Products and Chemicals, Inc.': return '#009a49'
    case 'Albemarle': return '#008576'
    case 'AllianceBernstein Holding': return '#1e9bd7'
    case 'Altus Midstream Company': return '#243746'
    case 'Altria Group': return '#06c'
    case 'Amcor plc': return '#00395a'
    case 'American States Water': return '#06568b'
    case 'Annaly Capital Management, Inc': return '#031f48'
    case 'Antero Midstream': return '#2d578b'
    case 'Apple': return '#f5f5f7'
    case 'Apollo Commercial Real Estate Finance, Inc.': return '#007D55'
    case 'Archer-Daniels-Midland Co': return '#012169'
    case 'Ares Capital Corporation': return '#012a40'
    case 'ARMOUR Residential REIT, Inc': return '#1e4b8e'
    case 'AT&T Inc': return '#009FDB'
    case 'Atmos Energy Corp': return '#2175d9'
    case 'Automatic Data Processing, Inc.': return '#d0271d'
    case 'Aviva': return '#004fb6'
    case 'Bank of Nova Scotia': return '#ed0722'
    case 'Becton Dickinson & Co': return '#004593'
    case 'BlackRock Capital Investment Corporation': return '#161616'
    case 'Broadmark Realty Capital Inc.': return '#3c4d63'
    case 'Brookfield Property Partners L.P.':
    case 'Brookfield Renewable Partners L.P.':
      return '#0F3557'
    case 'Brown Forman Inc.': return '#787268'
    case 'Cardinal Health Inc': return '#e41f35'
    case 'Caterpillar Inc.': return '#ffcd11'
    case 'Chevron Corporation': return '#009DD9'
    case 'Chimera Investment': return '#000'
    case 'Chubb Ltd': return '#e41913'
    case 'Church & Dwight': return '#ba0c2f'
    case 'Cincinnati Financial Corporation': return '#004d71'
    case 'Cintas Corp': return '#002b80'
    case 'Coca-Cola': return '#F70000'
    case 'Colgate-Palmolive Company': return '#28a4c3'
    case 'Consolidated Edison, Inc': return '#0078cf'
    case 'Cross Timbers Royalty Trust': return '#e60317'
    case 'Dynex Capital, Inc.': return '#031554'
    case 'Doric Nimrod Air One Limited':
    case 'Doric Nimrod Air Two Limited':
    case 'Doric Nimrod Air Three Limited':
      return '#336699'
    case 'Dover Corp': return '#004b8d'
    case 'Ecolab': return '#007ac9'
    case 'Electronic Arts': return '#FF4747'
    case 'Emerson Electric Co': return '#004b8d'
    case 'Enbridge':
    case 'Enbridge Inc':
      return '#ffb81c'
    case 'Enterprise Products Partners': return '#002147'
    case 'Essex Property Trust, Inc.': return '#c75109'
    case 'Extra Space Storage Inc.': return '#91C717'
    case 'Exxon Mobil': return '#fe000c'
    case 'Federal Realty Investment Trust': return '#262626'
    case 'Franklin Resources, Inc.': return '#005598'
    case 'General Dynamics': return '#003087'
    case 'Genuine Parts Company': return '#0054A3'
    case 'Gladstone Capital':
    case 'Gladstone Commercial':
    case 'Gladstone Investment':
    case 'Gladstone Land':
      return '#005596'
    case 'Global Net Lease, Inc': return '#0F75BC'
    case 'Grainger W.W. Inc': return '#c8102e'
    case 'Hercules Capital': return '#f66536'
    case 'Hormel Foods Corp': return '#008841'
    case 'IBM': return '#0062ff'
    case 'Icahn Enterprises': return '#547ba6'
    case 'Illinois Tool Works Inc': return '#8a1538'
    case 'iShares':
    case 'iShares China Large Cap':
      return '#72ca33'
    case 'Johnson & Johnson': return '#d51900'
    case 'Kellogg': return '#bf162c'
    case 'Kimberly-Clark': return '#0F059E'
    case 'Legal and General': return '#0076d6'
    case 'Leggett & Platt Inc': return '#002855'
    case 'Linde Plc': return '#005591'
    case "Lowe's Companies, Inc": return '#004990'
    case 'LTC REIT': return '#1d3662'
    case 'Lumen':
    case 'CenturyLink':
    case 'Lumen (formerly CenturyLink)':
      return '#0075c9'
    case 'M&G Plc': return '#055a60'
    case 'Magellan Midstream Partners LLP': return '#0A6826'
    case 'Main Street Capital Corp': return '#166214'
    case 'McCormick & Co': return '#c30000'
    case 'McDonalds': return '#ffbc0d'
    case 'Medtronic Plc': return '#004b87'
    case 'Mondelez International, Inc': return '#4f2170'
    case 'MPLX LP': return '#ed174f'
    case 'National Grid': return '#00148c'
    case 'National Retail Properties': return '#175591'
    case 'New Residential Investment Corp.': return '#79ad4f'
    case 'Nucor Corp': return '#006325'
    case 'Oasis Midstream Partners LP': return '#004990'
    case 'Omega Healthcare Investors': return '#20368c'
    case 'OneMain Holdings': return '#004B75'
    case 'Oneok Inc': return '#007fc8'
    case 'Orchid Island Capital': return '#7a8e4a'
    case 'Oxford Lane Capital Corp':
    case 'Oxford Square Capital Corp':
      return '#22282d'
    case "People's United Financial": return '#004B8D'
    case 'Pembina Pipeline Corporation': return '#eb1c2c'
    case 'PennantPark Floating Rate Capital Ltd': return '#224097'
    case 'PepsiCo': return '#30375b'
    case 'Pfizer': return '#0093D0'
    case 'Phillips 66 Partners LP': return '#DA2B1F'
    case 'PPG Industries, Inc.': return '#2a7ab0'
    case 'Primary Health Properties': return '#97d700'
    case 'Procter & Gamble': return '#003da7'
    case 'Prospect Capital Corporation': return '#0075bb'
    case 'Realty Income': return '#faa635'
    case 'Reckitt Benckiser': return '#ff007f'
    case 'Roper Technologies, Inc': return '#009DDC'
    case 'S&P Global': return '#d6002a'
    case 'Sage Group Plc': return '#00815D'
    case 'Shaw Communications (Class B)': return '#007cba'
    case 'Shell Midstream Partners, L.P.': return '#f7d117'
    case 'Sherwin-Williams Co': return '#4e739f'
    case 'SLR Senior Investment Corp': return '#16274c'
    case 'SPDR S&P UK Dividend': return '#213f31'
    case 'STAG':
    case 'STAG Industrial':
      return '#204587'
    case 'Stanley Black & Decker': return '#ffdb0a'
    case 'Starbucks': return '#008248'
    case 'Stellus Capital Investment Corporation': return '#152952'
    case 'Sysco Corporation': return '#008CD2'
    case 'T. Rowe Price Group Inc': return '#05c3de'
    case 'Target Corp': return 'rgb(204, 0, 0)'
    case 'Tesco': return '#ee1c2e'
    case 'The Clorox Company': return '#297CA5'
    case 'Unilever': return '#1f36c7'
    case 'Vanguard FTSE 100 GBP':
    case 'Vanguard FTSE All-World High Dividend Yield':
    case 'Vanguard FTSE All-World':
    case 'Vanguard Global Aggregate Bond':
    case 'Vanguard S&P 500':
    case 'Vanguard U.K. Gilt UCITS ETF':
    case 'Vanguard USD Treasury Bond':
      return '#96151d'
    case 'Verizon Communications Inc': return '#000000'
    case 'VF Corp': return '#004c97'
    case 'W.P. Carey': return '#007cba'
    case 'Walgreens Boots Alliance': return '#00686D'
    case 'Walmart': return '#0071dc'
    case 'West Pharmaceutical': return '#4080b0'
    case 'Whitestone REIT': return '#002f87'
    case 'Xtrackers Russell 2000 UCITS ETF 1C': return '#009da2'
    default:
      return '#ececec'
  }
}

export default GetStockColour
