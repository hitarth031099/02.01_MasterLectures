import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function Counter(props) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    props.liftState(counter);
  }, [props, counter]);

  const incCounter = () => {
    setCounter(counter + 5);
  };

  const decCounter = () => {
    setCounter(counter - 5);
  };
  return (
    <div className='Counter'>
      Foo passed as prop from Counter Container: {props.foo}
      <br />
      Counter Component Count State: {counter}
      <br />
      <button onClick={incCounter}>+5</button>
      <br />
      <button onClick={decCounter}>-5</button>
    </div>
  );
}

export default Counter;
