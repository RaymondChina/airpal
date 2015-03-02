import React from 'react';
import RunActions from '../actions/RunActions';
import { TabbedArea, TabPane } from 'react-bootstrap';
import MyOwnRuns from './MyOwnRuns';
import MySavedQueries from './MySavedQueries';
import AllRunningQueries from './AllRunningQueries';
import DataPreview from './DataPreview';
import TableStore from '../stores/TableStore';

let QueryInformation = React.createClass({
  displayName: 'QueryInformation',

  getInitialState() {
    return {
      selectedTab: 1,
      tableWidth: 400,
      tableHeight: 240,
      dataPreview: TableStore.getActiveTable()
    };
  },

  componentDidMount() {
    RunActions.connect();
    TableStore.listen(this.onChange);
    this.update();

    let win = window;

    if (win.addEventListener) {
      win.addEventListener('resize', this.onResize, false);
    } else if (win.attachEvent) {
      win.attachEvent('onresize', this.onResize);
    } else {
      win.onresize = this.onResize;
    }
  },

  componentWillUnmount() {
    RunActions.disconnect();
    TableStore.unlisten(this.onChange);
  },

  update() {
    var el = this.getDOMNode();
    this.setState({
      tableWidth: el.offsetWidth,
      tableHeight: el.offsetHeight,
    });
  },

  onChange() {
    var table = TableStore.getActiveTable();
    if (!table) return;
    if (this.state.dataPreview && table.name === this.state.dataPreview.name) return;
    this.setState({
      selectedTab: 4,
      dataPreview: TableStore.getActiveTable()
    });
  },

  onResize() {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(this.update, 16);
  },

  render() {
    let {selectedTab} = this.state;
    return (
      <div className="flex flex-column query-information">
        <TabbedArea className='flex'
          activeKey={selectedTab}
          animation={false}
          onSelect={this.onTabSelect}
          bsStyle='pills'>
            <TabPane className="query-information-table-tab"
              eventKey={1}
              tab="My recent queries">
                {selectedTab === 1 &&
                  <MyOwnRuns
                    tableWidth={this.state.tableWidth}
                    tableHeight={this.state.tableHeight} />}
            </TabPane>
            <TabPane
              eventKey={2}
              tab="My saved queries">
                {selectedTab === 2 && <MySavedQueries />}
            </TabPane>
            <TabPane className="query-information-table-tab"
              eventKey={3}
              tab="All queries">
                {selectedTab === 3 &&
                  <AllRunningQueries
                    tableWidth={this.state.tableWidth}
                    tableHeight={this.state.tableHeight}/>}
            </TabPane>
            <TabPane className="query-information-table-tab"
              eventKey={4}
              tab="Data Preview">
                {selectedTab === 4 &&
                  <DataPreview
                    tableWidth={this.state.tableWidth}
                    tableHeight={this.state.tableHeight}/>}
            </TabPane>
        </TabbedArea>
      </div>
    );
  },

  onTabSelect(selectedTab) {
    this.setState({ selectedTab });
  }
});

export default QueryInformation;
