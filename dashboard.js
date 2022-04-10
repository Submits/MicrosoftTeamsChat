var faunadb = window.faunadb
  var q = faunadb.query
  var client = new faunadb.Client({
    secret: 'SECRET',
    domain: 'db.eu.fauna.com',
    scheme: 'https',
  })


function getInfo(){

    let urlParams = new URLSearchParams(window.location.search);

    if(urlParams.get("user") == null)
    {
        document.getElementById("textInput").style.visibility = "hidden"
    }
    else{

        client.query(
            q.Get(
              q.Match(q.Index('user_by_name'), localStorage.getItem("teamsUsername"))
            )
          )
                
          .then(function(ret) {

        

let html = ""
           
              
              document.getElementById("chatName").innerHTML = urlParams.get("user")
              document.getElementById("send").onclick=function(){sendMessage(urlParams.get("user"))};
              document.getElementById("chatImage").src = ret.data["dm_" + urlParams.get("user")].profile_image


              for (let i = 0; i < ret.data["dm_" + urlParams.get("user")].messages.length; i++) {


                if(ret.data["dm_" + urlParams.get("user")].messages[i].author == localStorage.getItem("teamsUsername"))
                {
                    html += `<div class="messageTo">
                    ` + ret.data["dm_" + urlParams.get("user")].messages[i].content + `
                    </div>`
                }
                else{
                html += ` <div class="messageFrom">
                <label class="messageFromName">` + ret.data["dm_" + urlParams.get("user")].messages[i].author + `</label>
                <label class="messageFromDate">&bull; ` + ret.data["dm_" + urlParams.get("user")].messages[i].date + `</label>
                <p>` + ret.data["dm_" + urlParams.get("user")].messages[i].content +`</p>
                </div>`
                }
  
  
                
              }

              document.getElementById("msgList").innerHTML = html
              var element = document.getElementById("right");
                element.scrollTop = element.scrollHeight;

        
        })
              .catch(function(e){
                window.location.href = "dashboard.html"
              });

            }
    
    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), localStorage.getItem("teamsUsername"))
        )
      )
            
      .then(function(ret) {
    
        let html = ""
      if(localStorage.getItem("teamsAuth") != ret.data.auth_token)
        {
            console.error(e)
        }
    
        
        const dateTimeFormat = new Intl.DateTimeFormat('en', {
          hour: 'numeric',
          minute: 'numeric'
      });
  

        let test = Object.keys(ret.data).reverse()
        console.log(test)
        for (let i = 0; i < test.length; i++) {
          
          if(test[i].substring(0, 2) == "dm")
          {
            console.log(ret.data[test[i]])

            let recentMessage = ""
            let recentMessageDate = ""
            if(ret.data[test[i]].messages.length == 0)
            {
                recentMessage = "No messages yet."
                recentMessageDate = ""
            }
            else{
                recentMessage = ret.data[test[i]].messages[ret.data[test[i]].messages.length -1].content
                recentMessageDate = dateTimeFormat.format(new Date(ret.data[test[i]].messages[ret.data[test[i]].messages.length -1].date))
            }
    
            
           
    
                html += `<div onclick="window.location.href = 'dashboard.html?user=` +  ret.data[test[i]].username + `'" class="messageDiv">
                <div class="messageImage">
                    <img class="userImage" src="` +   ret.data[test[i]].profile_image + `">
                </div>
                <div class="messageContent">
                    <label class="usernameHeader">` +  ret.data[test[i]].username + `</label><label class="messageFromDate" style="float: right;">` + recentMessageDate + `</label>
                    <p class="messageMessage">` + recentMessage + `</p>
                </div>
            </div>`
            }


        
          
        }


        document.getElementById("messages").innerHTML = html
      
    
    
    })
          .catch(function(e){
            console.error(e)
          });
    
        
}


function load(){

  var element = document.getElementById("right");
                element.scrollTop = element.scrollHeight;

  client.query(
      q.Get(
        q.Match(q.Index('user_by_name'),  localStorage.getItem("teamsUsername"))
      )
    )
          
    .then(function(ret) {
      id = ret.ref.value.id
      var docRef = q.Ref(q.Collection('users'), id)
  
  function report(e) {
      getInfo()
      console.log(e)
    var data = ('action' in e)
      ? e["document"].data
      : e.data
    
    
  }
  
  var stream
  const startStream = () => {
    stream = client.stream.document(docRef)
    .on('snapshot', snapshot => {
      report(snapshot)
    })
    .on('version', version => {
      report(version)
    })
    .on('error', error => {
      console.log('Error:', error)
      stream.close()
      setTimeout(startStream, 1000)
    })
    .start()
  }
  
  startStream()
  
  
  })
        .catch(function(e){
            console.log(e)
           document.write("Error: " + e)
        });




}


