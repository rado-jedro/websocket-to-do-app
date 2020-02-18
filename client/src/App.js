import React from 'react';
import io from 'socket.io-client';
import uuidv1 from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: {
        name:'',
        id:''
      }
      
    };

    this.submitForm = this.submitForm.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');

    this.socket.on('addTask', newTask => {
      this.addTask(newTask);
    });
    this.socket.on('removeTask', (index, task) => {
      this.removeTask(index, task);
    });
    this.socket.on('updateData', tasks => {
      this.updateData(tasks);
    });
  }

  updateData(tasks) {
    this.setState({ tasks: tasks });
  }

  submitForm(event) {
    const { taskName } = this.state;
    event.preventDefault();
    this.addTask(taskName);
    this.socket.emit('addTask', taskName);
  }

  addTask(newTask) {
    const { tasks } = this.state;
    newTask.id = uuidv1();
    if (!tasks.find(task => task.id === newTask.id)) {
      tasks.push(newTask);
      this.setState({ tasks });
    }
  }

  removeTask(e, task) {
    const { tasks } = this.state;
    const index = tasks.indexOf(task);

    if (tasks.find(taskToRemove => taskToRemove.id === task.id)) {
      this.setState(tasks.splice(index, 1));
      this.socket.emit('removeTask', index, task);
    }
  }

  changeValue(event) {
    this.setState({
      taskName: {
        name: event.target.value
      }
    });
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map(task => (
              <li key={task.name} className='task'>
                {task.name}
                {''}
                <button
                  onClick={e => this.removeTask(e, task)}
                  className='btn btn--red'
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id='add-task-form' onSubmit={this.submitForm}>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              value={taskName.name}
              onChange={this.changeValue}
            />
            <button className='btn' type='submit'>
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
