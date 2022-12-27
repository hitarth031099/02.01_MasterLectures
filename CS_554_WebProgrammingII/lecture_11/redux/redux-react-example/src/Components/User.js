import {useDispatch} from 'react-redux';
import actions from '../actions';

function User(props) {
  const dispatch = useDispatch();

  const deleteUser = () => {
    dispatch(actions.deleteUser(props.user.id));
  };

  return (
    <div className='todo-wrapper'>
      <table>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{props.user.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{props.user.email}</td>
          </tr>

          <tr>
            <td>
              <button onClick={deleteUser}>Delete User</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default User;
