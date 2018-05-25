import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Slider extends Component {
  static displayName = 'Slider';

  static defaultProps = {
    childCount: null,
    loop: false,
    selected: 0,
    showArrows: true,
    showNav: true,
  };

  static propTypes = {
    childCount: PropTypes.number,
    loop: PropTypes.bool,
    selected: PropTypes.number,
    showArrows: PropTypes.bool,
    showNav: PropTypes.bool
  };

  state = {
    dragStart: 0,
    dragStartTime: new Date(),
    index: 0,
    lastIndex: 0,
    transition: false,
  };

  componentWillMount() {
    const { selected } = this.props;

    this.setState({
      index: selected,
      lastIndex: selected,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selected } = this.props;

    if (selected !== nextProps.selected) {
      this.goToSlide(nextProps.selected);
    }
  }

  getDragX(event, isTouch) {
    return isTouch ?
      event.touches[ 0 ].pageX :
      event.pageX;
  }

  handleDragStart = (event, isTouch) => {
    const x = this.getDragX(event, isTouch);

    this.setState({
      dragStart: x,
      dragStartTime: new Date(),
      transition: false,
      slideWidth: ReactDOM.findDOMNode(this.slider).offsetWidth,
    });
  };

  handleDragMove = (event, isTouch) => {
    const {
      dragStart,
      lastIndex,
      slideWidth,
    } = this.state;

    const x = this.getDragX(event, isTouch);
    const offset = dragStart - x;
    const percentageOffset = offset / slideWidth;
    const newIndex = lastIndex + percentageOffset;
    const SCROLL_OFFSET_TO_STOP_SCROLL = 30;

    // Stop scrolling if you slide more than 30 pixels
    if (Math.abs(offset) > SCROLL_OFFSET_TO_STOP_SCROLL) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.setState({
      index: newIndex,
    });
  };

  handleDragEnd = () => {
    const {
      childCount,
      children,
    } = this.props;
    const {
      dragStartTime,
      index,
      lastIndex,
    } = this.state;

    const timeElapsed = new Date().getTime() - dragStartTime.getTime();
    const offset = lastIndex - index;
    const velocity = Math.round(offset / timeElapsed * 10000);

    let newIndex = Math.round(index);

    if (Math.abs(velocity) > 5) {
      newIndex = velocity < 0 ? lastIndex + 1 : lastIndex - 1;
    }

    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= (childCount || children.length)) {
      newIndex = (childCount || children.length) - 1;
    }

    this.setState({
      dragStart: 0,
      index: newIndex,
      lastIndex: newIndex,
      transition: true,
    });
  };

  goToSlide = (index, event) => {
    const {
      childCount,
      children,
      loop,
    } = this.props;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (index < 0) {
      index = loop ? (childCount || children.length) - 1 : 0;
    } else if (index >= (childCount || children.length)) {
      index = loop ? 0 : (childCount || children.length) - 1;
    }

    this.setState({
      index,
      lastIndex: index,
      transition: true,
    });
  };

  renderNav = () => {
    const { children, childCount } = this.props;
    const { lastIndex } = this.state;

    const nav = [];
    for (let i = 0; i < (childCount || children.length); i++) {
      const buttonClasses = i === lastIndex ? 'Slider-navButton Slider-navButton--active' : 'Slider-navButton';
      nav.push(
        <button
          className={buttonClasses}
          key={`slider-navigation--${i}`}
          onClick={event => this.goToSlide(i, event)} />
      );
    }

    return (
      <div className='Slider-nav'>{nav}</div>
    );
  };

  renderArrows = () => {
    const {
      children,
      loop,
      showNav,
      childCount
    } = this.props;
    const { lastIndex } = this.state;
    const arrowsClasses = showNav ? 'Slider-arrows' : 'Slider-arrows Slider-arrows--noNav';

    return (
      <div className={arrowsClasses}>
        {loop || lastIndex > 0 ?
          <button
            className='Slider-arrow Slider-arrow--left'
            onClick={event => this.goToSlide(lastIndex - 1, event)} /> : null}
        {loop || lastIndex < (childCount || children.length) - 1 ?
          <button
            className='Slider-arrow Slider-arrow--right'
            onClick={event => this.goToSlide(lastIndex + 1, event)} /> : null}
      </div>
    );
  };

  render() {
    const {
      children,
      showArrows,
      showNav,
      childCount
    } = this.props;

    const {
      index,
      transition,
    } = this.state;


    const slidesStyles = {
      width: `${ 100 * (childCount || children.length) }%`,
      transform: `translateX(${ -1 * index * (100 / (childCount || children.length)) }%)`,
    };
    const slidesClasses = transition ? 'Slider-slides Slider-slides--transition' : 'Slider-slides';

    return (
      <div className='Slider' ref={slider => {
        this.slider = slider;
      }}>
        {showArrows ? this.renderArrows() : null}
        {showNav ? this.renderNav() : null}

        <div
          className='Slider-inner'
          onTouchStart={event => this.handleDragStart(event, true)}
          onTouchMove={event => this.handleDragMove(event, true)}
          onTouchEnd={() => this.handleDragEnd(true)}>
          <div
            className={slidesClasses}
            style={slidesStyles}>
            {typeof children === 'function' ? children(this.goToSlide) : children}
          </div>
        </div>
      </div>
    );
  }
}
