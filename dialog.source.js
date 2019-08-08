(function(e, n) {
	if (typeof module !== "undefined") {
	    module.exports = n(e);
	} else {
		n(e);
	    if (typeof define === "function" && (define.amd || define.cmd)) {
	        define("dialog",function() {
	            return n(e);
	        });
	    }
	}
})(window || this, function(win) {
	!win.CY && (win.CY = {});
	if(win.CY.ui) return win.CY.ui;
	var doc = document;
	var _emptyFun = function() {
	};
	var getCss = function(elem, attr) {
		return window.getComputedStyle(elem, null)[attr];
	};
	var _typeof = function(obj) {
		return Object.prototype.toString.call(obj).split(/\s(\w+)/)[1]
				.toLowerCase();
	};
	var addEvent = function(elem, type, callback) {
		elem.addEventListener(type, callback, false);
	};
	var extend = function(source, params) {
		for ( var key in params) {
			if (params.hasOwnProperty(key)) {
				if (_typeof(params[key]) != "object") {
					params[key] != undefined && (source[key] = params[key]);
				} else {
					source[key] = extend({}, params[key]);
				}
			}
		}
		return source;
	};
	var substitute = function(str, data) {
		if (data && _typeof(data) == 'object') {
			return str.replace(/\{([^{}]+)\}/g, function(match, key) {
				var value = data[key];
				return (value !== undefined) ? '' + value : '';
			});
		} else {
			return str.toString();
		}
	};
	var _setShow = function(elem) {
		extend(elem.style, {
			display : "block"
		});
	};
	var _setHide = function(elem) {
		extend(elem.style, {
			display : "none"
		});
	};
	var create = function(tag, attrs) {
		tag = doc.createElement(tag);
		extend(tag.style, attrs || {});
		return tag;
	};
	var mask = (function() {
		var container, isInit, _params, def = {
			clickClose : true,
			callback : _emptyFun
		};
		return {
			create : function(params) {
				var m = this, type = _typeof (params);
				if (type == "function") {
					def.callback = params;
					params = {};
				} else if (params && type != "object") {
					params = {};
				}
				_params = extend(def, params);
				if (isInit)
					return this;
				isInit = true;
				container = doc.body.appendChild(create('div', {
					position : "fixed",
					top : 0,
					right : 0,
					bottom : 0,
					left : 0,
					zIndex : 1000,
					display : "none",
					backgroundColor : "rgba(0,0,0,.3)"
				}));
				addEvent(container, "click", function() {
					_params.clickClose && m.close();
				});
				return m;
			},
			show : function(callback) {
				var m = this;
				!container && m.create();
				_setShow(container);
				callback && callback(container);
			},
			close : function(callback) {
				var m = this;
				!container && m.create();
				if (_params.callback(container) === false)
					return;
				_setHide(container);
				callback && callback(container);
			}
		};
	})();
	var dialog = (function() {
		var container, _params;
		var def = {
			'elem' : null,
			'content' : "",
			'textAlign' : 'center',
			'className' : "",
			'clickClose' : true,
			'close' : '关闭',
			'loading' : '正在加载中……',
			'loadingError' : '加载失败',
			'title' : '消息提示',
			'confirm' : '确认',
			'cancel' : '取消',
			'callback' : _emptyFun
		};
		var htmlTeml = {
			box : function() {
				var _box = [];
				_box.push('<div class="cy-dialog cy-dialog-{type} cy-dialog-{className}">');
				_box.push('<div class="cy-dialog-top cy-dialog-hideTop{hideTop}">{top}</div>');
				_box.push('<div class="cy-dialog-midddle cy-dialog-{textAlign}">{middle}</div>');
				_box.push('<div class="cy-dialog-bottom">{bottom}</div>');
				_box.push('</div>');
				return _box.join('');
			}(),
			top : '<div class="cy-dialog-title">{title}</div><div class="cy-dialog-close">{close}</div>',
			btn : '<span class="cy-dialog-btn cy-dialog-btn-{type}">{text}</span>',
			error : ""
		};
		var hide = function(callback) {
			if (!_params || !container) {
				return;
			}
			if (_params.options.elem) {
				_setHide(container);
			} else {
				container.parentNode.removeChild(container);
			}
			container = null;
			callback && callback();
		};
		var show = function(callback) {
			_setShow(container);
			callback && callback();
		};
		var unit = "px", getUnit = function(val) {
			return (val || "").toString().match(/^([+-]=)?([\d+-.]+)(.*)$/)
					|| [];
		};
		// 建样式
		var _initDom = function() {
			var m = this, options = _params.options;
			if (options.elem) {
				container = doc.querySelector(options.elem);
			} else {
				var temdiv = create('div'), first;
				temdiv.innerHTML = options.text;
				first = temdiv.firstChild;
				container = doc.body
						.appendChild(first && first.nodeType == 1 ? first
								: temdiv);
			}
			addEvent(container, "click", function(e) {
				var cur = (e.target || e.srcElement);
				while (cur && cur != container) {
					cur.nodeType == 1
							&& _params.eventList.forEach(function(n) {
								cur.classList.contains(n.key)
										&& n.val.call(_dialog, _params);
							});
					cur = cur["parentNode"];
				}
			});
		};
		var _initCss = function() {
			var cssArr = [];
			cssArr.push('.cy-dialog{font-family: "PingFang SC", "Helvetica Neue", Helvetica, STHeitiSC-Light, WOL_SB, Tahoma, Helvetica, sans-serif;z-index:1111;position:fixed;border-radius:5px;background:rgba(255,255,255,.95);overflow:hidden;font-size:17px;line-height:21px;top:50%;left:50%;transform:translate3d(-50%,-50%,0)}');
			cssArr.push('.cy-dialog .cy-dialog-top{font-size:18px;font-weight:500;text-align:center;margin: 0 15px 0 15px;display: flex;padding: 20px 0 0px 0;}');
			cssArr.push('.cy-dialog .cy-dialog-hideTop1{display:none;}');
			cssArr.push('.cy-dialog .cy-dialog-midddle{margin:20px 15px 15px 15px;font-size:14px}');
			cssArr.push('.cy-dialog .cy-dialog-bottom{padding:5px 13px 25px 13px;font-size:14px;display:flex}');
			cssArr.push('.cy-dialog .cy-dialog-top .cy-dialog-title{font-family:PingFangSC-Regular;display:block;width:100%}');
			cssArr.push('.cy-dialog .cy-dialog-top .cy-dialog-close{display:none}');
			cssArr.push('.cy-dialog .cy-dialog-btn{background: #FFC922;border-radius: 17.5px;color: #2A292E;height:35px;line-height:35px;display:block;width:100%;text-align:center;margin:0 7px;font-size:14px}');
			cssArr.push('.cy-dialog .cy-dialog-btn:last-child{}');
			cssArr.push('.cy-dialog-left{text-align:left}');
			cssArr.push('.cy-dialog-center{text-align:center}');
			cssArr.push('.cy-dialog-right{text-align:right}');
			cssArr.push('.cy-dialog .cy-dialog-btn-cancel{ background: #fff;border: 1px solid #D4D4D5;border-radius: 17.5px;color: #2A292E;}');
			cssArr.push('.cy-dialog .cy-dialog-btn-confirm{}');
			cssArr.push('.cy-dialog-alert{}');
			cssArr.push('.cy-dialog-confirm{}');
			var style = create('style') ;
			style.type = "text/css";
			style.innerHTML = cssArr.join('');
			doc.getElementsByTagName('head')[0].appendChild(style);
			_initCss = _emptyFun;
		};
		var _initParams = function(args) {
			var args0 = args[0];
			var args1 = args[1];
			_typeof(args0) == "string" && (args0 = {
				content : args0,
				callback : args[1] || _emptyFun
			});
			_typeof(args0) == "function" && (args0 = {
				callback : args[0]
			});
			_params = {};
			_params.options = extend(extend({}, def), args0 || {});
			!_params.options.title && (_params.options.hideTop = 1);
			_params.beforeHooks = [];
			_params.afterHooks = [];
			_params.eventList = [];
			return _params;
		};
		var _open = function() {
			var m = this;
			_params.beforeHooks.forEach(function(item) {
				item.call(m, _params);
			});
			mask.create(function() {
				_params.options.clickClose && hide();
			}).show();
			hide();
			_initDom();
			_initCss();
			_setShow(container);
			_params.afterHooks.forEach(function(item) {
				item.call(m, _params, container);
			});
		};
		var _dialog = {
			close : function () {
				hide();
				mask.close();
			},
			show : show,
			extend : function(mtdhodObj) {
				var m = this, key;
				if (_typeof(mtdhodObj) != "object") {
					return;
				}
				for (key in mtdhodObj) {
					if (mtdhodObj.hasOwnProperty(key)) {
						if (_typeof(mtdhodObj[key]) == 'function') {
							m[key] = (function(key) {
								return function() {
									_initParams(arguments);
									_params.eventList.push({
										key : "cy-dialog-close",
										val : function(params) {
											this.close();
											mask.close();
											params.options.callback();
										}
									});
									mtdhodObj[key].call(m, _params);
									_open();
									show();
								};
							})(key);
						} else {
							m[key] = mtdhodObj[key];
						}
					}
				}
			}
		};
		_dialog.extend({
			open : function(params) {
				var m = this, options;
				options = params.options;
				options.text = options.content;
				params.afterHooks.push(function(p, elem) {
					options.text && extend(elem.style, {
						position : "relative",
						zIndex : "1111"
					});
				});
				params.afterHooks.push(function(p, elem) {
					options.callback(elem);
				});
			},
			pop : function(params) {
				var m = this, options;
				options = params.options;
				options.width = options.width || "74%";
				options.height = options.height || "auto";
				options.text = options.content;
				var widthVal = getUnit(options.width);
				var heightVal = getUnit(options.height);
				params.afterHooks.push(function(p, elem) {
					extend(elem.style, {
						width : options.width,
						height : options.height,
						position : "fixed",
						zIndex : "1111",
						top: "50%",
						left: "50%",
						transform: "translate3d(-50%,-50%,0)"
					});
				});
				params.afterHooks.push(function(p, elem) {
					options.callback(elem);
				});
			},
			alert : function(params) {
				var m = this, options;
				options = params.options;
				options.elem = null;
				options.width = options.width || "74%";
				options.height = options.height || "auto";
				options.text = substitute(htmlTeml.box, {
					type : "alert",
					hideTop : options.hideTop,
					textAlign : options.textAlign,
					top : substitute(htmlTeml.top, options),
					middle : options.content || "",
					bottom : substitute(htmlTeml.btn, {
						text : options.text || options.close
					})
				});
				params.afterHooks.push(function(p, elem) {
					extend(elem.style, {
						width : options.width,
						height : options.height
					});
				});
				params.eventList.push({
					key : "cy-dialog-btn",
					val : function(n) {
						this.close();
						mask.close();
						n.options.callback(n);
					}
				});
			},
			confirm : function(params) {
				var m = this, options, bottom;
				options = params.options;
				bottom = options.bottom;
				options.elem = null;
				options.width = options.width || "74%";
				options.height = options.height || "auto";
				if (_typeof(bottom) != "array") {
					options.bottom = [ {
						type : "cancel",
						text : options.cancel
					}, {
						type : "confirm",
						text : options.confirm,
						callback : options.callback
					} ];
					bottom = options.bottom;
				}
				if (bottom.length == 1) {
					!bottom[0].text && (bottom[0].text = options.confirm);
					!bottom[0].type && (bottom[0].type = "confirm");
				} else if (bottom.length == 2) {
					!bottom[0].text && (bottom[0].text = options.cancel);
					!bottom[1].text && (bottom[1].text = options.confirm);
					!bottom[0].type && (bottom[0].type = "cancel");
					!bottom[1].type && (bottom[1].type = "confirm");
				}
				options.text = substitute(htmlTeml.box, {
					type : "confirm",
					hideTop : options.hideTop,
					textAlign : options.textAlign,
					top : substitute(htmlTeml.top, options),
					middle : options.content || "",
					bottom : (function(arr) {
						bottom.forEach(function(n) {
							arr.push(substitute(htmlTeml.btn, n));
							params.beforeHooks = params.beforeHooks
									.concat(n.beforeHooks || []);
							params.afterHooks = params.afterHooks
									.concat(n.afterHooks || []);
							params.eventList.push({// 增加事件
								key : "cy-dialog-btn-" + n.type,
								val : function() {
									this.close();
									mask.close();
									n.callback && n.callback(n);
								}
							});

						});
						return arr.join('');
					})([])
				});
				params.afterHooks.push(function(p, elem) {
					extend(elem.style, {
						width : options.width,
						height : options.height
					});
				});
			}
		});
		return _dialog;
	})();
	var toast = (function() {
	    var teml = '<div class="toast-message {className}">{text}</div>', activeCSS = "active";
	    var container, _params, tId, def = {
	        duration: 1000,
	        className: ""
	    };
	    var _initCss = function() {
			var cssArr = [];
			cssArr.push('.toast-container{line-height:17px;position:fixed;z-index:9999;bottom:50px;left:50%;transform:translate(-50%,0);transition:opacity.3s;opacity:0}');
			cssArr.push('.toast-container.active{opacity:.9}');
			cssArr.push('.toast-message{font-size:14px;padding:10px 25px;text-align:center;color:#fff;border-radius:6px;background-color:#323232}');
			var style = create('style') ;
			style.type = "text/css";
			style.innerHTML = cssArr.join('');
			doc.getElementsByTagName('head')[0].appendChild(style);
			_initCss = _emptyFun;
		};
	    var _initDom = function(params) {
            if (container) return;
            container = doc.body.appendChild(create('div', {
                position: "fixed",
                lineHeight: "17px",
                zIndex: "1111",
                bottom: "50px",
                left: "50%",
                transform: "translate(-50%,0)"
            }));
            container.classList.add("toast-container");
            _initCss();
        };
	    return function(text, params) {
            if (_typeof(text) == "object") {
                params = text;
                text = params.text;
            }
            params = params || {};
            params.text = text || '';
            _params = extend(extend({}, def), params);
            _initDom();
            container.innerHTML = substitute(teml, _params);
            container.classList.add(activeCSS);
    		container.style.display = "block";
            clearTimeout(tId);
            tId = setTimeout(function() {
            	container.classList.remove(activeCSS);
            	setTimeout(function(){
            		container.style.display = "none";
            	},300);
            }, _params.duration);
        };
	})();
	
	win.CY.ui = {
	    mask: mask,
	    toast: toast,
	    dialog: dialog
	};
	return win.CY.ui;	
});


