/* This is a Web Worker to fetch and parse a google sheets public spreadshet into a json object */

// const spreadsheetUrl = 'https://spreadsheets.google.com/feeds/cells/1sSOTCWajfq_t0SEMFhfR0JedhgGXNeIH0ULMA2310c0/1/public/values?alt=json'

console.log('Spreadsheet Worker Initialised')

/* Takes a string and cleans it up for use as a jskey */
function slug(string) {
  return string
    .replace(' ', '_')
    .replace('(', '')
    .replace(')', '')
    .replace("\r\n", '')
    .replace("\r", '')
    .replace("\n", '')
    .replace('?', '')
    .toLowerCase();
}

function buildObjectArray(headers, data) {
  const output = []
  Object.keys(data).map(itemIndex => {
    let object = {}

    Object.keys(headers).map(index => {
      let header = headers[index]
      object[header.key] = data[itemIndex][index]
    })

    output.push(object)
  })

  return output
}

self.addEventListener(
  "message",
  function(e) {
    const event = e.data
    if (event.type = 'parse') {
      fetch(event.url)
      .then(res => {
        res.json().then(json => {
          const data = {}
          const headers = {}
          const headerRow = event.headerRow
          json.feed.entry.forEach(e => {
            let cell = e["gs$cell"]
            let row = cell.row
            let col = cell.col
            let content = e.content["$t"]

            if (row == headerRow) {
              headers[col] = { name: content, key: slug(content) }
            }
            if (row > headerRow) {
              if (!data[row]) { data[row] = [] }
              data[row][col] = content
            }
          })

          const output = buildObjectArray(headers, data)

          // Send the data back to main thread (react).
          self.postMessage({
            type: 'parse-result',
            data: output
          });
        })
      })
    }

    // 
  },
  false
);
