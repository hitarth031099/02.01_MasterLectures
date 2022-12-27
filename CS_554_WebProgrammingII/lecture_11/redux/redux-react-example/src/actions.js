const addTodo = (task, taskDesc) => ({
  type: 'CREATE_TODO',
  payload: {
    task: task,
    taskDesc: taskDesc
  }
});

const deleteTodo = (id) => ({
  type: 'DELETE_TODO',
  payload: {id: id}
});

const completeTodo = (id) => ({
  type: 'COMPLETE_TODO',
  payload: {id: id}
});

const uncompleteTodo = (id) => ({
  type: 'UNCOMPLETE_TODO',
  payload: {id: id}
});

const addUser = (name, email) => ({
  type: 'CREATE_USER',
  payload: {
    name: name,
    email: email
  }
});

const deleteUser = (id) => ({
  type: 'DELETE_USER',
  payload: {id: id}
});

module.exports = {
  addTodo,
  deleteTodo,
  completeTodo,
  uncompleteTodo,
  addUser,
  deleteUser
};
