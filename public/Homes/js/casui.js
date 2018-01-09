;
(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(["jquery"], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function($) {
	function substitute(str, o, regexp) {
		return str.replace(regexp || /\\?\{([^{}]+)\}/g, function(match, name) {
			var names = name.split('.');
			var res = o;
			for (var i = 0; i < names.length; i++) {
				res = (typeof(res) == "object") ? res[names[i]] : null;
			};
			return (res === undefined) ? '' : res;
		});
	}

	var Dialog = function(options) {
		var _this = this;
		var defaultOptions = {
			title: "Dialog",
			titleUnderline: false,
			btnLeft: {
				text: "btnLeft",
				fn: null
			},
			btnRight: {
				text: "btnRight",
				fn: null
			},
			html: "Dialog content...",
			beforeAction: function() {},
			beforeAppendTo: function() {},// 窗口对象在加载到HTML文档前
			dialogStyle: "dialog", // 窗口样式，取值为“dialog”（默认）、“tab”；当取值为tab时，窗口全屏
			overlayClass: "global_black_overlay",// 背景层的样式
			actions: {}
		};

		var singleLineTpl = '<div>{html}</div>';
		var contentTpl = '<h3><div class="ellipsis" style="line-height: 18px;" title="{html}">{html}</div></h3>';
		var btns = '';
		if (options.btnLeft && options.btnRight) {
			options.btnLeft.text=toUperCaseStr(options.btnLeft.text);
			options.btnRight.text=toUperCaseStr(options.btnRight.text);
			btns =  '    <div class="global_dialog_confirm_ft">' +
					'        <div class="dialog-left-btn-wrap l"><div title="{btnLeft.text}" class="global_dialog_confirm_nor" role="cancel"><span>{btnLeft.text}</span></div></div>' +
					'        <div class="dialog-right-btn-wrap r"><div title="{btnRight.text}" class="global_dialog_confirm_nor" role="confirm"><span>{btnRight.text}</span><div class="errortip"></div></div></div>' +
					'    </div>';
		}
		else if (!options.btnLeft && options.btnRight)
		{
			
			options.btnRight.text=toUperCaseStr(options.btnRight.text);
		    btns =  '    <div class="global_dialog_confirm_ft">' +                 
                    '       <div title="{btnRight.text}" class="global_dialog_confirm_nor dialog-middle-btn-wrap" role="confirm"><span>{btnRight.text}</span><div class="errortip"></div></div>'+
                    '    </div>';
		}
		
		this.options = $.extend(defaultOptions, options);
		
		
		var dialogTpl = "";
		if ('tab' == this.options.dialogStyle)
		{
			dialogTpl = '<div class="global_dialog_confirm_main_fullScreen" style="display: block;">' +
				'    <div class="global_dialog_confirm_title">' +
				'        <h3 class="ellipsis" title="{title}">{title}</h3>' +
				'    </div>' +
				'    <div class="global_dialog_confirm_content">{content}</div>' +
				btns +
				'</div>' +
				'<div class="' + this.options.overlayClass + '"></div>';			
		}
		else
		{
			var dialogStyle = 'display: block;';
			if (this.options.width)
			{
				dialogStyle = dialogStyle + 'width:' + this.options.width + ';';
			}
			
			if (this.options.height)
			{
				dialogStyle = dialogStyle + 'height:' + this.options.height + ';';
			}
			
			if (this.options.top)
			{
				dialogStyle = dialogStyle + 'top:' + this.options.top + ';';
			}
			
			if (this.options.left)
			{
				dialogStyle = dialogStyle + 'left:' + this.options.left + ';';
			}
			
			dialogTpl = '<div class="global_dialog_confirm_main" style="' + dialogStyle + '">' +
				'    <div class="global_dialog_confirm_title">' +
				'        <h3 class="ellipsis" title="{title}">{title}</h3>' +
				'    </div>' +
				'    <div class="global_dialog_confirm_content">{content}</div>' +
				btns +
				'</div>' +
				'<div class="' + this.options.overlayClass + '"></div>';		
		}

		// html
		if (/<.*?>/.test(options.html)) {
			this.options.content = substitute(singleLineTpl, this.options);
		} else { // text
			this.options.content = substitute(contentTpl, this.options);
		}

		this.dialogHtml = substitute(dialogTpl, this.options);

		this.$dialogWrap = null;

		this.init = function() {
			this.$dialogWrap = $(this.dialogHtml);
			this.$mask = this.$dialogWrap.last();
			this.$dialog = this.$dialogWrap.first();
			this.$dialog.append('<div class="dialog-cancel" role="cancel2"></div>');


			if (this.options.titleUnderline) {
				this.$dialog.find('.global_dialog_confirm_title h3').css({
					'text-decoration': 'underline'
				});
			}
			 
			this.$dialog.find("[title]").each(function(){
				var title = $(this).attr("title");
				if(/^\<.*?\>.*?\<.*?\>$/.test(title))
					$(this).attr("title",$(title).text());
			})
			this.$dialog.on('click', '[role=confirm]', function(e) {
				e.stopPropagation();
				if ($(this).attr("disabled")) {
					return;
				}
				var rfn = _this.options.btnRight.fn;
				if (typeof(rfn) == "function") {
					rfn.call(_this);
				}
			}).on('click', '[role=cancel]', function() {
				var lfn = _this.options.btnLeft.fn;
				if (typeof(lfn) == "function") {
					lfn.call(_this);
				}
				_this.$dialog.trigger('close');
			}).on('click', '[act]', function(e) {
				e.stopPropagation();
				var fn = _this.options.actions[$(this).attr('act')];
				if (typeof(fn) == "function") {
					fn.call(_this);
				}
			}).on('click', '[role=cancel2]', function() {
				//x按钮关闭时调用
				var lfn;
				if(_this.options.btnLeft)
				{	
				lfn = _this.options.btnLeft.fn;
				}
				if (typeof(lfn) == "function") {
					lfn.call(_this);
				}
				_this.$dialog.trigger('close');
			}).on('close', function() {
				_this.hide();
			});

			this.$mask.on('selectstart', function() {
				return false;
			}).on('mousedown', function() {
				return false;
			});
			
			
		};

		this.show = function() {
			this.init();
			
			if (typeof(this.options.beforeAppendTo) == "function") {
				this.options.beforeAppendTo.call(this);
			}
			
			this.$dialogWrap.appendTo('body');
			if (typeof(this.options.beforeAction) == "function") {
				this.options.beforeAction.call(this);
			}

			this.$dialogWrap.fadeIn(function() {
				if ('tab' != _this.options.dialogStyle)
				{
					_this.$dialog.css({
						"margin-top": -(_this.$dialog.outerHeight()) / 2
					});
				}
				if($.browser.msie&&$.browser.version*1<=9)
				{
					$("#passwdEye").remove();
				}	
			});
			
			
		};

		this.hide = function() {
			if (this.$dialogWrap && this.$dialogWrap.length > 0) {
				this.$dialogWrap.fadeOut(function() {
					_this.$dialogWrap.remove();
				});
			}
			clearTimeout(authCodeCountTimes);
		};
		
		this.enable = function() {
			//上一句 手机上不兼容改为如下
			_this.$dialog.find("[role=confirm]").removeAttr("disabled");
			_this.$dialog.find("[role=confirm]").removeClass("globle_dialog_btn_disabled");
			_this.$dialog.find("[role=confirm]").css({"cursor": "pointer"});
		};
		this.disabled = function() {
			_this.$dialog.find("[role=confirm]").attr("disabled", true);
			_this.$dialog.find("[role=confirm]").addClass("globle_dialog_btn_disabled");
			_this.$dialog.find("[role=confirm]").css({"cursor": "auto"});
		};

		return this;
	};



	$.fn.Dialog = function(params) {
		var el = this[0];
		
		if (!el) {
			return;
		}
		
		if (typeof(params) == "string") {
			switch (true) {
				case params == "show":
					el.dialog.show();
					break;
				case params == "hide":
					el.dialog.hide();
					break;
				case params == "enable":
					el.dialog.enable();
					break;
				case params == "disabled":
					el.dialog.disabled();
					break;
				default:
					alert("error param");
					break;
			}
		} else if (typeof(params) == "object") {
			el.dialog = new Dialog(params);
			$(el).on('click', function() {
				if ($(this).attr("disabled")) {
					return;
				}
				this.dialog.show();
			});
		} else {
			alert("error param");
		}
		return this;
	};


	// 只有一个大按钮，和一段文字的dialog   
	var DialogSimple = function(options) {
		var _this = this;
		var defaultOptions = {
			text:"",
			btnText:"",
			btnFn:function(){
				
				this.hide();
			},
			btnLeftText:null,
			dialogStyle:"dialog"// 窗口样式，取值为“dialog”（默认）、“tab”；当取值为tab时，窗口全屏
		};
        var dialogHTml = "<div class='global_dialog_confirm_main'>";
		var $dialog;
		this.options = $.extend(defaultOptions, options);
		if ('tab' == this.options.dialogStyle)
		{
			dialogHTml = "<div class='global_dialog_confirm_main_fullScreen'>";
		}
		this.init = function() {
			this.options.btnLeftText=toUperCaseStr(this.options.btnLeftText);
			this.options.btnText=toUperCaseStr(this.options.btnText);
			var html = dialogHTml+"<div class='textArea center'>"+this.options.text+"</div>" + 
					"<div class='btn-area' style='width:42%;margin:auto'><a class='btn-EMUI5-2' id='rightBtn' href='javascript:void(0)'>"+this.options.btnText+"</a></div></div>";
			if(this.options.btnLeftText)
			{
				html =dialogHTml+"<div class='textArea'>"+this.options.text+"</div>" +
					"<div class='btn-area clearfloat'>"+
					"<a class='btn-EMUI5-2 l ' style='width:42%' id='leftBtn' href='javascript:void(0)'>"+this.options.btnLeftText+"</a>"+
					"<a class='btn-EMUI5-2 r'  style='width:42%' id='rightBtn' href='javascript:void(0)'>"+this.options.btnText+"</a>"+
					"</div></div>";
			}	
				
			html+="<div class='global_black_overlay'></div>"
			$dialog = $(html);
			$("body").append($dialog);
			
			addCssActive($(".btn-EMUI5-2"),"btn-EMUI5-2-active");
			
			$("#rightBtn",$dialog).click(function(){
				
				_this.options.btnFn.call(_this);
			})
            $("#leftBtn",$dialog).click(function(){
				
				_this.hide();
			})   
			   
		}

		this.show = function() {
				this.init();
		        return this;
	};
	this.hide = function(){
		$dialog.remove();
		
	}
	
	return this;
	}

	$.fn.DialogSimple = function(params) {
 
		DialogSimple.call(this,params);
		return this;
		
	}
	
	

	var DropList = function(options, obj) {
		var _this = this;
		var defaultOptions = {
			items: [{
				value: 0,
				label: "defaultValue",
				other:""
			}],
			defaultValue: null,
			onChange: function() {}
		};

		this.selectHtml = '<input type="hidden">' +
			'<b class="dptick r"></b>' +
			'<span class="ar-eg"></span>' +
			'<ul class="dpmenu" style="display: none;z-index:1000;"></ul>';

		this.options = $.extend(defaultOptions, options);

		this.init = function() {
			this.$obj = $(obj).addClass('ddrop').append(this.selectHtml);

			var $ul = this.$obj.find('.dpmenu');
			/*特殊处理 ，在弹框中的下拉列表，弹框的overflow 必须为:visible*/
			$ul.parents(".global_dialog_confirm_main, .global_dialog_alert_main").css("overflow","visible");
			
			var defaultObj = null;
			for (var i = 0; i < this.options.items.length; i++) {
				
				// 如果为json字符串的话，就要采用相应的处理手段了
				$ul.append("<li  data-other='" +this.options.items[i].other + "'  data-value='" +this.options.items[i].value + "'>" + subStr(this.options.items[i].label) + "</li>");
			
				if (!this.options.defaultValue && this.options.defaultValue !== 0 && i == 0) {
					defaultObj = this.options.items[i];
				} else if (this.options.defaultValue === this.options.items[i].value) {
					defaultObj = this.options.items[i];
				}
			};
			
			if (!defaultObj) {
				defaultObj = this.options.items[0];
			}

			this.$obj.find('span').text(subStr(defaultObj.label));
			this.$obj.find('input').val(defaultObj.value);

			this.$obj.on("click", function() {
				var open = $(this).data("open");
				if (!open) {
					$(this).children('.dpmenu').attr("tabindex", 0).fadeIn(300).focus();
					$(this).data("open", true);
				}
			}).on("click", ".dpmenu > li", function() {
				var $p = $(this).closest('.ddrop');
				
				if(typeof($(this).data("value"))=="object")
				{
					// 如果为object类型，那么认定其为json格式
					$p.children('input').val(JSON.stringify($(this).data("value")));
				}
				else
				{
					$p.children('input').val($(this).data("value"));
				}
				$p.children('span').text($(this).text());
				$(this).parent().fadeOut(300, function() {
					$p.data("open", false);
				});
				if (typeof(_this.options.onChange) == "function") {
					_this.options.onChange.call(_this, $(this).data("value"), $(this).text(),$(this).data("other"));
				}
			}).on("blur", ".dpmenu", function() {
				$(this).fadeOut(300, function() {
					$(this).parent().data("open", false);
				});
			});
		};

		this.selectValue = function(value) {
			var selectObj = null;
			for (var i = 0; i < this.options.items.length; i++) {
				if (value === this.options.items[i].value) {
					selectObj = this.options.items[i];
				}
			};
			this.$obj.find('span').text(selectObj.label);
			this.$obj.find('input').val(selectObj.value);
		};

		return this;
	};

	$.fn.DropList = function(params) {
		var el = this[0];
		if (typeof(params) == "string") {
			switch (true) {
				case params == "select":
					el.droplist.selectValue(arguments[1]);
					break;
				default:
					alert("error param");
					break;
			}
		} else if (typeof(params) == "object") {
			el.droplist = new DropList(params, el);
			el.droplist.init();
		} else {
			alert("error param");
		}
		return this;
	};
	
	
	var DropListEMUI5 = function(options, obj) {
		var _this = this;
		var defaultOptions = {
			items: [{
				value: 0,
				label: "defaultValue",
				other:""
			}],
			defaultValue: null,
			onChange: function() {},
			showDefaultValue:true,
			suffix:"",
			selShowSuffix:true,
			selectSpace:true,
			style:"auto",//"auto" 自适应大小 "full" 占满输入框
			parent:"",
			dir:"down"
		};

		

		this.options = $.extend(defaultOptions, options);
		this.selectHtml = '<input type="hidden">' +
		'<span class="select-text ar-eg"></span><span class="suffix" style="color:#999" >' +this.options.suffix+
		'</span><div class="select-ico"></div><ul class="dpmenu-EMU5" style="display:none;"></ul>';
		this.init = function() {
			this.$obj = $(obj).addClass('ddrop-EMU5').html(this.selectHtml);
            var options = this.options; 
            var self =this;
			var $ul = this.$obj.find('.dpmenu-EMU5');
			this.$ul=$ul;
			var overflowStyle=this.$obj.css("overflow");
			if(this.options.dir=="up")
			{
			 $ul.addClass("dpmenu-EMUI5-up");	
			}
			else
			{
			 $ul.addClass("dpmenu-EMUI5-down");	
			}
			var defaultObj = null;
			
			var length = this.options.items.length;
			$ul.append('<div class="flow-top"></div>');
			
			var maxWidth=getMaxWidth(this.options.items);
            if(this.options.style=="full")
            {
            	this.options.parent.css("position","relative");
            	this.$obj.css("position","static");
            	maxWidth=this.options.parent.width()-32;
            	$ul.width(maxWidth+32);
            	$ul.css("min-width",(maxWidth+32));
            	$ul.css("max-width",(maxWidth+32));
            	$ul.css("left","0");
            	$ul.css("right","0");
            	var top=this.options.parent.height()+this.options.parent.css("padding-top").split("px")[0]*1+8;
            	$ul.css("top",top+"px");
            }
            if(length>6)
			{
				$ul.css("overflow-y","scroll");
				$ul.css("min-width",($ul.width()+20)+"px");
				$ul.css("max-width",($ul.css("max-width").split("px")[0]*1+20)+"px");

				
			}
			$ul.width(maxWidth+32);
			for (var i = 0; i < length; i++) {
				
			
				if(i!=length-1)
				{	
				$ul.append("<li  data-other='"+this.options.items[i].other+"'   data-value='" +this.options.items[i].value + "'>" + this.options.items[i].label + "</li><div class='uc-line' style='width:"+maxWidth+"px'><div></div></div>");
				}
				else
				{
				$ul.append("<li  data-other='"+this.options.items[i].other+"'  data-value='" +this.options.items[i].value + "'>" + this.options.items[i].label + "</li>");
				}	
				if (!this.options.defaultValue && this.options.defaultValue !== 0 && i == 0) {
					defaultObj = this.options.items[i];
				} else if (this.options.defaultValue == this.options.items[i].value) {
					defaultObj = this.options.items[i];
				}
			};
			
			if (!defaultObj) {
				defaultObj = this.options.items[0];
			}
			if(length==1&&!options.defaultText)
			{
			    defaultObj = this.options.items[0];
			    this.$obj.find('.select-ico').addClass("select-ico-gray");
			}
            if(!this.options.showDefaultValue)
            {
            if(this.options.selectSpace)	
			{
            	this.$obj.find('.select-text').text(defaultObj?defaultObj.label:"").css("visibility","hidden");
			}
			this.$obj.find('input').val(defaultObj?defaultObj.value:"");
            }
            else
            {
            	this.$obj.find('.select-text').text(defaultObj?defaultObj.label:"");
    			this.$obj.find('input').val(defaultObj?defaultObj.value:"");
    			this.$obj.find('.suffix').css("color","#333");
            }
            
            if(options.showday&&!options.selShowSuffix&&this.$obj.find('.select-text').css("visibility")!="hidden")
			{
            	this.$obj.find('.suffix').text("");
			}
            if(options.defaultText)
            {
            	this.$obj.find('.select-text').text(options.defaultText);
    			this.$obj.find('input').val("");
            }	
            
            this.$obj.unbind();
            var isBlur=false;
			this.$obj.on("click", function() {
				if(isBlur)
				{
				  isBlur=false;
				  return;
				}	
				if((length==1&&!options.defaultText)||$(this).hasClass("ddrop-disabled"))
					return;
				var open = $(this).data("open");
				if (!open) {
					self.$obj.css("overflow","visible");
					$(this).children('.dpmenu-EMU5').attr("tabindex", 0).show().focus();
					$(this).data("open", true);
					
					if(self.options.style=="full")
					{
						var top=self.options.parent.height()+self.options.parent.css("padding-top").split("px")[0]*1+8;
		            	$ul.css("top",top+"px");
					}	
					
				}
				else
				{
					
					self.$obj.css("overflow",overflowStyle);
				}	
			}).on("click", ".dpmenu-EMU5 > li", function(e) {
				e.stopPropagation();
				self.$obj.css("overflow",overflowStyle);
				var $p = $(this).closest('.ddrop-EMU5');
				
				if(typeof($(this).data("value"))=="object")
				{
					// 如果为object类型，那么认定其为json格式
					$p.children('input').val(JSON.stringify($(this).data("value")));
				}
				else
				{
					$p.children('input').val($(this).data("value"));
				}
				$p.children('.select-text').text($(this).text()).css("visibility","visible");
				if(!options.selShowSuffix)
				{
					$p.children('.suffix').text("");
				}
				$(this).parent().hide();
			    $p.data("open", false);
				
				if (typeof(_this.options.onChange) == "function") {
					_this.options.onChange.call(_this, $(this).data("value"), $(this).text(),$(this).data("other"));
				}
				$p.children('.suffix').css("color","#333");
			}).on("blur", ".dpmenu-EMU5", function() {
				    isBlur=true;
				    $(this).hide();
					$(this).parent().data("open", false);
					self.$obj.css("overflow",overflowStyle);
			
			});
			this.$obj.find(".dpmenu-EMU5")[0].onmousewheel=function(event)
			{
				if (!event) event = window.event; 
				this.scrollTop = this.scrollTop - (event.wheelDelta ? event.wheelDelta : -event.detail * 10); 
				return false; 
			}
			$(document).bind("click",function(){
				isBlur=false;
			})
			addItemActive($(".dpmenu-EMU5 > li",this.$obj),"li-active");
		
		};

		this.selectValue = function(value) {
			var selectObj = null;
			for (var i = 0; i < this.options.items.length; i++) {
				if (value == this.options.items[i].value) {
					selectObj = this.options.items[i];
				}
			};
			this.$obj.find('.select-text').text(selectObj.label).css("visibility","visible");
			this.$obj.find('.suffix').css("color","#333");
			this.$obj.find('input').val(selectObj.value);
		};

		function getMaxWidth(items)
		{
			var max=104;
			var html;
			var width;
			for(var i=0;i<items.length;i++)
			{
				html='<span id="contLength" style="visibility:hidden;font-size:15px;">'+items[i].label+'</span>';
			$("body").append(html);
			 //offsetWidth会四舍五入，且考虑IE8兼容问题，故+1
			 width = $("#contLength")[0].offsetWidth + 1;
			 if(width>max)
				 max = width;
			 
			 $("#contLength").remove();
			}
			return max;
			
		}
		
		
		return this;
		
		
		
		
	};

	$.fn.DropListEMUI5 = function(params) {
		var el = this[0];
		if (!el)
		{
			return;
		}
		if (typeof(params) == "string") {
			switch (true) {
				case params == "select":
					el.droplistEMUI5.selectValue(arguments[1]);
					break;
				default:
					alert("error param");
					break;
			}
		} else if (typeof(params) == "object") {
			el.droplistEMUI5 = new DropListEMUI5(params, el);
			el.droplistEMUI5.init();
		} else {
			alert("error param");
		}
		return this;
	};
	
	
	
	var datePickEMUI5 = function(option,el)
	{
		 //年
		 var dayDiv;
		 var monthDiv;
		 var yearDiv;
		 var dayInput;
		 var yearInput;
		 var monthInput;
		 var defaultOption={
				 yearChange:function(){},
				 monthChange:function(){},
				 dayChange:function(){},
				 format:"Y-M-D",
				 yearSuffix:"",
				 monthSuffix:"",
				 daySuffix:"",
				 itemSuffix:false,
				 yearSpace:true,
				 monthSpace:true,
				 daySpace:true,
				 dir:"down"
		 }
		 this.init = function()
		 {
			 option = $.extend(defaultOption,option);
			 var html="<div> <input class='year' type='hidden'  /><input class='month' type='hidden' /> <input class='day' type='hidden'> <div class='yearDiv dateItems'></div> <div class='monthDiv dateItems'></div> <div class='dayDiv dateItems'> </div></div>"
			 var obj = el;
			 obj.html(html);
			 dayDiv =$(".dayDiv",obj);
			 monthDiv = $(".monthDiv",obj);
			 yearDiv = $(".yearDiv",obj);
			 dayInput = $(".day",obj);
			 yearInput = $(".year",obj);
		     monthInput = $(".month",obj);
			 dayInput.val("N");
			 yearInput.val("N");
			 monthInput.val("N");
			 var yearItems = getYearItems();
			 var monthItems = getMonthItems();
			 var dayItems= getDayItems(2016,1);
			 var selShowSuffix = true;
             if(localInfo.lang!="zh-cn" && localInfo.lang!="zh-hk" && localInfo.lang!="zh-tw")
		     {
			   selShowSuffix = false;
			 }
			 
			 if(option.format.indexOf("Y")!=-1)
				 {
			 yearDiv.DropListEMUI5({
					items: yearItems,
					defaultValue:'N',
					showDefaultValue:false,
					suffix:option.yearSuffix,
					selShowSuffix:selShowSuffix,
					selectSpace:option.yearSpace,
					onChange: function(key, value) {
					yearInput.val(key);
					showDay(selShowSuffix);
					option.yearChange();
					
					},
					dir:option.dir
			    });  
				 }
			  if(option.format.indexOf("M")!=-1)
		      {		  
			  monthDiv.DropListEMUI5({
					items:monthItems,
					defaultValue:'N',
					showDefaultValue:false,
					suffix:option.monthSuffix,
					selShowSuffix:selShowSuffix,
					selectSpace:option.monthSpace,
					onChange: function(key, value) {
						monthInput.val(key);
						showDay(selShowSuffix);
						option.monthChange();
					},
					dir:option.dir
			    });
		      }
			 if(option.format.indexOf("D")!=-1)
			{
			   dayDiv.DropListEMUI5({
					items: dayItems,
					defaultValue:'N',
					showDefaultValue:false,
					suffix:option.daySuffix,
					selShowSuffix:selShowSuffix,
					selectSpace:option.daySpace,
					onChange: function(key, value) {
						dayInput.val(key);
						option.dayChange();
						
					},
					dir:option.dir
			    });
			}
		 }
		 
		 this.getValue= function(type)
		 {
			 if(type=="Y")
			 {
			   return yearInput.val()*1;	 
			 }
			 else if(type=="M")
			 {
				 return monthInput.val()*1;
			 }	 
			 else if(type=="D")
			 {
				 return dayInput.val()*1;
			 }	 
				 
		 }
		 this.setDate = function(y,m,d)
		 {
			 y=y||1900;
			 m=m||1;
			 d=d||1;
			 yearDiv.DropListEMUI5("select",y);
			 monthDiv.DropListEMUI5("select",m);
			 dayDiv.DropListEMUI5("select",d);
			 dayInput.val(d);
			 yearInput.val(y);
			 monthInput.val(m);
		 }

		 function getYearItems()
		 {
			 var year = new Date().getFullYear();
			 var items=[];
			 for(var i=year;i>=1900;i--)
			 {
			   if(option.itemSuffix)
			   {
				   year={
						   value:i,
						   label:i+option.yearSuffix
				   }
			   }
			   else
				   {
				    year={
				    		value:i,
				    		label:i+""
				    }
				   }
			   items.push(year);
			   
			 }
			return items;
			 
		 }
		 
		 function getMonthItems()
		 {
			 var items=[];
			 var month={};
			 for(var i=1;i<=12;i++)
			 {
			  if(option.itemSuffix)
			  {
			   month={
					   value:i,
					   label:i+option.monthSuffix
			   }
			  }
			  else
			  {
				 month={
						 value:i,
						 label:i+""
				 }  
			  }
			  items.push(month);
			 }
			 
			 return items;
		 }
		 function getDayItems(year,month)
		 {   
			 var days=[30,31,28,31,30,31,30,31,31,30,31,30,31];
			 if(month==2&&year%400==0||(year%4==0&&year%100!=0))
			 {
				 days[2]=29;
			 }
			 var items=[];
			 var day={};
			 for(var i=1;i<=days[month];i++)
			 {
				 if(option.itemSuffix)
				 {
				 day={
						 value:i,
						 label:i+option.daySuffix
				 }
				 }
				 else
				 {
				  day={
						  value:i,
						  label:i+""
				  }	 
				 }
				 items.push(day);
			 }
			 
			 return items;
			 
		 }
		 
		 
		function showDay(selShowSuffix)
		{
			if(option.format.indexOf("D")==-1)
				return;
				
			var year = yearInput.val()*1;
			var month = monthInput.val()*1;
			var day = dayInput.val();
			
				var dayItems=getDayItems(year,month);
				
				var showDefault = false;
				if(day!="N")
				{
				 showDefault = true;
				 if(day*1>dayItems.length)
				 {
				   day=1;	 
				 }
				}
				if(!isNaN(year)&&!isNaN(month))
				{
				dayDiv.DropListEMUI5({
					items: dayItems,
					defaultValue:day,
					suffix:option.daySuffix,
					showDefaultValue:showDefault,
					selShowSuffix:selShowSuffix,
					showday:true,
					onChange: function(key, value) {
						dayInput.val(key);
						option.dayChange();
					},
					dir:option.dir
			    });
				}
			
			
		}
			  
			  	
	}
	
	$.fn.datePickEMUI5 = function(params)
	{
		var el = this[0];
		if (!el)
		{
			return;
		}
		if(typeof params=="object")
		{
		 el.datePickEMUI5 = new datePickEMUI5(params,$(el));
		 el.datePickEMUI5.init();
		}
		else if(typeof params =="string")
		{
		 return el.datePickEMUI5.getValue(params);
		}
		else if(typeof params=="number")
		{
			el.datePickEMUI5.setDate.apply(el.datePickEMUI5,arguments);
		}
			
		
		
	}
	
	
	
	
	
	
	
	
	
	
	
	

	//switch 2
	$(document).on("click", ".radio", function() {
		if ($(this).data("check")) {
			return;
		}
		var group = $(this).data("group");
		checkRadio($(this), true);
		checkRadio($("[data-group='" + group + "']").not(this), false);
		$("#" + group).val($(this).data("value"));
		$("#" + group).trigger('change');
	}).on("check", ".radio", function() {
		$(this).trigger('click');
	});

	function checkRadio(obj, check) {
		if (check) {
			obj.removeClass("roff").addClass("ron");
		} else {
			obj.removeClass("ron").addClass("roff");
		}
		obj.data("check", check);
	}
	
	//帐号大于28长度的时候展示的时候就去掉一部分，为了能够正常显示到下拉列表
	function subStr(str) {
		if(str.length > 28) {
			if (str.indexOf("*") > 0)
			{
				var strPre = str.substring(0, str.indexOf("*"));
				var strPost = str.substring(str.lastIndexOf("*"), str.length);
				strPre = strPre.substring(0, 24-strPost.length);
				str = strPre +"****"+ strPost;
			}
		}
		return str;
	}
	
}));