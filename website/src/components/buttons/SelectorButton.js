import PropTypes from 'prop-types';
import React from 'react';

export default class SelectorButton extends React.Component {
  constructor(props) {
    super(props);
    this._onInputChange = this._onInputChange.bind(this);
    this._onClear = this._onClear.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  _onInputChange(event) {
    this.props.onSelectorChange(event.target.value);
  }

  _onClear() {
    this.props.onSelectorChange('');
  }

  _onKeyDown(event) {
    if (event.key === 'Escape') {
      this._onClear();
    }
  }

  render() {
    const {selector, isSupported} = this.props;
    const hasValue = selector && selector.trim().length > 0;

    return (
      <div className="button selectorButton" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
        <i className="fa fa-lg fa-search fa-fw" title="ESLint Selector" />
        <input
          type="text"
          placeholder="ESLint selector! (e.g., Identifier)"
          value={selector || ''}
          onChange={this._onInputChange}
          onKeyDown={this._onKeyDown}
          disabled={!isSupported}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'inherit',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            minWidth: '200px',
            flex: 1,
          }}
          title={isSupported ? 'Enter an ESLint selector to highlight matching AST nodes' : 'Selector matching only works with ESTree parsers'}
        />
        {hasValue && (
          <button
            type="button"
            onClick={this._onClear}
            style={{minWidth: 0, padding: '2px 6px'}}
            title="Clear selector">
            <i className="fa fa-times" />
          </button>
        )}
      </div>
    );
  }
}

SelectorButton.propTypes = {
  selector: PropTypes.string,
  isSupported: PropTypes.bool,
  onSelectorChange: PropTypes.func.isRequired,
};

