/*~~~~~~~~
with dances

	toolsName: dialog

	version: 1.0

	firstDate: 2012.11.26

	lastDate: 2012.11.27

	import: [
		jQuery,
		dances.viewSize,
		dances.type
	],

	effect: [
		+.提供 自定义宽与高 并 自动居中布局模式
		+.提供 自定义标题(html代码) 与 内容(html代码)
		+.提供 多种窗体类型选择  alert warn confirm prompt

		+.提供 交互事件 fConfirm - 点击确认按钮
		+.提供 交互事件 fCancel - 点击关闭按钮或者取消
		+.提供 交互事件 fClose - 关闭了窗体

		+.可扩展 button

		+.可配置 dialog 是否自动跟随

		+.可配置 遮罩
		+. {effects}
	];

	log: {
		"v1.0": [
			+. 由 dances.boxAio 移植
			+. {logs}
		]
	}

~~~~~~~~*/

/*~~~~~~~~
	conf:

		dances.dialog({
			sTitle   	: "标题",
			content		: "",
			sClass		: ""

			sType		: "alert" || "warn" || "confirm" || "prompt" || null,

			bFollow 	: false,

			nWidth   	: 520,
			nHeight  	: 430,

			fConfirm 	: function(){},
			fCancel		: function(){},
			fClose		: function(){},

			nZ			: "1650",

			bMask   	: true,

			// 配置参数结构与 dances.uMask 保存一直
			oMaskConf	: {
				// z-index
				nZ:1550,

				// 透明度,取值范围:0~1
				nOpacity:0.5,

				// 事件
				eClick:function(){},		// click 函数若返回 阻止进一步冒泡
				eClose:function(){},		// close 函数若返回 false 可阻止操作
				eRemove:function(){},	// remove 函数若返回 false 可阻止操作

				// css
				css : {
					// 自定义样式 比如 background-color box-shadow
					// 这里指定的 opacity background-color z-index 优先级大于 外层的
				}

				// 自定义 动画显示
				show : function(maskEl){
					$(maskEl).fadeOut();
				}

				// 自定义 动画隐藏
				hide : function(maskEl){
					$(maskEl).fadeIn();
				}
			}

		})

~~~~~~~~*/

// TODO UI 结构分离

// 项目之后:
// TODO API 详细

// 命名扩展
if ("object" !== typeof window.dances &&  "function" !== typeof window.dances){
	window.dances = {};
	if(window.console && window.console.log){
		window.$log = console.log;
		try{
			$log("_____" + (new Date).toString() + "_____");
		}catch (e){
			window.$log = function(){
				console.log.apply(console,arguments);
			};
			$log((new Date).toString());
		}
	}else{
		window.$log = Boolean;
	}
}


