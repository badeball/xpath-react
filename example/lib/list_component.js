var React = require("react");

var PropTypes = require("prop-types");

function List (props) {
  return (
    <div>
      <h1>Items</h1>

      {props.isLoading &&
        <p>Loading items..</p>}

      {!props.isLoading &&
        <ul>
          {(props.items || []).map(function (item, i) {
            return (
              <li key={i}>
                {item}

                <button onClick={e => props.onRemove(i)}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>}

      <textarea value={props.formValue} onChange={e => props.change(e.target.value)} />
      <button onClick={() => props.onAdd(props.formValue)}>Add</button>
    </div>
  );
}

List.propTypes = {
  formValue: PropTypes.string,
  isLoading: PropTypes.bool,
  items: PropTypes.array,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onRemove: PropTypes.func
};

module.exports = List;
