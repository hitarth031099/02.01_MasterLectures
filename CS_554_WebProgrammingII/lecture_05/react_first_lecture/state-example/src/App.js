import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Clock from './Clock';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  updateCounter = (counter) => {
    this.setState({counter: counter});
  };

  render() {
    return (
      <div>
        <p>App Counter: {this.state.counter}</p>
        <Clock date={new Date()} updateApp={this.updateCounter} />
      </div>
    );
  }
}

export default App;
