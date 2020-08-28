import React from "react";
import BaseComponent from "../utils/BaseComponent";
import loader from '../assets/img/loader.gif';

class FullScreenLoader extends BaseComponent {
  render() {
    return (
      <div className="loader-wrapper">
        <div className="loader" style={{height: '4em', width: '4em', top: '50%', left: '50%'}}>
          <img alt="Loading" src={loader} style={{height: 'auto'}}/>
        </div>
      </div>
    )
  }
}

export default FullScreenLoader;