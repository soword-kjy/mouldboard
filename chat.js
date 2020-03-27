var div = document.createElement('div');
//设置div的属性
div.innerHTML = '<script type="text/javascript" src="http://129.204.198.154/static/chatadmin/js/jquery-3.3.1.min.js"></script><link href="http://129.204.198.154/chat.css" rel="stylesheet" type="text/css"><a id="soword_status"></a><div id="chat"><a title ="隐藏聊天" id="soword_close">X</a><div class="main"><div class="m-message"><ul id="sowordsaylist"><li><p class="time"><span style="position: absolute;z-index: 999999999;left: 0;top: 0;background-color: #40a7f2;" id="adminname"></span></p><div class="main"></div></li></ul></div><div class="m-text"><textarea id="soword_textarea" placeholder="按 Enter 发送"></textarea></div></div></div>';
var bo = document.body;//获取body对象.
//动态插入到body中
bo.insertBefore(div,bo.lastChild);
//判断商家
getadminstatus();
//WebSocketMain
if (typeof console == "undefined") { this.console = { log: function (msg) {  } };}
    // 如果浏览器不支持websocket，会使用这个flash自动模拟websocket协议，此过程对开发者透明
    WEB_SOCKET_SWF_LOCATION = "http://129.204.198.154/static/chatadmin/swf/WebSocketMain.swf";
    // 开启flash的websocket debug
    WEB_SOCKET_DEBUG = true;
    var ws, name, client_list={};

    // 连接服务端
     
       // 创建websocket
       ws = new WebSocket("ws://129.204.198.154:7272");
       // 当socket连接打开时，输入用户名
       ws.onopen = onopen;
       // 当有消息时根据消息类型显示不同信息
       ws.onmessage = onmessage; 
       ws.onclose = function() {
    	  console.log("连接关闭，定时重连");
        onopen();
       };
       ws.onerror = function() {
     	  console.log("出现错误");
       };
      
      

    // 连接建立时发送登录信息
    function onopen()
    {     
    	   var url = window.location.host;
         console.log("websocket握手成功，发送登录数据:");
         ws.send('{"type":"login","belong_ip":"'+url+'"}');
    }

    // 服务端发来消息时
    function onmessage(e)
    {
      
       var data = JSON.parse(e.data);
       //console.log(data);
        switch(data['type']){
           // 服务端ping客户端
            case 'ping':
                ws.send('{"type":"pong"}');
                break;
            case 'say':
                 flush_say_self(data['time'],data['content']);
                 console.log(data);
                break;
            case 'loginlast':
                  console.log(data);
                  admin_soword_status_block();
                  userform();
                  break;
            case 'send_to_group':
                  
                  //userform_block();
                  //admin_soword_status_none();
                  document.getElementById("soword_status").innerHTML="在线客服";
                  document.getElementById("soword_status").setAttribute("title","在线客服");
                  document.getElementById("adminname").innerHTML=""+data['name']+"客服 在线";
                  //console.log(data);
                  break;
            case 'soword_admin_close':

                  admin_soword_status_block();
                  document.getElementById("soword_status").innerHTML="离线留言";
                  document.getElementById("soword_status").setAttribute("title","离线留言");
                  document.getElementById("adminname").innerHTML=""+data['name']+"客服 离线";
                  //console.log(data);
                  break;
            case 'infoadminname':

                  var status=data['status'];
                  statusinfo='在线';
                  if(status==1){
                    statusinfo='离线';
                  }
                  document.getElementById("adminname").innerHTML=""+data['name']+"客服 "+statusinfo;
                  document.getElementById("adminname").setAttribute("soword_adminid",data['id']);
                  //document.getElementById("adminname").setAttribute("soword_client_id",data['client_id']);
                  getuserinformation(data['id']);
                
                  break;
        }

        
    }


