import {useState} from 'react';
import {useSelector} from 'react-redux';
import AddUser from './AddUser';
import User from './User';
function Users() {
  const [addBtnToggle, setBtnToggle] = useState(false);
  const allUsers = useSelector((state) => state.users);
  console.log('allUsers', allUsers);
  return (
    <div className='todo-wrapper'>
      <h2>Users</h2>
      <button onClick={() => setBtnToggle(!addBtnToggle)}>Add A User</button>
      <br />
      <br />
      <br />
      {addBtnToggle && <AddUser />}
      <br />
      {allUsers.map((user) => {
        console.log(user);
        return <User key={user.id} user={user} />;
      })}
    </div>
  );
}

export default Users;
