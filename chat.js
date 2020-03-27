var div = document.createElement('div');
//设置div的属性
div.innerHTML = '<script type="text/javascript" src="http://129.204.198.154/static/chatadmin/js/jquery-3.3.1.min.js"></script><link href="http://129.204.198.154/chat.css" rel="stylesheet" type="text/css"><a id="soword_status"></a><div id="chat"><a title ="隐藏聊天" id="soword_close">X</a><div class="main"><div class="m-message"><ul id="sowordsaylist"><li><p class="time"><span style="position: absolute;z-index: 999999999;left: 0;top: 0;background-color: #40a7f2;" id="adminname"></span></p><div class="main"></div></li></ul></div><div class="m-text"><textarea id="soword_textarea" placeholder="按 Enter 发送"></textarea></div></div></div>';
var bo = document.body;//获取body对象.
//动态插入到body中
bo.insertBefore(div,bo.lastChild);