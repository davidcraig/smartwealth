/* global self, fetch */
/* This is a Web Worker to fetch and parse a google sheets public spreadshet into a json object */

// const spreadsheetUrl = 'https://spreadsheets.google.com/feeds/cells/1sSOTCWajfq_t0SEMFhfR0JedhgGXNeIH0ULMA2310c0/1/public/values?alt=json'

console.debug('Spreadsheet Worker Initialised')

/* Takes a string and cleans it up for use as a jskey */
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

function buildObjectArray (headers, data) {
  const output = []
  Object.keys(data).forEach(itemIndex => {
    const object = {}

    Object.keys(headers).forEach(index => {
      const header = headers[index]
      object[header.key] = data[itemIndex][index]
    })

    output.push(object)
  })

  return output
}

const parseSpreadsheetPromise = (url, headerRow) => {
  return new Promise(function (resolve, reject) {
    try {
      console.log('fetching from: ', url)
      console.log('headerRow: ', headerRow)
      fetch(url)
        .then(res => {
          res.json().then(json => {
            console.log('json', json)
            const data = {}
            const headers = {}
            json.feed.entry.forEach(e => {
              const cell = e["gs$cell"] // eslint-disable-line dot-notation, quotes
              const row = cell.row
              const col = cell.col
              const content = e.content["$t"] // eslint-disable-line dot-notation, quotes

              if (row == headerRow) { // eslint-disable-line
                headers[col] = { name: content, key: slug(content) }
              }
              if (row > headerRow) {
                if (!data[row]) { data[row] = [] }
                data[row][col] = content
              }
            })

            const output = buildObjectArray(headers, data)
            console.log(output)
            resolve(output)
          })
        })
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

self.addEventListener(
  'message',
  function (e) {
    const event = e.data
    const combinedOutput = []
    const promises = []
    switch (event.type) {
      case 'parse':
        fetch(event.url)
          .then(res => {
            res.json().then(json => {
              const data = {}
              const headers = {}
              const headerRow = event.headerRow // int
              json.feed.entry.forEach(e => {
                const cell = e["gs$cell"] // eslint-disable-line dot-notation, quotes
                const row = cell.row
                const col = cell.col
                const content = e.content["$t"] // eslint-disable-line dot-notation, quotes

                if (row == headerRow) { // eslint-disable-line
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
              })
            })
          })
        break
      case 'multi-parse':
        event.urls.forEach(u => promises.push(parseSpreadsheetPromise(u, event.headerRow)))
        Promise.all(promises)
          .then((values) => {
            values.forEach(result => result.forEach(item => combinedOutput.push(item)))
          })
          .finally(() => {
            console.log('combined', combinedOutput)
            // Send the data back to main thread (react).
            self.postMessage({
              type: 'parse-result',
              data: combinedOutput
            })
          })
        break
    }
  },
  false
)
