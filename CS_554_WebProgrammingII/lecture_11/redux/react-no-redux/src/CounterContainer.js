import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './Counter';

function CounterContainer(props) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    props.liftState(counter);
  }, [props, counter]);

  const liftState = (counter) => {
    console.log('in counter lift state', counter);
    setCounter(counter);
    props.liftState(counter);
  };

  return (
    <div className='CounterContainer'>
      Foo passed as prop from App: {props.foo}
      <br />
      Counter Container Count State: {counter}
      <Counter liftState={liftState} foo={props.foo} />
    </div>
  );
}

export default CounterContainer;