function getuserinformation($adminid){
    var userurl = window.location.host;
    document.getElementById("adminname").setAttribute("soword_adminid",$adminid);
    $.ajax({
                type: 'GET',
                url: "http://129.204.198.154/index/Getuserinformation?adminid="+$adminid+"&userurl="+userurl,
                dataType: 'json',
                success: function(data){
                  //console.log(data.message);
                   for(var i=0;i<data.message.length;i++){
                                 //console.log(data.message[i].content);
                                 if(data.message[i].beto==0)
                                  {
                                   
                                    flush_say_list(data.message[i].time,data.message[i].content);
                                    //console.log(data.message[i].content);
                                  }
                                   else
                                  {
                                    flush_say_self(data.message[i].time,data.message[i].content);
                                    //console.log(data.message[i].content);
                                  }
            
                              }

                }
               });
}

function getadminstatus(){
    var userurl = window.location.host;

    $.ajax({
                type: 'GET',
                url: "http://129.204.198.154/index/getadminstatus?userurl="+userurl,
                dataType: 'json',
                success: function(data){

                   if(data.admin_status==1){
                    userform();
                    admin_soword_status_block();
                    document.getElementById("soword_status").innerHTML="离线留言";
                    document.getElementById("soword_status").setAttribute("title","离线留言");
                   }else{
                    if(data.chatopen==1){
                      userform();
                      admin_soword_status_block();
                    }
                    document.getElementById("soword_status").innerHTML="在线客服";
                    document.getElementById("soword_status").setAttribute("title","在线客服");
                   }
                }
               });
}

function flush_say_self($time,$content){
           $("#sowordsaylist").append('<li><p class="time"><span>'+$time+'</span></p><div class="main"><span style="padding-right: 10px; color: #40a7f2;">客服中心</span><div style="float: inherit;" class="text">'+$content+'</div></div></li>');
           $('.m-message').scrollTop( $('.m-message')[0].scrollHeight);
            
      }

function flush_say_list($time,$content){
           $("#sowordsaylist").append('<li><p class="time"><span>'+$time+'</span></p><div class="main self"><span style="padding-left: 10px; float: right;">朕</span><div class="text">'+$content+'</div></div></li>');
           $('.m-message').scrollTop( $('.m-message')[0].scrollHeight);
            
      }

function userform() {
      var userform = document.getElementById("chat");
      userform.style.display='none';
      
    }

function userform_block() {
      var userform = document.getElementById("chat");
      userform.style.display='block';
     $('.m-message').scrollTop( $('.m-message')[0].scrollHeight);
      
    }

function admin_soword_status_block() {
      var userform = document.getElementById("soword_status");
      userform.style.display='block';   
    }

  function admin_soword_status_none() {
      var userform = document.getElementById("soword_status");
      //var isoword_chitchat = document.getElementById("soword_chitchat");
      userform.style.display='none';
     // isoword_chitchat.style.display='block';
     $('.m-message').scrollTop( $('.m-message')[0].scrollHeight);
      
    }


function onSubmit($adminid) {
      
      var input = document.getElementById("soword_textarea");
      //console.log($adminid);
      if(input.value==''){
          return false;
      }

      var date = new Date();
      $time=date.getFullYear()+'-'+date.getMonth()+1+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(); 
  
      $("#sowordsaylist").append('<li><p class="time"><span>'+$time+'</span></p><div class="main self"><span style="padding-left: 10px; float: right;">朕</span><div class="text">'+input.value+'</div></div></li>');

      $('.m-message').scrollTop( $('.m-message')[0].scrollHeight);
       
      ws.send('{"type":"say","belong_ip":"'+$adminid+'","content":"'+input.value+'"}');

      input.value='';
    }

document.onkeydown = function(e){ 
var ev = document.all ? window.event : e;
   if(ev.keyCode==13){
        var adminid=document.getElementById("adminname").attributes["soword_adminid"].nodeValue;
         onSubmit(adminid); 
         return false;
         
   }
}

$("#soword_close").mouseover(function(){
  $(this).css({"background":"#40a7f2","color":"aliceblue"});
}); 
$("#soword_close").mouseout(function(){
  $(this).css({"background":"","color":"#8e8d8d"});
}); 

//关闭聊天
$("#soword_close").click(function(){
  //ws.send('{"type":"soword_close"}');
  admin_soword_status_block();
  $("#chat").slideToggle();
});

//打开聊天
$("#soword_status").click(function(){

  admin_soword_status_none();
  $("#chat").slideDown();
  //onopen();
});