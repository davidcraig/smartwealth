function BaseCurrency (value: number) {
  return new Intl.NumberFormat('en-UK', { style: 'currency', currency: 'GBP' }).format(value)
}

export default BaseCurrency
