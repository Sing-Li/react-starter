

var MyTextfield = React.createClass({
  render: function() {
    return <input type='text' />;
  }
});

var MyButton = React.createClass({
  render: function() {
    return <button>{this.props.textlabel}</button>;
  }
});

var MyLabel = React.createClass({
   render: function() {
    return <div>{this.props.text}</div>;
  }
});

var TextLabel = 'Number of rows';

React.render(
  <div>
     <MyLabel  text={TextLabel} />
     <MyTextfield />
     <MyButton textlabel='OK' />
  </div>,
  document.getElementById('container')
);
