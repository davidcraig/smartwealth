function slug (string) {
  return string
    .replace(/ /g, '_')
    .replace(/\+/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\r\n/g, '')
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .replace(/\?/g, '')
    .toLowerCase()
}

export default slug
