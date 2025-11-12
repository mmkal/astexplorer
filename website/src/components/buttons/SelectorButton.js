import PropTypes from 'prop-types';
import React from 'react';

export default class SelectorButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
    this._onInputChange = this._onInputChange.bind(this);
    this._onClear = this._onClear.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
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
      event.target.blur();
    }
  }

  _onFocus() {
    this.setState({isFocused: true});
  }

  _onBlur() {
    this.setState({isFocused: false});
  }

  render() {
    const {selector, isSupported} = this.props;
    const {isFocused} = this.state;
    const hasValue = selector && selector.trim().length > 0;

    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      position: isFocused ? 'absolute' : 'relative',
      left: isFocused ? '10px' : 'auto',
      right: isFocused ? '10px' : 'auto',
      top: isFocused ? '2px' : 'auto',
      zIndex: isFocused ? 1000 : 'auto',
      backgroundColor: isFocused ? '#efefef' : 'transparent',
      padding: isFocused ? '0 6px' : '0',
      width: isFocused ? 'calc(100% - 120px)' : 'auto',
      minWidth: isFocused ? 'calc(100% - 120px)' : 'auto',
      maxWidth: isFocused ? '700px' : 'none',
    };

    const inputStyle = {
      border: 'none',
      background: isFocused ? '#fff' : 'transparent',
      outline: 'none',
      color: 'inherit',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      minWidth: isFocused ? '400px' : '200px',
      flex: isFocused ? '1 1 auto' : 1,
      width: isFocused ? '100%' : 'auto',
      padding: isFocused ? '2px 4px' : '0',
      borderRadius: isFocused ? '2px' : '0',
    };

    return (
      <div className={`button selectorButton ${isFocused ? 'expanded' : ''}`} style={containerStyle}>
        <i className="fa fa-lg fa-search fa-fw" title="ESLint Selector" />
        <input
          type="text"
          placeholder="ESLint selector (e.g., Identifier)"
          value={selector || ''}
          onChange={this._onInputChange}
          onKeyDown={this._onKeyDown}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          disabled={!isSupported}
          style={inputStyle}
          title={isSupported ? 'Enter an ESLint selector to highlight matching AST nodes' : 'Selector matching only works with ESTree parsers'}
        />
        {hasValue && (
          <button
            type="button"
            onClick={this._onClear}
            style={{
              minWidth: 0,
              padding: '2px 6px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
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

