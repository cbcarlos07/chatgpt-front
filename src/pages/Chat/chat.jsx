import '../../App.css';
import '../../style/reset.css';
import * as Scroll from 'react-scroll';
import { useEffect, useState, useRef} from 'react';

import {api, setAuthToken} from '../../services/http'
import SideMenu from './SideMenu/Sidemenu'
import ChatMessage from './ChatMessage/ChatMessage'

const Chat = () => {
  const scroll    = Scroll.animateScroll;
  const messagesEndRef = useRef(null)
  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message:"Como posso te ajudar hoje?"
  }])
  const [res, setRes] = useState()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [res]);

  const [retorno, setRetorno] = useState({})
  

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const response = await api.post('/api/prompt',{prompt: input, id: localStorage.getItem('id')})
    setRetorno(response.data)
    const res = response.data.data.split('\n')
                        .map(line => <p>{line}</p>);
    setRes(res)
    setInput("")
    setChatLog([...chatLog, {
      user: localStorage.getItem('name'), 
      message: `${input}`
    },{
      user: 'gpt', 
      message: res
    }])
    
    

  }

  useEffect(()=>{
    setAuthToken()
  },[])

  const onEnterPress = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      handleSubmit(e)
    }
  }
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

      <div className='chat-wrapper'>
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

            <div ref={messagesEndRef} />


            
        </section>

        <section className='chatbox-2'>      
          <div className='chat-input-holder'>
              <form onSubmit={handleSubmit}>
                <textarea
                  rows='1'
                  className='chat-input-textarea'
                  value={input}
                  onChange={e =>setInput(e.target.value)}
                  onKeyDown={onEnterPress}
                  >
                    <button class="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                </textarea>
              </form>
            </div>
      
        </section>

      </div>
      
      

    </div>
  );
}

export default Chat;
