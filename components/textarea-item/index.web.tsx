import React from 'react';
import classNames from 'classnames';
function noop() {}

import TextareaItemProps from './TextAreaItemPropsType';
import getDataAttr from '../_util/getDataAttr';

function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export interface TextareaItemState {
  focus: boolean;
}

export default class TextareaItem extends React.Component<TextareaItemProps, TextareaItemState> {
  static defaultProps = {
    prefixCls: 'am-textarea',
    prefixListCls: 'am-list',
    title: '',
    autoHeight: false,
    editable: true,
    disabled: false,
    name: '',
    defaultValue: '',
    placeholder: '',
    clear: false,
    rows: 1,
    onChange: noop,
    onBlur: noop,
    onFocus: noop,
    onErrorClick: noop,
    error: false,
    labelNumber: 4,
  };

  initialTextHeight: number;
  debounceTimeout: any;

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };
  }

  componentDidMount() {
    if (this.props.autoHeight) {
      this.initialTextHeight = (this.refs as any).textarea.offsetHeight;
      this.componentDidUpdate();
    }
  }

  componentDidUpdate() {
    if (this.props.autoHeight) {
      let textareaDom = (this.refs as any).textarea;
      textareaDom.style.height = '';
      textareaDom.style.height = `${Math.max(this.initialTextHeight, textareaDom.scrollHeight)}px`;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.value !== this.props.value
      || nextProps.defaultValue !== this.props.defaultValue
      || nextProps.error !== this.props.error
      || nextProps.disabled !== this.props.disabled
      || nextProps.editable !== this.props.editable
      || nextState.focus !== this.state.focus
    );
  }

  componentWillUnmount() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }

  onChange = (e) => {
    let value = e.target.value;
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  onBlur = (e) => {
    this.debounceTimeout = setTimeout(() => {
      this.setState({
        focus: false,
      });
    }, 500);
    const value = e.target.value;
    if (this.props.onBlur) {
      this.props.onBlur(value);
    }
  };

  onFocus = (e) => {
    this.setState({
      focus: true,
    });
    const value = e.target.value;
    if (this.props.onFocus) {
      this.props.onFocus(value);
    }
  };

  onErrorClick = () => {
    if (this.props.onErrorClick) {
      this.props.onErrorClick();
    }
  };

  clearInput = () => {
    if (this.props.onChange) {
      this.props.onChange('');
    }
  };

  render() {
    let {
      prefixCls, prefixListCls, style, title, name, value, defaultValue, placeholder, clear, rows, count,
      editable, disabled, error, className, labelNumber, autoHeight } = this.props;

    let valueProps;
    if (value !== undefined) {
      valueProps = {
        value: fixControlledValue(value),
      };
    } else {
      valueProps = {
        defaultValue,
      };
    }

    const { focus } = this.state;
    const wrapCls = classNames({
      [`${prefixListCls}-item`]: true,
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-item-single-line`]: rows === 1 && !autoHeight,
      [`${prefixCls}-error`]: error,
      [`${prefixCls}-focus`]: focus,
      [className as string]: className,
    });

    const labelCls = classNames({
      [`${prefixCls}-label`]: true,
      [`${prefixCls}-label-2`]: labelNumber === 2,
      [`${prefixCls}-label-3`]: labelNumber === 3,
      [`${prefixCls}-label-4`]: labelNumber === 4,
      [`${prefixCls}-label-5`]: labelNumber === 5,
      [`${prefixCls}-label-6`]: labelNumber === 6,
      [`${prefixCls}-label-7`]: labelNumber === 7,
    });

    return (
      <div {...getDataAttr(this.props)} className={wrapCls} style={style}>
        {title ? (<div className={labelCls}>{title}</div>) : null}
        <div className={`${prefixCls}-control`}>
          <textarea
            {...valueProps}
            ref="textarea"
            name={name}
            rows={rows}
            placeholder={placeholder}
            maxLength={count}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            readOnly={!editable}
            disabled={disabled}
          />
        </div>
        {clear && editable && value && value.length > 0 ?
          (<div className={`${prefixCls}-clear`} onClick={this.clearInput} onTouchStart={this.clearInput} />)
          : null}
        {error ? (<div className={`${prefixCls}-error-extra`} onClick={this.onErrorClick} />) : null}
        {count > 0 && rows > 1
          ? (<span className={`${prefixCls}-count`}><span>{value && value.length}</span>/{count}</span>)
          : null}
      </div>
    );
  }
}
