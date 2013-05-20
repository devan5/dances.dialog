/*_______
with dances.plugins

	called: dialog

	version: 2.0_dev

	firstDate: 2012.11.26

	lastDate: 2013.05.18

	require: [
		"jQuery",
		"dances.uMask",
		"dances.ss",
		"dances.getViewSize",
		"dances.type"
	],

	effect: [
		+ 提供 自定义宽与高 并 自动居中布局模式
		+ 提供 自定义标题(html代码) 与 内容(html代码)
		+ 提供 多种窗体类型选择  alert warn confirm prompt

		+ 提供 交互事件 fConfirm - 点击确认按钮
		+ 提供 交互事件 fCancel - 点击关闭按钮或者取消
		+ 提供 交互事件 fClose - 关闭了窗体

		+ 可扩展 button

		+ 可配置 dialog 是否自动跟随

		+ 可配置 遮罩
		+ {effects}
	];

	log: {
		"v1.0": [
			+ 由 dances.boxAio 移植
			+ {logs}
		],

		"v1.1": [
			+ 代码优化
			+ API撰写
			+ 增加 .dialog 类配置
			+ 更改实例方法名 open/close
			+ 增加 inst.index()
			+ 自动 zIndex 判断
			+ 增加 esc
			+ {logs}
		],

		"v1.2": [
			+ 提供 jQuery 接口
			+ 重构代码
			+ 增加动画函数配置
		],

		"v2.0": [
			+ 适配 dances.amd
			+ 重写 继承部分代码
			+ // 整理 API, 更符合使用环境
			+ // TODO 增加 在实例, 增加 conf 动态可以改变 配置
			+ // TODO dances.ss 引入
			+ // TODO 自动加载 css
			+ // TODO 修正 ie6 当标题长于10个字的时候, 显示错乱
		]
	}

_______*/

/*_______
# syntax

## 配置 klass
	dances.dialog.conf(opt);

	Object.keys(opt);
==>
	[
		"baseJquery",
 		"bAutoInit"
	]

### baseJquery
配置 jQuery 版本

### bAutoInit
是否自动初始化
默认为 true
只能使用一次

## 初始化 klass
	dances.dialog.init([loadedFunction]);

没有指定, 一般都是自动初始化

_______*/

/*_______
# syntax
配置, 和实例化的配置

## 创建实例
	dances.dialog(opts);
 	dances.dialog(msg, opts);
 	dances.dialog(msg);

## 配置

	Object.keys(opts);
==>
	[
		"bAutoInit",

		"title",
		"content",


		"sClass",
		"sClassRoot",
		"sType",
		"bFollow",
		"nWidth",
		"nHeight",

		"fConfirm",
		"fCancel",
		"fClose",

		"nZ",
		"bMask",
		"boMaskConf",

		"bEsc",

		"oTemplate",
		"animate",
		"oAnimate"
	]

### bAutoInit
(可选)自动初始化
默认: true

### title
(可选)配置标题
可以接受的值: 字符, domEl, jQueryEl

### content
(可选) ,配置内容
可以接受的值: 字符, domEl, jQueryEl

### sClass
(可选), 添加指定 className
默认为 "dances-dialog-ui"

### sClassRoot
(可选)
向 dialog 最外层, 添加指定 className

### sType
(可选), 指定 dialog 类型
"alert" || "confirm" || "prompt"

### bFollow
(可选), 指定会话框跟随视口
默认为 false

### nWidth/nHeight
(可选), 指定 内容区的 尺寸
请注意: 是内容区域

### fConfirm
确认事件
当类型为 "alert" || "confirm" || "prompt", 用户点击 [确定]按钮, 触发此事件

监听函数中, this 指向 本实例

### fCancel
取消事件
当类型为 "confirm" || "prompt", 用户点击 [取消]按钮, 触发此事件

监听函数中, this 指向 本实例

### fClose
关闭事件
确认按钮, 取消按钮, 和关闭按钮 都能触发此事件

接受一个形参, 形参值的代表的意义:
	0 由关闭按钮传递
	true 由确认按钮传递
	false 由取消按钮传递

返回 false 可以阻止操作

### nZ
指定 z-index

### bMask
指定开启 遮罩
默认为 true

### boMaskConf
配置遮罩对象
具体内容请查看, dances.uMask API

### bEsc
按 sec 是否取消此层
默认为 true
TODO 测试, 多层显示的时候, esc 关闭的顺序

### oTemplate
配置模板

demo:

	oTemplate: {
		// 头部信息
		// 务必保留 .dsDialog-tie .dsDialog-close 挂钩, 否则导致不可预期的错误
		hdr:
			'<h2 class="dsDialog-tie"></h2> ' +
			'<a href="#" class="dsDialog-close" title="关闭"></a>',

		// 底部信息
		ftr:
			'somethingHTML in ftr'
	}

### animate
指定使用内置动画
目前仅有 "cool" - -!

### oAnimate
扩展动画

	oAnimate: {
		show: function(el){
			// el is equivalent to inst.$dialog
			// this is inst
		},

		hide: function(el){
			// el is equivalent to inst.$dialog
			// this is inst
		}
	}

_______*/

