import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'

const NextHighchart = ({ options, containerProps }) => {
  return <HighchartsReact
    highcharts={Highcharts}
    options={options}
    containerProps={containerProps}
  />
}

NextHighchart.propTypes = {
  options: PropTypes.object.isRequired,
  containerProps: PropTypes.object
}

export default NextHighchart
