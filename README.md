cpuload
==========
一个简单的跨终端的页面性能分析折线图工具,能给出当前页面性能的参考值，以及当前页面FPS的参考值

##原理分析##
* 利用setInterval函数的延迟时间间隔来判断CPU的繁忙程度
* 同样如果想获取浏览器渲染FPS，是否可以利用requestAnimationFrame（介绍文档）函数来实现？（不知道chrome的这个如何监控页面的FPS是否是通过这个函数来实现的？）
* requestAnimationFrame：这个函数在浏览器需要更新页面显示时调用，也就是发生在浏览器的（刷新界面）的时候

##如何使用##
* 在body标签内引入cpuload.js脚本
* 对于不支持canvas的IE系列浏览器请设置flashcavnas

##作者##
* 蜗眼（iceet[at]uoeye.com ）
