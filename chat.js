var div = document.createElement('div');
//设置div的属性
div.innerHTML = 'dgsdgs';
var bo = document.body;//获取body对象.
//动态插入到body中
bo.insertBefore(div,bo.lastChild);