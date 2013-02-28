(function(S){
	//作者：重启 <iceet@uoeye.com>
	var CPUload = function(){};
	CPUload.prototype = {
		init: function(){
			var self = this;
				self.region = [50];
				self.canvas = document.createElement('canvas');
			//这里不建议用with！
			with (self.canvas.style){
				position ='fixed';
				width = '250px';
			    height = '90px';
			    top = '10px';
			    right = '10px';
			    borderRadius="5px";
			    background ='#000';
			    zIndex=1e10;
				opacity = 0.9;
			}
			self.canvas.width = 250;
			self.canvas.height =90;
			document.body
				.insertBefore(self.canvas,document.body.firstChild)
			
			//不支持canvas 的时候用 flashcanvas支持
			if (window.ActiveXObject&&!window.CanvasRenderingContext2D){
				//这里需要修改下内部地址
				return self.getScript('flashcanvas/flashcanvas.js',function(){
					self.run();
				});
			}
			return self.run();
		},
		getScript: function(src,callback){
			var script = document.createElement('script');
			script.onload =script.onreadystatechange  = function(){
				if(this.readyState == 'loaded' || this.readyState == 'complete' || this.readyState==undefined){
					setTimeout(function(){
						callback && callback();
					},0);
				}
			};
			script.src=src;
			document.body.insertBefore(script,document.body.firstChild);
		},
		//启动
		run: function(){
			var self = this;
				self.stime = +new Date;
				self.context = self.canvas.getContext('2d');
			setInterval(function(){
				var etime = +new Date,
					region = etime - self.stime;
				if (self.region.length>=125){
					self.region.shift();
				}
				self.region.push(region);
				self.stime = etime;
			},50);
			self.draw();
			//初始化fps
			self.fps = [];
			self.ofps = '60'
			self.fpstime = self.stime;
			self.runfps();
		},
		runfps: function(){
			var self = this;
			self.animationFrame.call(window,function(){
				var etime =+new Date,
					fps = (1000 / (etime - self.fpstime));
				
				self.fps.push(fps);
				if (self.fps.length>30){
					self.ofps = self.getfps(Array.prototype.concat.call(self.fps));
					self.fps = [];
				}
				self.runfps();
				self.fpstime = etime;
			});
		},
		getfps: function(fps){
			var total=0,
				item,idx=0;
			if (fps.length==0){
				return this.ofps || 60;
			}
			while(item=fps[idx++]){
				total+=item;
				
			}
			return this.ofps =(total/fps.length).toFixed(1)+'('+(Math.min.apply(0,fps)^0)+'-'+(Math.max.apply(0,fps)^0)+')';
		},
		animationFrame: function(){
			return window.requestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.msRequestAnimationFrame
				|| window.oRequestAnimationFrame
				|| function(callback) {
				setTimeout(callback, 1000 / 60);
			}
		}(),
		draw: function(){
			var self = this;
			setTimeout(function(){
				self.drawLineChart();
				self.draw();
			},200);
		},
		getTopByHigh: function(high){
			high = Math.min(300,high);
			return 100-parseInt(high*(95/300),10);
		},
		//画折线图
		//80-50  
		drawLineChart: function(){
			var self = this,
				item ,idx=0;
			if ( self.region.length ) {
				var shift = self.region[0],
					bx = self.region.length * 2 +2,
					by = self.getTopByHigh(shift);
				
				self.context.clearRect(0,0,250,100);
				self.context.fillStyle="rgba(255,255,255,0.6)";
				self.context.font="18px Aria";
				
				self.context.fillText('CPU:'+(0^(Math.max(
					self.region[self.region.length-1]||0,
					self.region[self.region.length-2]||0,
					self.region[self.region.length-3]||0,
					self.region[self.region.length-4]||0
				)-50)/3 )+'%',10,23);
				
				if (self.ofps){
					self.context.fillText('FPS:'+self.ofps,100,23);
				}
				while(item = self.region[idx++]){
					var lg = self.context.createLinearGradient(0,0, 0, 100); 
						lg.addColorStop(0, '#ff0000');      
						lg.addColorStop(1, '#0000ff'); 
						
					self.context.beginPath();
					self.context.moveTo(bx,by);
					self.context.strokeStyle=lg//"rgb(255,255,255)";
					self.context.lineTo(bx-=2,by=self.getTopByHigh(item));
					self.context.stroke();
					self.context.closePath();
				}
			}
		}
	};
	(new CPUload()).init();
})();
