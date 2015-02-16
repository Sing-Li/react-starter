var _changeListeners = [];
var _sitestats = [{text: 'Age 0-25', value: 200}, 
 {text: 'Age 26-35', value: 300} , {text: 'Age 36-50', value: 500},
 {text: 'Age 51+', value: 100}];

var MockSiteStatsStore = {
  update: function (index, value) {
    _sitestats[index] = { 'text': _sitestats[index].text, 'value' : value};
    this.notifyChange();
  },
  getSiteStats: function() {
    // returns a clone
    return _.map(_sitestats, _.clone);
  },
  notifyChange: function () {
    _changeListeners.forEach(function (listener) {
      listener();
    });
  },

  addChangeListener: function (listener) {
    _changeListeners.push(listener);
  },

  removeChangeListener: function (listener) {
    _changeListeners = _changeListeners.filter(function (l) {
      return listener !== l;
    });
  }

};

var MockSiteStatsAction = MockSiteStatsStore;


var MyTableCell = React.createClass({
    getInitialState: function () {
        return {
            editing: false,
            data: this.props.data
        };
    },
 
    _cellChanged: function (e) {
        this.setState({data: e.target.value});
    },
    _cellClicked: function(e) {
      this.setState({editing: true});
      setTimeout(function() {
        this.refs.inp.getDOMNode().select();
      }.bind(this), 100);
      e.stopPropagation();
    },
    _okClicked: function(e) {
        this.setState({editing: false});
        if(this.props.onChange)  {
            this.props.onChange(e, this.props.idx, this.state.data);
        }
      e.stopPropagation();
    },
    render: function () {     
        return (
           <li onClick={this._cellClicked}>  {/* firefox bug bypass */}
      <input ref="inp" type='text' value={this.state.data}
                onChange={this._cellChanged} disabled={!this.state.editing} onClick={this._cellClicked} />
            <button onClick={this._okClicked} style={this.state.editing? {zIndex: 5}: {display:'none'}}>ok</button>
            </li>
            );
    }
});



var MyTable = React.createClass({
  _cellUpdated: function(evt, idx, v) {
    if (this.props.onUpdate) {
      this.props.onUpdate(evt, idx, v);
    }
    
  },
  render: function() {
     var rows = this.props.data.map(function(e, i) {
        return <div key={i}>{e.text}<MyTableCell data={e.value} 
        onChange={this._cellUpdated}  idx={0 + i}  /></div>;
     }, this);
 
    return <ul>{rows}</ul>
  }
});

var MyTableWrapper = React.createClass({
  _dataUpdated: function(evt, idx, v) {
    MockSiteStatsAction.update(idx, v);
  },

  render: function() {
     return <MyTable {...this.props} onUpdate={this._dataUpdated}/>;
  }

});

var  margin = { 'top': 20, 'right' : 20, 'bottom': 40, 'left': 50};
var MyBarChart = React.createClass({
  getInitialState: function() {
    return {
      // initial value from props
      stats: this.props.data
    }
  },
  _siteStatsUpdated: function() {
      if (!this.isMounted())  return;
      this.setState({'stats': MockSiteStatsStore.getSiteStats()});
    },
   componentDidMount: function() {
     MockSiteStatsStore.addChangeListener(this._siteStatsUpdated);
   
   },
   
   componentWillUnmount: function() {
     MockSiteStatsStore.removeChangeListener(this._siteStatsUpdated);
   },
  render: function() {
       return  <BarChart {...this.props} data={this.state.stats}/>;
}
});


var EditableChart = React.createClass({
  getDefaultProps: function() {
      return {
        // initial default value only - cached by React
        sitestats: MockSiteStatsStore.getSiteStats()
      }
  },

 
render: function() {
   return  <div className="containing">
          <div className="left-side">
            <MyTableWrapper data={this.props.sitestats} />
          </div>
          <div className="right-side">
            <MyBarChart ylabel="Visits" width={500} height={500} margin={margin} data={this.props.sitestats} />
          </div>
        </div>;
}
});

React.addons.Perf.start();
React.render(
  <EditableChart />,
  document.getElementById('container')
);
React.addons.Perf.stop();
React.addons.Perf.printInclusive();

React.addons.Perf.printWasted();
