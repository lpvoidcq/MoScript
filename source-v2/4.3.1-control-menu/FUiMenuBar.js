//==========================================================
// <T>菜单栏。</T>
//
// @class
// @author maocy
// @history 150121
//==========================================================
function FUiMenuBar(o){
   o = RClass.inherits(this, o, FContainer);
   //..........................................................
   // @style
   o._stylePanel      = RClass.register(o, new AStyle('_stylePanel', 'Panel'));
   //..........................................................
   // @html
   o._hLine            = null;
   //..........................................................
   // @event
   o.onBuildPanel = FUiMenuBar_onBuildPanel
   //..........................................................
   // @attribute
   o.onBuild          = FUiMenuBar_onBuild;
   //..........................................................
   // @method
   o.appendButton     = FUiMenuBar_appendButton;



   //..........................................................
   // @attribute
   //o.service         = 'menu.xml';
   //o.focusNode       = null;
   //o.isLoading       = false;
   //o.indent          = 16;
   //o.nodes           = new TList();
   //o.allNodes        = new TList();
   //o.types           = new TMap();
   //..........................................................
   // @event
   //o.onNodeLoaded    = null;
   //o.onNodeClick     = null;
   //o.onNodeDblClick  = null;
   //o.onLoaded        = FUiMenuBar_onLoaded;
   //..........................................................
   // @method
   //o.connect         = FUiMenuBar_connect;
   //o.release         = FUiMenuBar_release;
   //o.dispose         = FUiMenuBar_dispose;
   return this;
}

//==========================================================
// <T>创建一个控件容器。</T>
//
// @method
// @return HtmlTag 页面元素
//==========================================================
function FUiMenuBar_onBuildPanel(e){
   var o = this;
   var hc = o._hPanel = RBuilder.createTable(e.hDocument, o.styleName('Panel'));
   o._hLine = RBuilder.appendTableRow(hc);
}

//==========================================================
// <T>追加一个按键控件。</T>
//
// @method
// @param p:button:FUiMenuButton 按键
//==========================================================
function FUiMenuBar_appendButton(p){
   var o = this;
   // 横向排布
   var hr = o._hLine;
   var hc = RBuilder.appendTableCell(hr);
   p.setPanel(hc);
}






// ------------------------------------------------------------
function FUiMenuBar_onBuild(builder){
   var doc = builder.document;
   // Bodu
   this.hBody = doc.createDiv();
   this.hBody.className = 'menu_panel';
   // Build
   this.hParent.insertBefore(this.hBody);
   // Complete
   builder.hParent = this.hBody;
}
// ------------------------------------------------------------
function FUiMenuBar_onLoaded(cnn){
   var doc = cnn.document;
   if(doc && doc.node){
      IControl.load(this, doc.node);
      this.build();
   }
}
// ------------------------------------------------------------
function FUiMenuBar_dispose(){
   var o = this;
   o.base.FControl.dispose.call(o);
   RMemory.freeHtml(o.hBody);
   RMemory.freeHtml(o.hParent);
   o.hBody = null;
   o.hParent = null;
}
// ------------------------------------------------------------
function FUiMenuBar_connect(type, action, attrs){
   // Build send info
   var doc = new TXmlDocument();
   var root = doc.root();
   root.set('type', type);
   root.set('action', action);
   root.create('Attributes').value = attrs;
   // Build xml connection
   var self = this;
   var cnn = new TXmlCnn();
   cnn.onLoad = function(){self.onLoaded(cnn)};
   cnn.send(this.service, doc);
}
// ------------------------------------------------------------
function FUiMenuBar_release(){
   var nodes = this.allNodes;
   for(var n=0; n<nodes.length; n++){
      var node = nodes[n];
      node.release();
   }
   this.allNodes = null;
   this.allNodesUuid = null;
   this.allNodesProperty = null;
   this.allNodesPropertyExtend = null;
   this.nodes = null;
   return true;
}
// ------------------------------------------------------------