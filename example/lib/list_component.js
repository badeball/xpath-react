/* eslint-env node */

"use strict";

var React = require("react");

module.exports = React.createClass({
  displayName: "List",

  propTypes: {
    formValue: React.PropTypes.string,
    isLoading: React.PropTypes.bool,
    items: React.PropTypes.array,
    onAdd: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onRemove: React.PropTypes.func
  },

  onAdd: function () {
    this.props.onAdd(this.props.formValue);
  },

  onChange: function (e) {
    this.props.onChange(e.target.value);
  },

  onRemove: function (iItem) {
    this.props.onRemove(iItem);
  },

  render: function () {
    return (
      <div>
        <h1>Items</h1>

        {this.props.isLoading &&
          <p>Loading items..</p>}

        {!this.props.isLoading &&
          <ul>
            {(this.props.items || []).map(function (item, i) {
              return (
                <li key={i}>
                  {item}

                  <button onClick={this.onRemove.bind(null, i)}>
                    Delete
                  </button>
                </li>
              );
            }, this)}
          </ul>}

        <textarea value={this.props.formValue} onChange={this.onChange} />
        <button onClick={this.onAdd}>Add</button>
      </div>
    );
  }
});
