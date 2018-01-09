ol.define("jquery", [ {
	mark : "jquery",
	uri : "base/jquery-1.8.2.min.js",
	type : "js"
} ]);

ol.define("jquery.form", [ "jquery", {
	mark : "jquery.form",
	uri : "base/jquery.form-2.49.js",
	type : "js",
	charset : "utf-8",
	depend : true
} ]);

ol.define("ajax", [ "jquery", "jquery.form", {
	mark : "ajax",
	uri : "base/ajax.js",
	type : "js",
	charset : "utf-8",
	depend : true
} ]);
ol.define("ec.box", [ "jquery", 
{
	uri : "ec.box/box-min.js",
	type : "js",
	charset : "utf-8",
	depend : true
} ]);

if (jQuery) {
	ol._setLoadStatus("jquery", "complete");
}
