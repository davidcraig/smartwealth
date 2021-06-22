interface Stock {
  ticker: string;
  currency: string;
  dividend_aristocrat?: string;
  dividend_frequency?: string;
  dividend_king?: string;
  dividend_yield?: string;
  dividend_return?: string;
  dividend_months?: string;
  first_dividend?: string;
  founded?: string;
  freetrade_free?: string;
  gics_sector?: string;
  last_dividend_amount?: string;
  last_dividend_value_drop?: string;
  name?: string;
  next_aristocrat_check_date?: string;
  next_king_check_date?: string;
  "reit_/_bdc_/_mlp_/_corp"?: string;
  share_price?: string;
  time_to_break_even_years_uncompounded?: string;
  trading_212?: string;
  true_yield_uk?: string;
  type?: string;
}

export default Stock
