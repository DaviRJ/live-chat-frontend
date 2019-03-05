import React, { Component } from 'react';
import {config} from './configs/config';
import io from 'socket.io-client';
import EVENTS from './configs/events'

class App extends Component {

  constructor(props){
    super(props);
    
    this.socket = null;
    
    this.state = {
      messages: [],
      user_name: '',
      new_message:''
    }
  }

  componentDidMount(){
    this.socket = io.connect(config.server_url);
    
    this.socket.on('error', (err) => {
      console.log('An error has occur. Please, reaload the page...')
    });

    this.socket.on(EVENTS.EVENT_MESSAGE, (data) => {
      const message_recived = {
        user: data.user,
        message: data.message
      }
      
      this.setState({
        messages: [...this.state.messages, message_recived]
      })
    });
  }

  sendChatMessage = () => {
    const object_to_send = {
      user: this.state.user_name,
      message: this.state.new_message
    }
    
    this.socket.emit(EVENTS.EVENT_MESSAGE, object_to_send);
    
    this.setState({
      new_message: ""
    })
  }

  renderMessages = () => {
    return this.state.messages.map(
      (message, idx) => <li key={idx}>{message.message} <small>{message.user}</small> </li>
    )
  }

  handleUserName = (event) => {
    const user_name = event.target.value || 'Anonimous'

    this.setState({
      user_name
    })
  }

  handleNewMessage = (event) => {
    const new_message = event.target.value || 'Hi'

    this.setState({
      new_message
    })
  }

  render() {
    const messages_to_display = this.renderMessages();

    return (
      <div className="App">
        <div>
          <label htmlFor="username">User name: </label> <br />
          <input name="username" id="username" type="text" value={this.state.user_name} onChange={this.handleUserName}/>
        </div>

        <div>
          <ul>
            {messages_to_display}
          </ul>
        </div>
        
        <textarea onChange={this.handleNewMessage} value={this.state.new_message}>
        </textarea>

        <br/>
        <button onClick={this.sendChatMessage}>Send message</button>
      </div>
    );
  }
}

export default App;
