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

    headers.forEach((header, index) => {
      object[slug(header)] = data[itemIndex][index]
    })

    output.push(object)
  })

  return output
}

self.addEventListener(
  'message',
  function (e) {
    const event = e.data
    switch (event.type) {
      case 'parse':
        try {
          fetch(event.url)
            .then(res => {
              res.json()
                .then(json => {
                  const headerRow = event.headerRow // int
                  const data = json.values
                  const headersAndValues = data.splice(headerRow - 1)
                  const headers = headersAndValues[0]

                  const output = buildObjectArray(headers, headersAndValues.splice(1))

                  // Send the data back to main thread (react).
                  self.postMessage({
                    type: 'parse-result',
                    data: output
                  })
                })
                .catch(err => {
                  console.error('error in json from parse: ', err)
                })
            })
        } catch (err) {
          console.error('Parse error: ', err)
        }
        break
      case 'multi-parse':
        // try {
        //   event.urls.forEach(u => promises.push(parseSpreadsheetPromise(u, event.headerRow)))
        //   Promise.all(promises)
        //     .then((values) => {
        //       values.forEach(result => result.forEach(item => combinedOutput.push(item)))
        //     })
        //     .finally(() => {
        //       console.log('combined', combinedOutput)
        //       // Send the data back to main thread (react).
        //       self.postMessage({
        //         type: 'parse-result',
        //         data: combinedOutput
        //       })
        //     })
        // } catch (err) {
        //   console.log('Multiparse error: ', err)
        // }
        break
    }
  },
  false
)
