import {useState} from 'react';
import {useDispatch} from 'react-redux';
import actions from '../actions';

function AddTodo() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({task: '', taskDesc: ''});

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };
  const addTodo = () => {
    dispatch(actions.addTodo(formData.task, formData.taskDesc));
    document.getElementById('task').value = '';
    document.getElementById('taskDesc').value = '';
  };
  console.log(formData);
  return (
    <div className='add'>
      <div className='input-selection'>
        <label>
          Todo:
          <input
            onChange={(e) => handleChange(e)}
            id='task'
            name='task'
            placeholder='Todo name...'
          />
        </label>
        <label>
          Todo Description:
          <input
            onChange={(e) => handleChange(e)}
            id='taskDesc'
            name='taskDesc'
            placeholder='Todo Description...'
          />
        </label>
      </div>
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
}

export default AddTodo;
