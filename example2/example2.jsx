
var MyLabel = React.createClass({
   render: function() {
    return <div>{this.props.text}</div>;
  }
});

var MyButton = React.createClass({
  _buttonClicked:  function(e) {
    if (this.props.onClick) {
        this.props.onClick(e)
    }
  },
  render: function() {
    return <button onClick={this._buttonClicked}>{this.props.textlabel}</button>;
  }
});


var MyTextfield = React.createClass({
  getInitialState: function() {
     return {
      data: '1'
     };
  },
  getInitialProps: function() {
    return {
      maxVal : 10
    };
  },
  _entryChanged: function(e) {
    var val = e.target.value;
    var validated = '1';
    if (!(isNaN(val) || (parseInt(val) > 9 ) || (parseInt(val) < 1)))   {
      validated = val;
    } 
    this.setState({data: validated});
    if (this.props.onChange) {
      this.props.onChange(validated);
    }
  },
  render: function() {
    return <input type='text' onChange={this._entryChanged} value={this.state.data} />;
  }
});



var ButtonLabel = 'OK';

var MyTableCell = React.createClass({
    render: function () {     
        return (
           <li> 
              <input type='text' value={this.props.data}
                 disabled/>
            </li>
            );
    }
});



var DynamicList = React.createClass({
  render: function() {
  	var rows =  [];
  	for(var i=0; i < this.props.rows; i++ ) {
  		rows.push(<MyTableCell key={'rowdata-' + i} data={i + 1}  />);
  	} 	
    return <ul>{rows}</ul>;
  }
});

var ListCreator = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      data: '1',
      rows: 1
    };
  },
  _okClicked: function() {
    this.setState({rows: parseInt(this.state.data)});
  },
  _dataChanged: function(newValue) {
     this.setState({data: newValue});
  },
  render: function() {
   return   <div className='containing'> 
              <div className='left-side'>      
               <MyLabel  text='Number of rows' />
               <MyTextfield onChange={this._dataChanged} />
               <MyButton textlabel={ButtonLabel} onClick={this._okClicked} />
              </div>
              <div className='right-side'>
               <DynamicList rows={this.state.rows} />
               </div>
            </div>;
  }
});


React.render(
   <ListCreator />,
  document.getElementById('container')
);
