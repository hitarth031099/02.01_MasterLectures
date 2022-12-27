import Todo from './Todo';
import AddTodo from './AddTodo';
import {useState} from 'react';
import {useSelector} from 'react-redux';
function Todos() {
  const [addBtnToggle, setBtnToggle] = useState(false);
  const allTodos = useSelector((state) => state.todos);
  console.log('allToDos', allTodos);
  return (
    <div className='todo-wrapper'>
      <h2>My Todos</h2>
      <button onClick={() => setBtnToggle(!addBtnToggle)}>Add A Todo</button>
      <br />
      <br />
      <br />
      {addBtnToggle && <AddTodo />}
      <br />
      {allTodos.map((todo) => {
        console.log(todo);
        return <Todo key={todo.id} todo={todo} />;
      })}
    </div>
  );
}

export default Todos;