/*_______
# syntax
实例方法

## init(fn)
初始化实例(可自动)
除非配置 bAutoInit: false, 一般无需手动 初始化
(可选), 接受一个函数作为参数, 有点象异步编程.. 其实非也, 此函数内部 this 指向 本实例

## open(msg)
显示对话框

(可选), 接受一个 msg, 可修改内容
可以接受的值: 字符, domEl, jQueryEl

## close
隐藏对话框

## remove
清除实例

## content
设置或读取 对话框-主体内容 html

## title
设置或者读取 对话框-标题 html

## conf
### syntax
修改配置.

可修改的配置:


	inst.conf(opts)
	inst.conf("name", value)


## button()
// TODO 待完善需求逻辑

_______*/


/*_______
	inst property:
		.conf
			实例的配置对象,已经被过滤

		.dialogEl
			会话框最外层 HTML DOM 引用

		.$dialogInnerEl
			会话框 主体 jQuery 引用

		.$dialogCon
			会话框 主体内容 jQuery 引用

		.$dialogFtr
			会话框 主体底部 jQuery 引用

		.value
			若sType: prompt
			输入框的值

		.buttons
			// 暂时保留 buttons 扩展的数据

		.$iframe
			// ie7以下 保留对 iframe jQuery引用

		.$shadow
			// ie9以下 保留对 投影 jQuery引用

		.mask
			// 若开启遮罩, 保留 dances.uMask 实例的引用

_______*/


