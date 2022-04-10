var faunadb = window.faunadb
  var q = faunadb.query
  var client = new faunadb.Client({
    secret: 'SECRET',
    domain: 'db.eu.fauna.com',
    scheme: 'https',
  })

  function makeAuthToken(length) {
    var result           = '';
    var characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function makeUserId(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}



function signUp(){

    
    if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
    {
        alert("Please fill out all credentials!")
    }
    else{
    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), document.getElementById("username").value)
        )
      )
      .then(function(ret){ 
           
      alert("This name is taken!")
      
      })
        
      .catch(function(e){
      
      
      
        let date = new Date();
        var randomColor = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

          client.query(
        q.Create(
          q.Collection('users'),
          { data: { username: document.getElementById("username").value.replace(/\s/g, "-"), password: CryptoJS.MD5(document.getElementById("password").value).toString(), id: makeUserId(10), auth_token: makeAuthToken(30), profile_image: "https://dummyimage.com/500x500/" + randomColor + "/fff&text=" + document.getElementById("username").value.charAt(0)} },
        )
      )
      .then(function(ret){
      
       console.log(ret)
      localStorage.setItem("teamsUsername", ret.data.username)
     localStorage.setItem("teamsAuth", ret.data.auth_token)
     window.location.href = "dashboard.html"

          }).catch(function(e){
              alert("Something went wrong. " + e)
          })
      
      });
    }

}

function signIn(){

    if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
    {
        alert("Please fill out all credentials!")
    }
    else{

    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), document.getElementById("username").value)
        )
      )
            
      .then(function(ret) {
                            
        if(ret.data.password != CryptoJS.MD5(document.getElementById("password").value).toString())  
        {
          alert("User and password do not match!")
        }
        else{
         
            localStorage.setItem("teamsUsername", ret.data.username)
            localStorage.setItem("teamsAuth", ret.data.auth_token)
            window.location.href = "dashboard.html"

        }
      })
      .catch(function(e){
        alert("User not found.")
      });
    }

}
