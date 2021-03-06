import React from "react";
import io from "socket.io-client";
import axios from 'axios';

const Server = "http://192.168.1.5:4000/";

class Chat extends React.Component{

  // IMPORT USERNAME VALUE AND MODIFY VISUALLY
    constructor(props){
        super(props);

        this.state = {
            username: this.props.user,
            message: '',
            messages: []
        };

        console.log(this.props.user);
        this.socket = io('localhost:4000');

        this.socket.on('RECEIVE_MESSAGE', function(data){

            addMessage(data);
            var serverLocation = Server + 'chat/';
            // axios.get(serverLocation)
            //   .then(res => {
            //     this.setState({ messages: res.data });
            //   })
            //   .catch(function (error){
            //     console.log(error);
            //   });
        });

        const addMessage = data => {
            // console.log(data);
            // this.setState({messages: [...this.state.messages, data]});
            var serverLocation = Server + 'chat/';
            axios.get(serverLocation)
              .then(res => {
                this.setState({ messages: res.data });
              })
              .catch(function (error){
                console.log(error);
              });

          }
            // console.log(this.state.messages);

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: this.state.message
            })
            var newChat = {
              author: this.state.username,
              message: this.state.message
            };
            var serverLocation = "http://192.168.1.5:4000/chat";
              axios.post(serverLocation, newChat)
                .then(
                  axios.get(serverLocation)
                    .then(res => {
                      this.setState({ messages: res.data });
                    })
                    .catch(function (error){
                      console.log(error);
                    })
                  )

            this.setState({message: ''});
        }
    }

    componentDidMount() {
      var serverLocation = Server + 'chat/';
      axios.get(serverLocation)
        .then(res => {
          this.setState({ messages: res.data });
        })
        .catch(function (error){
          console.log(error);
        });
    }

    render(){
      return (
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body">
                    <div className="card-title">Global Chat</div>
                    <hr/>
                    <div className="messages">
                      {this.state.messages.map(message => {
                        return (
                          <div>{message.author}: {message.message}</div>
                          )
                      })}
                    </div>

                    </div>
                    <div className="card-footer">

                    <br/>
                    <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                                <br/>
                                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
