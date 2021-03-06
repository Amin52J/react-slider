import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Slider from '../src';

const ExampleSlider1 = props => (
  <div className='ExampleSliders'>
    <h4>Slider with default options</h4>
    <Slider>
      <div style={{ background: '#21BB9A' }}>A</div>
      <div style={{ background: '#329ADD' }}>B</div>
      <div style={{ background: '#9A5CB9' }}>C</div>
      <div style={{ background: '#E64C3C' }}>D</div>
      <div style={{ background: '#2D3F52' }}>E</div>
    </Slider>
  </div>
);

const ExampleSlider2 = props => (
  <div className='ExampleSliders'>
    <h4>Slider with custom options</h4>
    <pre>
        autoplay: true<br />
        autoplaySpeed: 7000<br />
        loop: true<br />
        selected: 2<br />
        showArrows: true<br />
        showNav: true<br />
        </pre>
    <Slider
      autoplay
      autoplaySpeed={5000}
      loop
      showNav
      showArrows
      selected={2}>
        <div style={{ background: '#21BB9A' }}>A</div>
        <div style={{ background: '#329ADD' }}>B</div>
        <div style={{ background: '#9A5CB9' }}>C</div>
        <div style={{ background: '#E64C3C' }}>D</div>
        <div style={{ background: '#2D3F52' }}>E</div>
    </Slider>
  </div>
);

ReactDOM.render(
  React.createElement(ExampleSlider1, null),
  document.getElementById('slider1')
);

ReactDOM.render(
  React.createElement(ExampleSlider2, null),
  document.getElementById('slider2')
);