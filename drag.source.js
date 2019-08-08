(function(e, n) {
	if (typeof module !== "undefined") {
	    require("./offset");
	    module.exports = n(e);
	} else {
		n(e);
	    if (typeof define === "function" && (define.amd || define.cmd)) {			
			var base = "//" + (!/ppppoints.com/.test(document.domain)?"j.changyoyo.com":"j.ppppoints.com") +"/static/js/";
	        requirejs.config({
	    	    paths: {
	    	        "offset": base + "libs/offset"
	    	    }
	    	});
	        define("drag", [ "offset" ], function() {
	            return n(e);
	        });
	    }
	}
})(window || this, function(win) {
	!win.CY && (win.CY = {});
	if(win.CY.drag) return win.CY.drag;
	var doc = document;
	var body = doc.body, offset = CY.offset;
	var create = function(tag, attrs) {
		tag = doc.createElement(tag);
		extend(tag.style, attrs || {});
		return tag;
	};
	var get = function(selector, content) {// dom|selector
		return selector && selector instanceof Object ? selector : (selector ? (content || document).querySelector(selector) : null);
	};
	var _typeof = function(obj) {
		return Object.prototype.toString.call(obj).split(/\s(\w+)/)[1]
				.toLowerCase();
	};
	var addEvent = function(elem, type, handle) {
	    each((_typeof(elem) != "array" ? [elem] : elem), function(i, dom) {
	        type.split(' ').forEach(function(n) {
	            dom.addEventListener(n, handle, false);
	        });
	    });
	};
	var extend = function(source, params) {
		for ( var key in params) {
			if (params.hasOwnProperty(key)) {
				if (_typeof(params[key]) != "object") {
					params[key] != undefined && (source[key] = params[key]);
				} else {
					source[key] = extend(source[key] || {}, params[key]);
				}
			}
		}
		return source;
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
	var getW = function(elem) {
	    return elem.offsetWidth;
	};
	var getH = function(elem) {
	    return elem.offsetHeight;
	};
	var each = function(arr, callback) {
		arr = arr || [];
		for ( var i = 0, len = arr.length; i < len; i++) {
			if (callback.call(arr[i], i, arr[i]) == false) {
				break;
			}
		}
	};
	var getAllItem = function (item, content) {
		var divArr = null, items = [];
		content = get(content);
		if (content) {
		    each(content.querySelectorAll('div') || [], function(i, dom) {
		        (dom.className || '').split(/\s+/).forEach(function(n) {
		            n == item && items.push(dom);
		        });
		    });
		}

		return items;
	};
	var getModuleItem = function (className, parent, event) {
		var _menuItem = null, inModule = false;
		var cur = (event.target || event.srcElement);
		while (cur && cur != body && !inModule) {
			if (cur.nodeType == 1) {
				(cur.className || '').split(/\s+/).forEach(function (n) {
					if (n == className) {
						_menuItem = cur;
					}
				});
			}
			if (!inModule && cur == parent) {
				inModule = true;
			}
			cur = cur["parentNode"];
		}
		return inModule ? _menuItem : null;
	};
	// 禁止右键
	doc.onselectstart = new Function('event.returnValue=false;');

	var drag = function(params) {		
		var m = this;
		if (!(m instanceof drag)) {
			return new drag(params);
		}
		var _startHooks = []; 	// 开始
		var _moveHooks = [];	// 移动
		var _stopHooks = [];	// 停止
		var _clickPageItem = [];// 右边点击
		params = extend({
		    menuLayout: "", // 布局元素
		    menuItem: "",   // 布局各模块
		    pageLayout: "", // 模块选择容器
		    dashedCss: ""// 
		}, params);
		var menuLayout = get(params.menuLayout);// 左边功能模块边框
		var pageLayout = get(params.pageLayout);// 右边模块边框
		var menuItems, pageItems;
		var menuLayout_width = getW(menuLayout);
		
		var unit = "px";
		var isAddItem = false;
		var isMousedown = false;
		var currItem = null;
		var currItem_top = 0; // 拖动的模块top
		var currItem_left = 0; // 拖动的模块left
		var currItem_width = 0; // 拖动的模块width
		var lineBox = create("div", {
		    border: "1px dashed #666"
		});
		var leftToRight = null, isMove = false;
		var temPageX = null, temPageY = null;
		addEvent(doc, "mousedown", function(event) {
			leftToRight = null;
			var temItem, _leftItem, _rightItem;
			var pageX = event.pageX;
			var pageY = event.pageY;
			temPageX = pageX;
			temPageY = pageY;
			_leftItem = getModuleItem(params.menuItem, menuLayout, event);
			_rightItem = getModuleItem(params.menuItem, pageLayout, event);
			
			if (!_leftItem && !_rightItem) return;
			if (_leftItem) { // 左边菜单
			    leftToRight = true;
			    currItem = _leftItem.cloneNode(true);
			    currItem.data = extend({}, currItem.data || {});
			}
			if (_rightItem) { // 右边模块
			    leftToRight = false;
			    currItem = _rightItem;
			}
			isMousedown = true;
			temItem = _leftItem || _rightItem;
			currItem.data = temItem.data;
			event.preventDefault();
			
			menuItems = getAllItem(params.menuItem, menuLayout);
		    pageItems = getAllItem(params.menuItem, pageLayout);
			currItem_top = pageY - offset(temItem).top; // 菜单模块top
			currItem_left = pageX - offset(temItem).left; // 菜单模块left
			currItem_width = getW(temItem); // 菜单模块width
			currItem_height = getH(temItem); // 菜单模块width
			isMove = false;
		});
		addEvent(doc, "mousemove", function(event) {
			var pageX = event.pageX;
			var pageY = event.pageY;
			if (!isMousedown || !currItem) return;
			for (var i = 0; i < _moveHooks.length; i++) {
	            if (_moveHooks[i].call(m, currItem, leftToRight, lineBox, menuItems, pageItems) == false) {
	                return;
	            }
	        }
			
			extend(currItem.style, {
		    	position: 'absolute',
		        top: (pageY - currItem_top) + unit,
		        left: (pageX - currItem_left) + unit
		    });
			if (leftToRight ? currItem_width + (pageX - currItem_left) > menuLayout_width : pageX > currItem_left) {
			    // 生成虚线框
			    pageLayout.appendChild(lineBox);
			    if (pageItems[0]) {
			        var last = pageItems[pageItems.length - 1];
			        if (pageY > offset(last).top + getH(last)) {
			            pageLayout.appendChild(lineBox);
			        } else {
			            each(pageItems, function(i, n) {
			                if (n == currItem) return;
			                if (pageY > offset(n).top && (pageY < offset(n).top + getH(n))) {
			                    pageLayout.insertBefore(lineBox, n);
			                }
			            });
			        }
			    }
			    extend(lineBox.style, {
			    	border: "1px dashed #666",
			        height: currItem_height + unit
			    });
			    _setShow(lineBox);
			    
			    if (!leftToRight && temPageX == pageX && temPageY == pageY) {
			        extend(lineBox.style, {border: "none"});
			    }
			} else {
			    // 删除虚线框
				_setHide(lineBox);
			}
			if (!isMove) {
				extend(currItem.style, {
				    zIndex: 10,
				    width: currItem_width + unit,
				    height: currItem_height + unit
				});
			    body.appendChild(currItem);
			}
			isMove = true;
		});
		addEvent(doc, "mouseup", function(event) {
			if (isMove && isMousedown) {
				if (lineBox.style.display == "block") {
					
				    pageLayout.insertBefore(currItem, lineBox);
				    extend(currItem.style, {
				        position: "static",
				        width: "",
				        height: ""
				    });
				    body.appendChild(lineBox);
				    _setHide(lineBox);
				    each(_stopHooks, function() {
				        this.call(m, currItem, leftToRight, lineBox, menuItems, pageItems);
				    });
				} else if (currItem) {
				    currItem.parentNode.removeChild(currItem);
				}
			}
			if (!isMove && isMousedown) {
			    var _rightItem = getModuleItem(params.menuItem, pageLayout, event);
		    	_rightItem && each(_clickPageItem, function() {
		            this.call(m, currItem, false, lineBox, menuItems, pageItems);
		        });
			}
			currItem = null;
		    isMousedown = false;
		    isMove = false;
		});
		
		return {
		    addStartHooks: function(func) {
		        _startHooks.push(func);
		    },
		    addMoveHooks: function(func) {
		        _moveHooks.push(func);
		    },
		    addStopHooks: function(func) {
		        _stopHooks.push(func);
		    },
		    addClickPageItem: function(func) {
		    	_clickPageItem.push(func);
		    }
		};
	};
	
	win.CY.drag = drag;
	return drag;	
});
