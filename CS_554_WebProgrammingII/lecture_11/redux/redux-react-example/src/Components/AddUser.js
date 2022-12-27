import {useState} from 'react';
import {useDispatch} from 'react-redux';
import actions from '../actions';

function AddUser() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({task: '', taskDesc: ''});

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };
  const addUser = () => {
    dispatch(actions.addUser(formData.name, formData.email));
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
  };
  console.log(formData);
  return (
    <div className='add'>
      <div className='input-selection'>
        <label>
          Name:
          <input
            onChange={(e) => handleChange(e)}
            id='name'
            name='name'
            placeholder='Name...'
          />
        </label>
        <label>
          Email:
          <input
            type='email'
            onChange={(e) => handleChange(e)}
            id='email'
            name='email'
            placeholder='Email Address...'
          />
        </label>
      </div>
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default AddUser;
