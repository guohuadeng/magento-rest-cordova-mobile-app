// 手机验证码生成
	//生成随机数验证码
		rnd.today=new Date();
		rnd.seed=rnd.today.getTime();
		function rnd() {
		　　　　rnd.seed = (rnd.seed*9301+49297) % 233280;
		　　　　return rnd.seed/(233280.0);
		};
		function rand(number) {
		　　　　return Math.ceil(rnd()*number);
		};
		// end central randomizer. -->
		
		var wait=30;  
		var rnum=8888;
		function time(o) {  
				if (wait == 0 ) {  
					o.removeAttribute("disabled");            
					o.value="Get A Free Validation Code";
					wait = 30;  				       
				}else{   
					if(wait == 30){
						//此处加ajax发短信，http://sendsms?mobile num=11212&content=aaa+'rynm'
						rnum = rand(8999)+1000;
					    // sendsms(smsurl,rnum);
					}
					wait--;  
					setTimeout(function() {  
						time(o)  
					},  1000)  
					o.setAttribute("disabled", true);
					//调试期，直接显示验证码 
					o.value="["+rnum+"]Wait ...(" + wait + "s)"; 
				}  
			}  
			
		document.getElementById("btnValidation").onclick=function(){time(this);}  
		document.getElementById("btnSubmit").onclick=function(){checkcode();} 

	       //发送短信请求
//		var smsurl = defines.baseSite + '/sendsms.php';
		var smsurl = '/sendsms.php';
		function sendsms(smsurl,smscode){ 
		   new Ajax.Request(smsurl, {
			method: 'GET',
			crossSite: true,
			parameters: 'mobile='+document.getElementById('default_mobile_number').value+'&content=您好，您的短信验证码是：'+smscode+'【美联软通】',
                        contentType: 'application/x-www-form-urlencoded',
			onSuccess: function(text) {  
			    // yourtext = text.responseText.evalJSON(true);  
			    //process something  
			},  
			onFailure: function() {  
			    return false;  
			},  
			onException: function() {  
			    return false;  
			}  
		    });  
		  
		    return true;
		} 

		//验证码检测
		function checkcode(){
		   var smscode = document.getElementById('Validation_Code').value;
		   if(rnum !=smscode){
			document.getElementById('Validation_Code').value="Wrong Code";
		   }
		}
