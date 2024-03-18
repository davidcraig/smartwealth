import Card from '../Card'
import TabbedContent from '../TabbedContent'

function ThemeElementsPreview () {
  return (
    <Card title='Theme Elements Preview'>
      <p>Text</p>
      <a>Link</a>
      <label className='label'>
        Generic Input
      </label>
      <input type='textbox' />
      <TabbedContent
        content={
          [
            { title: 'Test Tab 1', content: <p>Test content 1</p> },
            { title: 'Test Tab 2', content: <p>Test content 2</p> }
          ]
        }
      />

      <p>Table</p>
      <table className='table'>
        <thead>
          <tr>
            <th>Test</th>
            <th>Test</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='monthly'>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='quarterly'>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='annualinterim'>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='annual__interim'>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='irregular'>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='suspended'>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='bi-annually'>
            <td>Test</td>
            <td>Test</td>
          </tr>
          <tr className='temporarily_suspended'>
            <td>Test</td>
            <td>Test</td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

export default ThemeElementsPreview