function createDirectMessage(user){


    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), localStorage.getItem("teamsUsername"))
        )
      )
            
      .then(function(ret) {
    

        client.query(
            q.Get(
              q.Match(q.Index('user_by_name'), user)
            )
          )
                
          .then(function(req) {
        

              if( ret.data["dm_" + req.data.username] != undefined ) {
                alert("You already have messages with this user!")
            }
            else{
    

            let json = '{"profile_image": "' + req.data.profile_image + '", "username":"' + req.data.username + '", "messages": []}'
        client.query(


            q.Update(q.Ref(q.Collection("users"), ret.ref.value.id), {
            data: {
              ["dm_" +  req.data.username]: JSON.parse(json),
            },
            })
            ).then(function(rec){
        
                console.log(rec)
             
        
          }).catch(function(e){
        
            alert("User doesnt exist!")
    
          });


          let json2 = '{"profile_image": "' + ret.data.profile_image + '", "username":"' + ret.data.username + '", "messages": []}'

          client.query(


            q.Update(q.Ref(q.Collection("users"), req.ref.value.id), {
            data: {
              ["dm_" +  ret.data.username]: JSON.parse(json2),
            },
            })
            ).then(function(rec){
        
                console.log(rec)
                closeModal()
  window.location.href = "dashboard.html?user=" + document.getElementById("userForDm").value
             
        
          }).catch(function(e){
        
           alert("User doesnt exist!")
    
          });

      


        }
            
        })
              .catch(function(e){
                alert("User doesnt exist!")
              });


        

    
    })
          .catch(function(e){
            console.error(e)
          });




}



function sendMessage(user){

  if(document.getElementById("messageText").value == ""){
alert("Please enter a message.")
  }
  else{
    
    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), localStorage.getItem("teamsUsername"))
        )
      )
            
      .then(function(ret) {
    
        let date = new Date()
        let messages = ret.data["dm_" + user].messages
        messages.push({date: date.toUTCString(), author: localStorage.getItem("teamsUsername"), content: document.getElementById("messageText").value})
        client.query(

          
          q.Update(q.Ref(q.Collection("users"), ret.ref.value.id), {
          data: {
            ["dm_" + user]: {
              messages: messages
            }
          },
          })
          ).then(function(rec){
      
              

            client.query(
              q.Get(
                q.Match(q.Index('user_by_name'), user)
              )
            )
                  
            .then(function(rer) {
          
              let date = new Date()
              let messages = rer.data["dm_" + localStorage.getItem("teamsUsername")].messages
              messages.push({date: date.toUTCString(), author: localStorage.getItem("teamsUsername"), content: document.getElementById("messageText").value})
              client.query(
      
                
                q.Update(q.Ref(q.Collection("users"), rer.ref.value.id), {
                data: {
                  ["dm_" + localStorage.getItem("teamsUsername")]: {
                    messages: messages
                  }
                },
                })
                ).then(function(rey){
            
                  var element = document.getElementById("right");
                element.scrollTop = element.scrollHeight;
                document.getElementById("messageText").value = ""
                 
            
              }).catch(function(z){
            
                console.log("User doesnt exist!")
        
              });
                
      
          
          })
                .catch(function(e){
                  console.error(e)
                });
      

                



           
      
        }).catch(function(e){
      
          console.log("User doesnt exist!")
  
        });
          

    
    })
          .catch(function(e){
            console.error(e)
          });
        }


}



function logOut(){

  localStorage.removeItem("teamsUsername")
     localStorage.removeItem("teamsAuth")
     window.location.href = "auth.html"


}



var modal = document.getElementById("createDmModal");



window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



function openModal(){

  document.getElementById("createDmModal").style.display = "block";


}

function closeModal(){

  document.getElementById("createDmModal").style.display = "none";
}

function createDm(){


  createDirectMessage(document.getElementById("userForDm").value)
  
}