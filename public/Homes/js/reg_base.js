/**
 * Last Update:2015-10-30
 */

var errorInfo = {};

function autoHide(obj) {
	var attr = obj.attr("tiptimer");
	if (!attr) {
		attr = "tiptimer" + new Date().getTime();
		obj.attr("tiptimer", attr);
	}
	
	if (errorInfo[attr]) {
		window.clearTimeout(errorInfo[attr]);
	}
	
	errorInfo[attr] = window.setTimeout(function(){
		errorInfo[attr] = null;
		obj.html("");
	},5000);
}

$.extend(ec.form.validator.defaults ,{
	errorClass : "cas_error",
	autoFocus : false,
	errorFunction:function(obj , options){
		var css = "cas_error",
			msg = options.msg[options.type] || options.msg["default"];
		switch(options.type){
			case "require":
				css = "cas_warn";
				break;
		}
		
		showError($(options.msg_ct), msg);
		if(options.autoFocus)obj.focus();
	
		window.setTimeout(function(){
				$(options.msg_ct).html("");
	
		},5000);
	},
	successFunction:function(obj , options){
	}
});
