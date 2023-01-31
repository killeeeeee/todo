import { useState, useEffect } from 'react';

import './Tasks.css';
import Todo from './Todo';
import TodoForm from './TodoForm';

import initialTasks from './InitialTasks';

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("all");

  const TODO_BASE_URL = 'http://localhost:3000/todos';

  const fetchData = async () => {
    const response = await fetch(TODO_BASE_URL)
    const data = await response.json()
    setTasks((tasks) => data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  function addTodo(task) {
    const postBody = JSON.stringify({
      title: task,
      completed: false,
    })

    fetch(TODO_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: postBody
    }).then(
      response => response.json()
    ).then((result) => {
      setTasks(tasks => [
        ...tasks,
        {
          id: result.id,
          title: result.title,
          completed: result.completed,
        }
      ])
    })
  }

  function deleteTodo(taskId) {
    fetch(TODO_BASE_URL + '/' + taskId, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then(() =>
      setTasks((tasks) => tasks.filter((task) => task.id !== taskId))
    )
  }

  function setTodoCompleted(todo) {
    const putBody = JSON.stringify({
      completed: !todo.completed
    })

    fetch(TODO_BASE_URL + '/' + todo.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: putBody
    }).then(() => {
      setTasks((tasks) => {
        return tasks.map((task) => {
          if (task.id === todo.id) {
            return {
              ...task, ...{
                completed: !todo.completed
              }
            }
          }

          return task;
        })
      })
    })
  }

  const onFilterChanged = (e) => {
    // console.log(e.target.value);
    setFilter(e.target.value);
  }

  return (
    <>
      <div className="Tasks">
        <h1>
          <a href="https://www.dictionary.com/browse/task" target="_blank">TASK</a></h1>
          style: 
        show: <select name="filter" id="filter-select" onChange={onFilterChanged}>

          <option value="all">all</option>
          <option value="complete">complete</option>
          <option value="incomplete">incomplete</option>
        </select> {filter}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.filter(todo => {
              if (filter === 'all') {
                return true;
              }
              if (filter=== 'complete' && todo.completed) {
                return true;
              }
              if (filter === 'incomplete' && todo.completed === false) {
                return true;
              }
              return false;
            }).map((todo) => {
              return <Todo key={todo.id} todo={todo} deleteTodo={deleteTodo} setTodoCompleted={setTodoCompleted} />
            })}
          </tbody>
        </table>
      </div>
      <table>
        <tbody>
        <tr>
            <th>Am I done yet </th>
            <th>Am I done yet </th>
        </tr>
        <tr>
            <td> Not Yet</td>
            <td> Not Yet</td>
        </tr>
        <tr>
            <td> Not Yet</td>
            <td> Not Yet</td>
        </tr>
        <tr>
            <td> Not Yet</td>
            <td> Not Yet</td>
        </tr>
        </tbody>
      </table>

      <div>
        <TodoForm addTodo={addTodo} />
      </div>
    </>
  );
}

export default Tasks;