(function(exports, undefined){
	"use strict";

	var
		dances = window.dances,
		Dialog,
		dialog,

		dialogRepo,
		fClean,
		fCleanItem,

		zAioHandle,
		animateRepo,

		confAioHandle,

		DialogConf = {},
		fConf,
		fInit,
		bInit = false,
		fValidArgs,

		viewMaxWidth,
		fCen,
		fSize,

		ltIE7, ltIE8, ltIE9,

		$ = window.jQuery
	;

	var
		create = Object.create || (function(){

			var Foo = function(){ };

			return function(){

				if(arguments.length > 1){
					throw new Error('Object.create implementation only accepts the first parameter.');
				}

				var proto = arguments[0],
					type = typeof proto
					;

				if(!proto || ("object" !== type && "function" !== type)){
					throw new TypeError('TypeError: ' + proto + ' is not an object or null');
				}

				Foo.prototype = proto;

				return new Foo();
			}
		})(),

		uc = function(fn){
			return function(){
				return Function.prototype.call.apply(fn, arguments);
			}
		},

		slice = uc(Array.prototype.slice)

	;

	// 只能使用一次
	fConf = function(conf){

		fValidArgs(conf || {}, {
			// requireType
			baseJquery: "function",
			bAutoInit: "boolean"
		}, {
			// defaultValue
			baseJquery: window.jQuery,
			bAutoInit : true
		});

		DialogConf = conf;

		$ = conf.baseJquery;

		fConf = function(){
			return this;
		};

		return this;
	};

	fInit = function(foo){
		var linkEl;

		linkEl = dances.addCss(
			".dsDialog{" +
				"top:50%;" +
				"left:50%;" +
				"z-index:550;" +
				"position:absolute;" +
				"background-color:#FFF;" +
				"font:12px/2 Arial;" +
				"*zoom:1" +
			"}" +

			".dsDialog-inner{" +
				"position:relative;z-index:10;*zoom:1" +
			"}" +

			".dsDialog-follow{" +
				"position:fixed;" +
				"_position:absolute;" +
				"_bottom:auto;" +
				"_top:expression(eval(document.documentElement.scrollTop+(document.documentElement.clientHeight || document.body.clientHeight)/2)-parseInt(this.offsetHeight / 2))" +
			"}" +

			".dsDialog-hdr{" +
				"position:relative;" +
				"*position:static;" +
				"_position:relative;" +
				"_zoom:1" +
			"}" +

			".dsDialog-close{" +
				"position:absolute;" +
				"top:50%;" +
				"*top:1em;" +
				"_top:50%;" +
				"right:.5em" +
			"}" +

			".dsDialog-fixSelectCover{" +
				"position:absolute;" +
				"top:0;" +
				"left:0;" +
				"z-index:-1;" +
				"width:100%;" +
				"border:0" +
			"}" +

			".dsDialog-shadow{" +
				"width:100%;" +
				"height:100%;" +
				"*zoom:1;" +
				"position:absolute;" +
				"z-index:5;" +
				"top:5px;" +
				"left:5px" +
			"}" +

			":root .dsDialog-shadow{" +
				"filter:progid:DXImageTransform.Microsoft.Gradient(GradientType = 0,StartColorStr = '#00000000',EndColorStr = '#00000000')" +
			"}"
		);

		// 获取视口大小
		viewMaxWidth = (dances.getViewSize() && dances.getViewSize().width) || 1080;

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

		// 设置实例尺寸集合
		fSize = function(inst){
			var conf = inst.conf,

				width,
				width2,
				nPadding = 0,

				_$Tem
				;

			conf.nWidth && inst.$dialogCon.css({
				width: conf.nWidth
			});

			conf.nHeight && inst.$dialogCon.css({
				height: conf.nHeight
			});

			// hack ie7- with "width"
			// 设定未定义尺寸的 行内元素的宽度
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
			if(ltIE7 && conf.nWidth){
				nPadding = parseInt(dances.ss(inst.$dialogCon[0], "paddingRight"), 10) + parseInt(dances.ss(inst.$dialogCon[0], "paddingLeft"), 10);
				nPadding = isNaN(nPadding) ? 0 : nPadding;
				width = conf.nWidth + nPadding;

				inst.$dialogInner.css({
					width: width
				});
			}

			return inst;
		};

		dialogRepo = [];

		// 清除实例
		fClean = function(inst){
			var
				arr = dialogRepo,
				num = arr.length,

				bForce
			;

			// 指定清除 实例
			if(Dialog.isPrototypeOf(inst)){

				while(num--){
					if(arr[num] === inst){
						arr.splice(num, 1);
						fCleanItem(inst);
						break;
					}
				}

			// 全局清空
			}else{

				bForce = inst === true;

				while(num--){

					inst = arr[num];

					// 是否强制删除
					if(bForce || !inst.bShow){

						// 脱离应用池
						arr.splice(num, 1);

						fCleanItem(inst);
					}

				}

			}

			inst = null;

		};

		fCleanItem = function(inst){
			var
				conf,
				prop
			;

			// 解除事件绑定
			inst.$dialog.off().remove();

			inst.mask && inst.mask.remove();

			conf = inst.conf;

			for(prop in inst){
				if(inst.hasOwnProperty(prop)){
					inst[prop] = null;
				}
			}

			for(prop in conf){
				if(conf.hasOwnProperty(prop)){
					conf[prop] = null;
				}
			}

			conf = null;

		};

		// 控制 showZ
		zAioHandle = (function(){
			var instOpenArr = [],

				nMaxZ = 1055,

				addItem,
				hasItem,
				delItem,
				getMaxItem,

				fzIndex
			;

			hasItem = function(inst){
				var
					arr = instOpenArr,
					num = arr.length
				;

				while(num--){
					if(inst === arr[num]){
						return true;
					}
				}

				return false;

			};

			addItem = function(inst){
				// 嗅探是否调整 zIndex
				if(instOpenArr.length > 0 && inst.dialogEl.style.zIndex <= nMaxZ){
					fzIndex(inst);
				}

				instOpenArr.push(inst);
			};

			delItem = function(inst){
				var
					arr = instOpenArr,
					num = arr.length
				;

				while(num--){
					if(inst === arr[num]){
						instOpenArr.splice(num, 1);
						break;
					}
				}

			};

			getMaxItem = function(){
				var num = instOpenArr.length,
					itemMax,

					max = 0,
					maxInst
				;

				while(num--){
					itemMax = instOpenArr[num].dialogEl.style.zIndex;
					if(itemMax > max){
						max = itemMax;
						maxInst = instOpenArr[num];
					}
				}

				return maxInst;

			};

			fzIndex = function(inst){
				nMaxZ += 10;
				inst.dialogEl.style.zIndex = nMaxZ;
				inst.mask && (inst.mask.maskEl.style.zIndex = nMaxZ - 5);

			};

			// extend ESC
			$(document)
				.on("keyup", function(e){
					var itemInst;
					if(27 === e.keyCode && instOpenArr.length > 0){
						itemInst = getMaxItem();
						itemInst && itemInst.bEsc && itemInst.close();
					}
				})
			;

			return {

				withOpen: function(inst){
					!hasItem(inst) && addItem(inst);

				},

				withClose: function(inst){
					hasItem(inst) && delItem(inst);

				},

				// 赋值取值器
				withIndex: function(n){
					return (nMaxZ = nMaxZ > n ? nMaxZ : n);
				}
			};

		})();

		animateRepo = {
			def : {
				show: function(el){
					$(el).show();
				},

				hide: function(el){
					$(el).hide();
				}
			},

			cool:{
				show: function(el){
					$(el).show(750);
				},

				hide: function(el){
					$(el).hide(250);
				}
			},

			beta: {
				beforeShow: function(el){
				},

				show: function(el, dataUI, dateBeforeShow){
					var w = dataUI.width,
						h = dataUI.height,

						_this = this
					;

					this.$dialogInner.css({
						overflow: "hidden"
					});

					$(el)
						.css({
							width : 50,
							height: h,
							overflow: "hidden"
						})
						.show()
						.animate({
							width: w
						}, {
							complete: function(){
								$(this).css({
									width : "auto",
									height: "auto",
									overflow: "visible"
								});

								_this.$dialogInner.css({
									overflow: "visible"
								});
							},

							duration: 750
						}
					)
					;
				},

				hide: function(el){
					$(el).hide(250);
				}
			}
		};

		bInit = true;

		fInit = function(foo){
			"function" === typeof foo && foo();
			return this;
		};

		"function" === typeof foo && foo();

		return this;
	};

	fValidArgs = function(conf, requireType, defaultConf){
		var fType = dances.type
		;

		for(var prop in requireType){
			// 可配置参数
			if(requireType.hasOwnProperty(prop)){

				// 不符合的必须配置参数
				if(!conf.hasOwnProperty(prop) || requireType[prop].indexOf(fType(conf[prop])) === -1){
					// 必须配置参数 有推荐值
					if(defaultConf.hasOwnProperty(prop)){
						conf[prop] = defaultConf[prop];

						// 必须配置参数 没有推荐值
					}else{
						conf[prop] = null;
					}
				}
			}
		}

		return conf;
	};

	Dialog = {

		init: function(foo){
			var
				args = slice(this.conf),

				conf,
				_content,

				$html,

				$dialogCon,

				$dialogFtr,

				_this = this
			;

			conf = args.pop();

			if("[object Object]" === Object.prototype.toString.call(conf) && !conf.nodeType){
				_content = args.pop();

			}else{
				_content = conf;
				conf = {};
			}

			// 验证参数
			this.conf = fValidArgs(conf, {
				// require Type

				title     : "string,element",
				content   : "string,element",
				sType     : "string",

				bFollow   : "boolean",
				bMask     : "boolean",
				oMaskConf : "object",

				sClass    : "string",
				sClassRoot: "string",

				bEsc      : "boolean",

				nWidth    : "number",
				nHeight   : "number",

				nZ        : "number",

				fConfirm  : "function",
				fCancel   : "function",
				fClose    : "function",

				oTemplate : "object",

				animate   : "string",
				oAnimate  : "object"

			}, {
				// default Value

				title    : "提示",
				bFollow  : false,
				bMask    : true,
				nZ       : 1055,
				sClass   : "dances-dialog-ui",
				bEsc     : true,

				oMaskConf: {
					// z-index
					nZ      : 1050,

					// 透明度,取值范围:0~1
					nOpacity: 0.5
				},

				oTemplate: {}
			});

//	创造 html 实体_______

			$html = $(
				'<div class="dsDialog">' +
					'<div class="dsDialog-inner">' +
						'<div class="dsDialog-hdr">' +
							(conf.oTemplate.hdr ?
								conf.oTemplate.hdr :
								'<h2 class="dsDialog-tie"></h2>' +
								'<a href="#" class="dsDialog-close" title="关闭"></a>'
							) +
						'</div> ' +
						'<div class="dsDialog-con tac"></div>' +
							(conf.oTemplate.ftr ?
								conf.oTemplate.ftr :
								'<div class="dsDialog-ftr"></div>'
							) +
							' <!--[if lt IE 7]>' +
								'<iframe class="dsDialog-fixSelectCover" frameborder="0">$nbsp;</iframe>' +
							'<![endif]-->' +
					'</div>' +
					'<!--[if lt IE 9]><div class="dsDialog-shadow"></div><![endif]-->' +
				'</div>'
			);

			this.$dialog =
				// 隐藏节点,避免性能损失
				$html
					.hide()
					.appendTo("body")
					.css("z-index", conf.nZ)
			;

			// 设置: 标题 和 内容
			$html.find(".dsDialog-tie").append(conf.title);

			// sClassRoot
			conf.sClassRoot && $html.addClass(conf.sClassRoot);

			// follow
			conf.bFollow && $html.addClass("dsDialog-follow");

			// 保存 dom/jquery 实例引用
			this.dialogEl = $html[0];
			this.$dialogInner = $html.find(".dsDialog-inner");

			this.$dialogCon =
				$dialogCon =
					$html.find(".dsDialog-con").addClass(conf.sClass)
			;

			this.$dialogFtr =
				$dialogFtr =
					$html.find(".dsDialog-ftr")
			;

			// 置入 内容..
			$dialogCon.append(_content || conf.content || "");

			// 依据类型, 创建 btn结构
			if(/alert|confirm|prompt/.test(conf.sType)){
				$dialogFtr.append(
					'<input type="button" value="确认" class="dsDialog-btn dsDialog-btn-confirm">' +
					'<input type="button" value="取消" class="dsDialog-btn dsDialog-btn-cancel">'
				);
				this.setConf("sType", conf.sType);
			}


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

//	绑定事件_______

			// evt
			// 绑定关闭
			$html
				.on("click", ".dsDialog-close", function(){
					// 关闭按钮 向实例 .close()方法 传入0
					_this.close(0);
					return false;
				})
			;

			// 嗅探最大宽度
			conf.nWidth && (conf.nWidth = conf.nWidth < viewMaxWidth ? conf.nWidth : viewMaxWidth);
			fSize(this);

			// ie7-- 需要记住变量
			ltIE7 && (this.$iframe = _this.$dialog.find(".dsDialog-fixSelectCover"));

			ltIE9 && (this.$shadow = _this.$dialog.find(".dsDialog-shadow"));

			// 初始化 dances.uMask
			conf.bMask && (this.mask = dances.uMask(conf.oMaskConf));

			// save esc
			this.bEsc = conf.bEsc;

			// save animate
			var animate;
			this.animate = animate = conf.animate;

			if(animateRepo.hasOwnProperty(animate)){
				this.showAnimate = animateRepo[animate].show;
				this.hideAnimate = animateRepo[animate].hide;
				"function" === typeof animateRepo[animate].beforeShow && (this.evtForeShow = animateRepo[animate].beforeShow);
			}

			if(conf.oAnimate){
				if("function" === typeof conf.oAnimate.show){
					this.showAnimate = conf.oAnimate.show
				}

				if("function" === typeof conf.oAnimate.hide){
					this.hideAnimate = conf.oAnimate.hide
				}

				if("function" === typeof conf.oAnimate.beforeShow){
					this.evtForeShow = conf.oAnimate.beforeShow
				}
			}

			// push 实例池
			dialogRepo.push(this);

			this.bInit = true;

			"function" === typeof foo && foo.call(this, this);

			// 重载实例 init 方法
			this.init = function(foo){
				"function" === typeof foo && foo.call(this, this);
				return this;
			};

			return this;
		},

		open: function(msg){
			!this.bInit && this.init();

			var
				conf = this.conf,
				_width,
				_height,
				nTop,

				nPadding,
				_this = this,

				dataUI,
				dataInterface,

				$dialog = this.$dialog
			;

			if(!this.bShow){

				// detect to change Content Msg
				msg && this.content(msg);

				this.mask && this.mask.show();
				this.$dialog.show();
				zAioHandle.withOpen(this);

				this.showAnimate && (dataUI = {
					width : $dialog.width(),
					height: $dialog.height(),
					top   : $dialog.css("top"),
					left  : $dialog.css("left")
				});

				"function" === typeof  this.evtForeShow && (dataInterface = this.evtForeShow.call(this, $dialog[0]));

				// 非 bFollow 模式 定义高度
				if(!conf.bFollow){
					nTop =
						Math.max(document.documentElement.scrollTop, document.body.scrollTop) +
							(dances.getViewSize().height - this.$dialog.outerHeight()) / 2
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

					if(ltIE7){
						setTimeout(function(){

							// 设置 fixSelectCover 尺寸
							_this.$iframe.css({
								width : _width,
								height: _height
							});

							nPadding = parseInt(dances.ss(_this.$dialogCon[0], "paddingRight"), 10) + parseInt(dances.ss(_this.$dialogCon[0], "paddingLeft"), 10);
							nPadding = isNaN(nPadding) ? 0 : nPadding;
							_width = conf.nWidth + nPadding;

							_this.$dialogInner.css({
								width: _width
							});

						}, 0);
					}
				}

				// 居中化
				fCen(this);

				this.showAnimate && $dialog.hide();

				// 动画函数
				this.showAnimate && this.showAnimate.call(this, $dialog, dataUI, dataInterface);

				this.bShow = true;
			}

			return this;
		},

		close: function(flag){
			/*
			 flag
				0 由关闭按钮传递
			 	true 由确认按钮传递
			 	false 由取消按钮传递

			 */
			var conf = this.conf;

			if(this.bShow){
				if("function" !== typeof conf.fClose || false !== conf.fClose.call(this, flag)){
					zAioHandle.withClose(this);
					this.mask && this.mask.hide();

					// 动画函数
					this.hideAnimate ?
						this.hideAnimate.call(this, this.$dialog):
						this.$dialog.hide()
					;

					this.bShow = false;
				}
			}

			return this;
		},

		remove: function(){
			fClean(this.close());
		},

		content: function(info){

			// setter
			if(info){
				if("function" === typeof info){
					this.$dialogCon.html(info(this.$dialogCon.html()));
				}else{
					this.$dialogCon.empty().append(info);
				}

				return this;

			// getter
			}else{

				return this.$dialogCon.html();
			}

		},

		title: function(data){

			// setter
			if(data){
				if("function" === typeof data){
					this.$dialog.find(".dsDialog-tie").html(data(this.$dialogCon.html()));

				}else{
					this.$dialog.find(".dsDialog-tie").empty().append(data);
				}
				return this;

			// getter
			}else{
				return this.$dialog.find(".dsDialog-tie").html();
			}
		},

		index: function(n){
			n = parseInt(n, 10);

			if(!isNaN(n)){

				this.dialogEl.style.zIndex = n;

				// TODO dances.uMask.js 提供 返回实例本体的方法
				this.mask && (this.mask.maskEl.style.zIndex = n - 5);

				zAioHandle.withIndex(n);
			}

			return this;
		},

		getInstEl: function(){
			return this.dialogEl;
		},

		button: function(data){
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
					$btnEl.attr("disabled", "disabled").addClass("dsDialog-btn-disable");

				}else if(btnData.disabled){

					btnData.disabled = data.disabled;
					$btnEl.removeAttr("disabled").removeClass("dsDialog-btn-disable");

				}

				// btn callback
				if("function" === typeof data.callback){
					btnData.callback = data.callback;
					$btnEl.unbind().bind("click", data.callback);
				}
			}else{
				if(data.hasOwnProperty("value")){
					$newItem = $('<input type="button" class="dsDialog-btn" value="' + data.value + '">')
						.bind("click", (
						"function" === typeof data.callback ?
							data.callback :
							function(){ }
						))
						.appendTo(_this.$dialog.find(".dsDialog-ftr"))
					;
					if(data.disabled){
						$newItem.attr("disabled", "disabled").addClass("dsDialog-btn-disable");
					}
					if(data.id){
						_this.buttons[data.id] = [data, $newItem];
					}
				}
			}

			return fCen(fSize(this));
		},

		setConf: function(){
			var
				args = slice(arguments),
				conf = args.shift()
			;

			if("[object Object]" === Object.prototype.toString.call(conf)){
				for(var prop in conf){
					if(conf.hasOwnProperty(prop) && confAioHandle.hasOwnProperty(prop)){
						confAioHandle[prop].call(this, conf[prop]);
					}
				}

			}else{
				if(confAioHandle.hasOwnProperty(conf)){
					confAioHandle[conf].call(this, args.shift());
				}

			}

			return this;
		}

	};

	dialog = function(){
		var
			iDialog = create(Dialog),
			conf = arguments[arguments.length - 1]
		;

		// checkAuto Init klass
		!bInit || false !== DialogConf.bAutoInit && fInit();

		// 保存"粗配置", 因为可以手动初始化
		iDialog.conf = arguments;

		// checkAuto Init inst
		conf && false !== conf.bAutoInit && iDialog.init();

		return iDialog;
	};

	confAioHandle = {
		sType: function(type){
			var
				$el = this.$dialogFtr,
				conf = this.conf,

				_this = this
			;

			type = type.toLowerCase();

			this.$dialog
				.off("click", ".dsDialog-btn-confirm")
				.off("click", ".dsDialog-btn-cancel")
				.on("change blur", ".dsDialog-inputText")
			;

			if(/alert|confirm|prompt/.test(type)){
				this.$dialog
					.on("click", ".dsDialog-btn-confirm", function(){
						if("function" !== typeof conf.fConfirm || false !== conf.fConfirm.call(_this, _this.value)){
							_this.close(true);
						}
					})
					.on("click", ".dsDialog-btn-cancel", function(){
						if("function" !== typeof conf.fCancel || false !== conf.fCancel.call(_this, _this.value)){
							_this.close(false);
						}
					})
				;

				$el.find(".dsDialog-btn").show();
				"alert" === type && $el.find(".dsDialog-btn-confirm").hide();

				this.$dialogFtr.show();

			}else{

				$el.find(".dsDialog-btn").hide();
				!conf.buttons && this.$dialogFtr.hide();

			}

			if("prompt" === type){
				this.$dialog.on("change blur", ".dsDialog-inputText", function(){
					_this.value = this.value;
				});

				this.$dialogCon.append(
					'<input type="text" class="dsDialog-inputText mt5">'
				);

				// TODO 设置状态标志
			}else{

			}

		}
	};

	// 公开 初始化方法
	dialog.init = fInit;

	// 公开 初始化配置方法
	dialog.conf = fConf;

	// 清理
	dialog.clean = function(){
		fClean.apply(dialog, arguments);
	};

	// 公开 Dialog 类
	dialog.Dialog = Dialog;

	exports.dialog = dialog;

	// AMD apply
	"function" === typeof window.define && define.amd && define.amd.dancesDialog && define(function(){
		return dialog;
	});

})(window.dances);
