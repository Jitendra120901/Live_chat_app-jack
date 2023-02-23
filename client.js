
       let socket = io();
    let msgcontainer=document.getElementById('chatbox1');
  
  const append = (message, poisition)=>{

       let messageElment = document.createElement("div");
       messageElment.innerText=message;
      // messageElment.classList.add("message");
       messageElment.classList.add(position);
       msgcontainer.appendChild(messageElment);
       
  };

  
   let useName = prompt('Enter your name pls');
    socket.emit('new_user-joined', useName);
   socket.on('user-joined1', (data) => {

       append(`${data}  join the group`, "center");
       
   })