(function(){
	if("object" !== typeof window.dances && "function" !== typeof window.dances){
		throw ("expect dances.core");
	}

	var fn;
	fn = (function(){
		var Dialog,
			dialog,
			instArr,
			fClean,

			fInit,
			fConf,
			fValidArgs,

			requireType,
			defaultConf,

			sHtmlDialog,
			htmlBtn,

			viewMaxWidth,
			fCen,
			fSize,

			ltIE7,ltIE8,ltIE9
		;

		fInit = function(){
			requireType = {
				sTitle  : "string",
				content: "string,element",
				sType  : "string",
				bFollow: "boolean",
				bMask  : "boolean",

				sClass: "string",

				nWidth : "number",
				nHeight: "number",
				nZ     : "number",

				fConfirm: "function",
				fCancel : "function",
				fClose  : "function",

				oMaskConf: "object"
			};

			defaultConf = {
				sTitle  : "提示",
				bFollow: false,
				bMask  : true,
				nZ     : 1055,
				sClass : "dances-dialog-ui",

				oMaskConf: {
					// z-index
					z      : 1050,

					// 透明度,取值范围:0~1
					opacity: 0.5
				}
			};

			defaultConf.fConfirm =
				defaultConf.fCancel =
					defaultConf.fClose = function(){}
			;

			// 会话框结构
			// TODO 考虑可配置性
			sHtmlDialog =
				'<div class="dsDialog"> ' +
					'<div class="dsDialog-inner"> ' +
						'<div class="dsDialog-hdr">' +
							'<h3 class="dsDialog-tie"></h3> ' +
							'<a href="#" class="dsDialog-close" title="关闭"></a>' +
						' </div> ' +
						'<div class="dsDialog-con tac"></div>' +
						'<div class="dsDialog-ftr"></div>' +
						' <!--[if lt IE 7]><iframe class="dsDialog-fixSelectCover" frameborder="0">$nbsp;</iframe><![endif]-->' +
					'</div>' +
					' <!--[if lt IE 9]>' +
						'<div class="dsDialog-shadow"></div>' +
					'<![endif]-->' +
				' </div>'
			;

			// 按钮类型
			htmlBtn = {
				warn : '<input type="button" value="确认" class="dsDialog-btn dsDialog-btn-confirm">'
			};

			htmlBtn.prompt =
				htmlBtn.confirm =
					'<input type="button" value="确认" class="dsDialog-btn dsDialog-btn-confirm">' +
					'<input type="button" value="取消" class="dsDialog-btn dsDialog-btn-cancel">'
			;

			// 获取视口大小
			viewMaxWidth = (dances.viewSize() && dances.viewSize().width) || 1080;

			ltIE7 = dances.uAgent.msie && dances.uAgent.msie < 7;
			ltIE8 = dances.uAgent.msie && dances.uAgent.msie < 8;
			ltIE9 = dances.uAgent.msie && dances.uAgent.msie < 9;

			// 居中
			fCen = function(inst){
				var conf = inst.conf;

				if(conf.bFollow){
					if(ltIE7){
						inst.$dialog.css({
							marginTop : 0,
							marginLeft: -inst.$dialog.outerWidth() / 2
						});
					}else{
						inst.$dialog.css({
							marginTop : -inst.$dialog.outerHeight() / 2,
							marginLeft: -inst.$dialog.outerWidth() / 2
						});
					}
				}else{
					inst.$dialog.css({
						marginTop : 0,
						marginLeft: -inst.$dialog.outerWidth() / 2
					});
				}

				return inst;
			};

			// 设置集合属性
			fSize = function(inst){
				var conf = inst.conf,

					width,
					width2,
					nPadding = 0,

					_$Tem
				;

				// hack ie7 and below with "width"
				// TODO 获取隐藏 width/height
				if(!conf.nWidth && ltIE8){

					_$Tem = inst.$dialogCon.clone().css({visibility: "hidden", display: "inline"}).appendTo("body");
					width = _$Tem.outerWidth();
					_$Tem.remove();

					_$Tem = inst.$dialogFtr.clone().css({visibility: "hidden", display: "inline"}).appendTo("body");
					width2 = _$Tem.outerWidth();
					_$Tem.remove();

					width = Math.max(width, width2) + 5 * 2;

					conf.nWidth = width;

					// gc
					_$Tem = null;
				}

				if(conf.nWidth){
					nPadding = parseInt(dances.ss(inst.$dialogCon[0], "paddingRight"), 10) + parseInt(dances.ss(inst.$dialogCon[0], "paddingLeft"), 10);
					nPadding = isNaN(nPadding) ? 0 : nPadding;
					width = conf.nWidth + nPadding;
				}

				inst.$dialogInner.css({
					width: width
				});

				return inst;
			};

			instArr = [];

			fClean = function(inst, bSingle){
				var pound,
					num,

					realInst,
					conf
				;

				bSingle = bSingle === undefined ? true : bSingle;

				if(bSingle){
					pound = instArr;
					num = pound.length;

					while(num--){
						if(pound[num] === inst){
							// 脱离应用池
							pound.splice(num, 1);
							realInst = inst;
							break;
						}
					}
				}else{
					realInst = inst;
				}

				if(realInst){
					// 解除事件绑定
					inst.$dialog.off().remove();

					inst.mask && inst.mask.remove();

					conf = inst.conf;

					for(var prop in inst){
						if(inst.hasOwnProperty(prop)){
							inst[prop] = null;
						}
					}

					for(prop in conf){
						if(conf.hasOwnProperty(prop)){
							conf[prop] = null;
						}
					}

				}

				inst =
					realInst =
						conf = null
				;

			};

			arguments.callee = null;
			dialog.init = function(){
				return this;
			};

			return this;
		};

		// TODO 还思考成熟
		fConf = function(conf){
			if(!conf || "object" !== typeof conf){
				return "break";
			}

			// 皮肤类型
			if(conf.skin){

			}
		};

		fValidArgs = function(conf){
			var _requireType = requireType,
				_defaultConf = defaultConf,

				fType = dances.type

			;

			for(var prop in _requireType){
				// 可配置参数
				if(_requireType.hasOwnProperty(prop)){

					// 不符合的必须配置参数
					if(!conf.hasOwnProperty(prop) || _requireType[prop].indexOf(fType(conf[prop])) === -1){
						// 必须配置参数 有推荐值
						if( _defaultConf.hasOwnProperty(prop)){
							conf[prop] = _defaultConf[prop];

						// 必须配置参数 没有推荐值
						}else{
							conf[prop] = null;
						}
					}
				}
			}

			return conf;
		};

		Dialog =  function(){
			this.conf = Array.prototype.slice.call(arguments,0);
		};

		Dialog.prototype = {
			constructor : Dialog,

			init : function(){
				var conf,
					_content,

					$ = jQuery,

					$html = $(sHtmlDialog),

					$dialogInner,

					$dialogCon,

					$dialogFtr,

					_this = this
				;

				// -------  配置/验证参数
				while(true){
					conf = this.conf.pop();
					if(conf && "object" === typeof conf){
						_content = this.conf.pop();
						break;
					}
				}

				// 验证参数
				this.conf = fValidArgs(conf);

				// -------  创造 html实体
				this.$dialog =
					// 隐藏节点,避免性能损失
					$html.hide()
						.appendTo("body")
						.css("z-index", conf.nZ)
				;

				// follow
				conf.bFollow && $html.addClass("dsDialog-follow");

				// 保存 dom/jquery实例引用
				_this.boxEl = $html[0];

				_this.$dialogInner
					= $dialogInner
						= $html.find(".dsDialog-inner")
				;

				_this.$dialogCon
					= $dialogCon
						= $html.find(".dsDialog-con").addClass(conf.sClass)
				;

				_this.$dialogFtr =
					$dialogFtr =
						$html.find(".dsDialog-ftr")
				;

				// 依据类型 , 创建 btn结构
				conf.sType && $dialogFtr.append(htmlBtn[conf.sType] || "");

				// buttons
				if(conf.buttons){
					(function(data){
						var num = data.length - 1,
							itemData,
							$item
							;
						if("number" !== typeof num || num < 0){
							return "break";
						}

						_this.buttons = {};

						do{
							itemData = data[num];
							$item =
								$('<input type="button" class="dsDialog-btn" value="' + itemData.value + '">')
									.bind("click", ("function" === typeof itemData.callback ? itemData.callback : function(){
								}))
									.prependTo($dialogFtr)
							;
							if(itemData.disabled){
								$item.attr("disabled", "disabled").addClass("dsDialog-btn-disable");
							}
							if(itemData.id){
								_this.buttons[itemData.id] = [itemData, $item];
							}
						}while(--num > -1);

					})(conf.buttons);
				}

				// evt
				// 绑定关闭
				$html
					.on("click", ".dsDialog-close", function(){
						// 关闭按钮 向实例 .hide()方法 传入0
						_this.hide(0);
						return false;
					})
				;

				// 依据 dialog 类型 , 绑定事件
				switch(conf.sType){
					case "warn":
					case "confirm":
					case "prompt":
						$html
							.on("click", ".dsDialog-btn-confirm", function(){
								false !== conf.fConfirm.call(_this, _this.value) && _this.hide(true);
							})
							.on("click", ".dsDialog-btn-cancel", function(){
								false !== conf.fCancel.call(_this, _this.value) && _this.hide(false);
							})
						;
						break;

					default:
						!conf.buttons && $dialogFtr.remove();
				}

				// 设置: 标题 和 内容
				$html.find(".dsDialog-tie").append(conf.sTitle);
				$dialogCon.append(_content || conf.content || "");

				// prompt 窗体 绑定事件
				if("prompt" === conf.sType){
					$html.on("change blur",".dsDialog-inputText",function(){
						_this.value = this.value;
					});

					$dialogCon.append('<br><input type="text" class="dsDialog-inputText mt5">');
				}

				// 设置宽度
				if(conf.nWidth){
					conf.nWidth = conf.nWidth < viewMaxWidth ? conf.nWidth : viewMaxWidth;
				}
				fSize(this);

				// 设置高度
				conf.nHeight && $dialogCon.css({
					width : conf.nWidth,
					height: conf.nHeight
				});

				// ie7-- 需要记住变量
				if(ltIE7){
					_this.$iframe = _this.$dialog.find(".dsDialog-fixSelectCover");
					_this.$dialogInner = $dialogInner;
				}
				if(ltIE9){
					_this.$shadow = _this.$dialog.find(".dsDialog-shadow");
				}

				if(conf.bMask){
					this.mask = dances.uMask(conf.oMaskConf);
				}

				// gc
				$ = null;

				// 重载实例 init 方法
				this.init = function(){
					return this;
				};

				// push 实例池
				instArr.push(this);

				this.bInit = true;

				return this;

			},

			show : function(){
				!this.bInit && this.init();

				var conf = this.conf,
					_width,
					_height,
					nTop
				;

				if(!this.bShow){

					this.$dialog.show();
					// 非 bFollow 模式 定义高度
					if(!conf.bFollow){
						nTop =
							Math.max(document.documentElement.scrollTop, document.body.scrollTop) +
								(dances.viewSize().height - this.$dialog.outerHeight()) / 2
						;

						nTop = isNaN(nTop) ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : nTop;

						this.$dialog.css("top", nTop);
					}

					if(ltIE9){
						_width = this.$dialogInner.width();
						_height = this.$dialogInner.height();

						// 设置投影
						this.$shadow.css({
							width : _width,
							height: _height
						});

						// 设置 fixSelectCover 尺寸
						if(ltIE7){
							this.$iframe.css({
								width : _width,
								height: _height
							});
						}
					}

					this.mask && this.mask.show();

					this.bShow = true;

					// 居中化
					fCen(this)
				}

				return this;
			},

			hide : function(flag){
				/*
					flag
						0 由关闭按钮传递
						true 由确认按钮传递
						false 由取消按钮传递

				*/
				var conf = this.conf
				;

				if(this.bShow){
					if(false !== conf.fClose.call(this, flag)){
						this.mask && this.mask.hide();
						this.$dialog && this.$dialog.hide();
						this.bShow = false;
					}
				}
				return this;
			},

			remove: function(){
				fClean(this, true);
			},

			content: function(){
				var arg = arguments[0];

				if(arg){
					if("function" === typeof arg){
						this.$dialogCon.html(arg(this.$dialogCon.html()));
					}else{
						this.$dialogCon.empty().append(arg);
					}
					return this;

				}else{
					return this.$dialogCon.html();
				}

			},

			title: function(){
				var arg = arguments[0];
				if(arg){
					if("function" === typeof arg){
						this.$dialog.find(".dsDialog-tie").html(arg(this.$dialogCon.html()));
					}else{
						this.$dialog.find(".dsDialog-tie").empty().append(arg);
					}
					return this;

				}else{
					return this.$dialog.find(".dsDialog-tie").html();
				}
			},

			button : function(data){
				var _id,
					_this = this,
					$btnEl,
					btnData,

					$newItem
				;
				if(!data || "object" !== typeof data){
					return _this;
				}
				_id = data.id;


				if(_this.buttons.hasOwnProperty(_id)){
					btnData = _this.buttons[_id][0];
					$btnEl = _this.buttons[_id][1];

					// btn 名称
					if(btnData.value){
						btnData.value = data.value;
						$btnEl.val(btnData.value);
					}

					// btn disable 状态
					if(data.disabled && !btnData.disabled){

						btnData.disabled = data.disabled;
						$btnEl.attr("disabled","disabled").addClass("dsDialog-btn-disable");

					}else if(btnData.disabled){

						btnData.disabled = data.disabled;
						$btnEl.removeAttr("disabled").removeClass("dsDialog-btn-disable");

					}

					// btn callback
					if("function" === typeof data.callback){
						btnData.callback = data.callback;
						$btnEl.unbind().bind("click",data.callback);
					}
				}else{
					if(data.hasOwnProperty("value")){
						$newItem = $('<input type="button" class="dsDialog-btn" value="' + data.value + '">')
							.bind("click",("function" === typeof data.callback ? data.callback : function(){ }))
							.appendTo(_this.$dialog.find(".dsDialog-ftr"))
						;
						if(data.disabled){
							$newItem.attr("disabled","disabled").addClass("dsDialog-btn-disable");
						}
						if(data.id){
							_this.buttons[data.id] = [data,$newItem];
						}
					}
				}

				return fCen(fSize(this));
			}
		};

		dialog = function(content, options){
			return new Dialog(content, options);
		};

		// 公开 初始化方法
		dialog.init = fInit;

		// 公开 初始化配置方法
		dialog.conf = fConf;

		// 清理
		dialog.clean = function(inst){
			var pound,
				num
			;

			if(inst){
				fClean(inst, true);
			}else{
				pound = instArr;
				num = pound.length;
				while(num--){
					inst = pound[num];
					// 清理隐藏的 会话框
					!inst.bShow &&	fClean(inst, false);
				}
			}
		};

		// 公开 Dialog 类
		dialog.Dialog = Dialog;

		return dialog;
	})();

	dances.extend("dialog",fn);
})();
