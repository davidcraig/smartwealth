# SmartWealth Changelog

## [Untagged]

### Added

 - Add a howto to the holdings page.
 - [Goals]
   * Add £5/mo dividend goal.
 - [Dashboard]
   * Add stat: Dividends forecast over next 12 months.
   * Show pie average yield and pie weighted yield on forcasting (index) page.

### Changed

 - Hide forecast tools and sidebar on index route when no positions are held.
 - Adjust style of completed goals.
 - Move Percentage to Formatting/AsPercentage for additional clarity of purpose.
 - [Dashboard]
   * Improve visuals of the tabs.
   * Stocks by Sector pie chart now sorted by slice size.
   * Increase size of diversification pie charts.
   * Adjust border colour of diversification pie charts.
   * Simplify 30 year charts by showing only amounts instead of broken down by company (Performance Improvement).
 - [Holdings]
   * Merge pie weight and actions column as there is only one action currently.
 - [Multiple]
   * Hide unusable sections when no positions are held.
 - [Global]
   * Set hyperlink hover colour.

### Fixed

 - Fix container-fluid which should be container is-fluid on holdings page.

## [2021-06-11]

### Added

 - Add a goals page for tracking progress in the following areas:
   * Amount Invested / Portfolio Size
   * Monthly Dividends
   * Emergency Fund

### Changed

 - Adjust app styles:
   * Change heading colour.
   * Add box-shadow to cards.
   * Update forecasting button.
 - Chart improvements:
   * Set chart height on portfolio by sector pies.
   * Change chart title for dividend and share forecasts.
   * Order StockValueBySector pie by slice size.
 - Improve forecasting pie controls:
   * remove # and weight columns.
   * Reduce overall size.
   * Move input onto new line and make 100% width.
   * Increase text size of input.
   * Adjust input border.
 - Performance improvements:
   * Only send forecast data once on completion.

## [2021-06-08]

### Fixed

 - Fix logic issue resulting in pie shares amount being incorrect (issue #1).

### Changed

 - Refactor dividend/share buying logic around pie vs non-pie logic for cleaner code separation.

## [2021-06-07]

### Changed

 - Original homepage now moved to /screener
 - Other forecasting apps that were previously separate poc's were now integrated into smartwealth app.
