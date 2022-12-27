import {useSelector, useDispatch} from 'react-redux';
import actions from '../actions';

const All = () => {
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);

  return (
    <div className='todos-wrapper'>
      <h2>All State</h2>
      <h3>Todos</h3>
      <ul>
        {allState.todos.map((todo) => {
          return <li key={todo.id}>{todo.task}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          dispatch(
            actions.addTodo(
              'Task Added from ALL component',
              'How now brown cow?'
            )
          )
        }
      >
        Add Task
      </button>

      <hr />
      <h3>Users</h3>
      <ul>
        {allState.users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          dispatch(actions.addUser('Mickey Mouse', 'MMouse@disney.com'))
        }
      >
        Add User
      </button>
    </div>
  );
};

export default All;
