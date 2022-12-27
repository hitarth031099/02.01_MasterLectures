import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import CounterContainer from './CounterContainer';

function App() {
  const [counter, setCouter] = useState(0);
  let foo = 'bar';
  const setCounterState = (count) => {
    console.log('in App setCounterState', count);

    setCouter(count);
  };
  return (
    <div className='App'>
      Foo: {foo}
      <br />
      App Component Count State: {counter}
      <br />
      <CounterContainer liftState={setCounterState} foo={foo} />
    </div>
  );
}

export default App;
