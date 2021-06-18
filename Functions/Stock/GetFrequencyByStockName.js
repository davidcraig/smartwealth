function GetFrequencyByName (stock) {
  switch (stock) {
    // MONTHLY STOCKS
    case 'AGNC Investment Corp':
    case 'American Capital Agency Corp':
    case 'ARMOUR Residential REIT, Inc':
    case 'Realty Income':
    case 'Oxford Lane Capital Corp':
    case 'Oxford Square Capital Corp':
    case 'Dynex Capital, Inc.':
    case 'Gladstone Capital':
    case 'Gladstone Commercial':
    case 'Gladstone Investment':
    case 'Gladstone Land':
    case 'LTC REIT':
    case 'Main Street Capital Corp':
    case 'Shaw Communications (Class B)':
    case 'STAG':
    case 'STAG Industrial':
    case 'Tesco':
    case 'Vanguard USD Treasury Bond':
      return 'monthly'

      // QUARTERLY STOCKS
    case '3M':
    case 'A.O. Smith Corporation':
    case 'Annaly Capital Management, Inc':
    case 'Coca-Cola':
    case 'Doric Nimrod Air One Limited':
    case 'Doric Nimrod Air Two Limited':
    case 'Doric Nimrod Air Three Limited':
    case 'Icahn Enterprises':
    case 'Illinois Tool Works Inc':
    case 'Pfizer':
    case 'AbbVie Inc':
    case 'Abbott Laboratories':
    case 'AFLAC Inc.':
    case 'Air Products and Chemicals, Inc.':
    case 'Albemarle':
    case 'AllianceBernstein Holding':
    case 'Altus Midstream Company':
    case 'Altria Group':
    case 'Amcor plc':
    case 'American States Water':
    case 'Antero Midstream':
    case 'Apple':
    case 'Apollo Commercial Real Estate Finance, Inc.':
    case 'Archer-Daniels-Midland Co':
    case 'Ares Capital Corporation':
    case 'AT&T Inc':
    case 'Atmos Energy Corp':
    case 'Automatic Data Processing, Inc.':
    case 'Bank of Nova Scotia':
    case 'Becton Dickinson & Co':
    case 'BlackRock Capital Investment Corporation':
    case 'Brookfield Property Partners L.P.':
    case 'Brookfield Renewable Partners L.P.':
    case 'Brown Forman Inc.':
    case 'Cardinal Health Inc':
    case 'Caterpillar Inc.':
    case 'Chevron Corporation':
    case 'Chimera Investment':
    case 'Chubb Ltd':
    case 'Church & Dwight':
    case 'Cincinnati Financial Corporation':
    case 'Cintas Corp':
    case 'Colgate-Palmolive Company':
    case 'Consolidated Edison, Inc':
    case 'Dover Corp':
    case 'Ecolab':
    case 'Electronic Arts':
    case 'Emerson Electric Co':
    case 'Enbridge':
    case 'Enbridge Inc':
    case 'Enterprise Products Partners':
    case 'Essex Property Trust, Inc.':
    case 'Extra Space Storage Inc.':
    case 'Exxon Mobil':
    case 'Federal Realty Investment Trust':
    case 'Franklin Resources, Inc.':
    case 'General Dynamics':
    case 'Genuine Parts Company':
    case 'Global Net Lease, Inc':
    case 'Grainger W.W. Inc':
    case 'Hercules Capital':
    case 'Hormel Foods Corp':
    case 'IBM':
    case 'iShares':
    case 'iShares China Large Cap':
    case 'Johnson & Johnson':
    case 'Kellogg':
    case 'Kimberly-Clark':
    case 'Legal and General':
    case 'Leggett & Platt Inc':
    case 'Linde Plc':
    case "Lowe's Companies, Inc":
    case 'Lumen':
    case 'CenturyLink':
    case 'Lumen (formerly CenturyLink)':
    case 'Magellan Midstream Partners LLP':
    case 'McCormick & Co':
    case 'McDonalds':
    case 'Medtronic Plc':
    case 'Mondelez International, Inc':
    case 'MPLX LP':
    case 'National Retail Properties':
    case 'New Residential Investment Corp.':
    case 'Nucor Corp':
    case 'Oasis Midstream Partners LP':
    case 'Omega Healthcare Investors':
    case 'OneMain Holdings':
    case 'Oneok Inc':
    case "People's United Financial":
    case 'PepsiCo':
    case 'Phillips 66 Partners LP':
    case 'PPG Industries, Inc.':
    case 'Primary Health Properties':
    case 'Procter & Gamble':
    case 'Roper Technologies, Inc':
    case 'S&P Global':
    case 'Shell Midstream Partners, L.P.':
    case 'Sherwin-Williams Co':
    case 'SPDR S&P UK Dividend':
    case 'Stanley Black & Decker':
    case 'Starbucks':
    case 'Sysco Corporation':
    case 'T. Rowe Price Group Inc':
    case 'Target Corp':
    case 'The Clorox Company':
    case 'Unilever':
    case 'Vanguard FTSE 100 GBP':
    case 'Vanguard FTSE All-World High Dividend Yield':
    case 'Vanguard Global Aggregate Bond':
    case 'Vanguard S&P 500':
    case 'Verizon Communications Inc':
    case 'VF Corp':
    case 'W.P. Carey':
    case 'Walgreens Boots Alliance':
    case 'Walmart':
    case 'West Pharmaceutical':
    case 'Xtrackers Russell 2000 UCITS ETF 1C':
      return 'quarterly'

      // ANNUAL STOCKS
      // case '':
      //   return 'annual'

    // ANNUAL+INTERIM STOCKS
    case 'Aviva':
    case 'M&G Plc':
    case 'National Grid':
    case 'Reckitt Benckiser':
    case 'Sage Group Plc':
      return 'annualinterim'
  }
}

export default GetFrequencyByName
