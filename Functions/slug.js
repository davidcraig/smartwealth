function slug(string) {
  return string
    .replace(' ', '_')
    .replace('+', '')
    .replace('(', '')
    .replace(')', '')
    .replace("\r\n", '')
    .replace("\r", '')
    .replace("\n", '')
    .replace('?', '')
    .replace(' ', '')
    .toLowerCase();
}

export default slug
