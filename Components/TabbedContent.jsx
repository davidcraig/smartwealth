class TabbedContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTab: this.setDefaultTab()
    }
    this.changeTab = this.changeTab.bind(this)
  }

  setDefaultTab () {
    return Object.keys(this.props.content).slice(0, 1)[0]
  }

  changeTab (e) {
    const key = e.target.attributes['data-tab'].value
    this.setState({ activeTab: key })
  }

  renderTabs () {
    const content = this.props.content
    return Object.keys(content).map(key => {
      if (key === this.state.activeTab) {
        return <li key={key} className='is-active'>{content[key].title}</li>
      } else {
        return <li key={key}><a data-tab={key} onClick={this.changeTab}>{content[key].title}</a></li>
      }
    })
  }

  renderActiveTabContent () {
    const tabKey = this.state.activeTab
    return this.props.content[tabKey].content
  }

  render () {
    if (Object.keys(this.props.content).length > 0) {
      const tabs = <div className='tabs'><ul>{this.renderTabs()}</ul></div>
      const content = this.renderActiveTabContent()

      return (
        <>
          {tabs}
          {content}
        </>
      )
    }
    return ''
  }
}
TabbedContent.propTypes = {
  content: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.any.isRequired
    })
  )
}

export default TabbedContent
