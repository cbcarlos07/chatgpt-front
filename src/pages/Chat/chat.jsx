import '../../App.css';
import '../../style/reset.css';
import { useEffect, useState} from 'react';

import {api, setAuthToken} from '../../services/http'
import SideMenu from './SideMenu/Sidemenu'
import ChatMessage from './ChatMessage/ChatMessage'

const Chat = () => {

  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message:"Como posso te ajudar hoje?"
  }])
  const [retorno, setRetorno] = useState({})
  

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const response = await api.post('/api/prompt',{prompt: input, id: localStorage.getItem('id')})
    setRetorno(response.data)
    const res = response.data.data.split('\n')
    .map(line => <p>{line}</p>);
    
    setChatLog([...chatLog, {
      user: localStorage.getItem('name'), 
      message: `${input}`
    },{
      user: 'gpt', 
      message: res
    }])
    setInput("")
  }

  useEffect(()=>{
    setAuthToken()
  },[])
  const sendEmail = e => {
    const data = {
        user: localStorage.getItem('id'),
        id: e.id
    }
    api.patch('/mail',data)
       .then(res => {
        console.log(res.data);
       })
  }
  return (
    <div className='App'>

      <SideMenu></SideMenu>

      <section className='chatbox'>

          <div className='chat-log'>
            {chatLog.map((message, index)=>(
              <ChatMessage 
                key={index} 
                message={message} 
                index={index} 
                response={retorno}
                sendEmail={sendEmail}/>
            ))}
          </div>

          <div className='chat-input-holder'>
            <form onSubmit={handleSubmit}>
              <input
                rows='1'
                className='chat-input-textarea'
                value={input}
                onChange={e =>setInput(e.target.value)}
              >
              </input>
            </form>
          </div>
      </section>

    </div>
  );
}

export default Chat;
