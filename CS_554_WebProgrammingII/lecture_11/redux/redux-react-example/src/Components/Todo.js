import {useDispatch} from 'react-redux';
import actions from '../actions';

function Todo(props) {
  const dispatch = useDispatch();

  const deleteTodo = () => {
    dispatch(actions.deleteTodo(props.todo.id));
  };

  const completeTodoToggle = (compFlag) => {
    if (compFlag === 'comp') dispatch(actions.completeTodo(props.todo.id));
    if (compFlag === 'uncomp') dispatch(actions.uncompleteTodo(props.todo.id));
  };

  return (
    <div className='todo-wrapper'>
      <table>
        <tbody>
          <tr>
            <td>Todo:</td>
            <td>{props.todo.task}</td>
          </tr>
          <tr>
            <td>Todo Description:</td>
            <td>{props.todo.taskDesc}</td>
          </tr>
          <tr>
            <td>Completed:</td>
            <td>{`${props.todo.completed}`}</td>
          </tr>
          <tr>
            <td>
              <button onClick={deleteTodo}>Delete Todo</button>
            </td>
            <td>
              {!props.todo.completed && (
                <button onClick={() => completeTodoToggle('comp')}>
                  Complete
                </button>
              )}
              {props.todo.completed && (
                <button onClick={() => completeTodoToggle('uncomp')}>
                  UnComplete
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Todo;
