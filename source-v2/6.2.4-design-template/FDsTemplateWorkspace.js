//==========================================================
// <T>模板工作区域。</T>
//
// @author maocy
// @history 150121
//==========================================================
function FDsTemplateWorkspace(o){
   o = RClass.inherits(this, o, FWorkspace);
   //..........................................................
   // @style
   o._styleToolbarGround   = RClass.register(o, new AStyle('_styleToolbarGround', 'Toolbar_Ground'));
   o._styleStatusbarGround = RClass.register(o, new AStyle('_styleStatusbarGround', 'Statusbar_Ground'));
   o._styleCatalogGround   = RClass.register(o, new AStyle('_styleCatalogGround', 'Catalog_Ground'));
   o._styleWorkspaceGround = RClass.register(o, new AStyle('_styleWorkspaceGround', 'Workspace_Ground'));
   o._stylePropertyGround  = RClass.register(o, new AStyle('_stylePropertyGround', 'Property_Ground'));
   //..........................................................
   // @attribute
   o._framesetMain         = null;
   o._framesetBody         = null;
   // @attribute
   o._frameToolBar         = null;
   o._frameBody            = null;
   o._frameProperty        = null;
   // @attribute
   o._frameCatalog         = null;
   o._frameWorkspace       = null;
   o._frameStatusBar       = null;
   //..........................................................
   // @process
   o.onBuild               = FDsTemplateWorkspace_onBuild;
   o.onTemplateLoad        = FDsTemplateWorkspace_onTemplateLoad;
   //..........................................................
   // @method
   o.construct             = FDsTemplateWorkspace_construct;
   // @method
   o.loadTemplate          = FDsTemplateWorkspace_loadTemplate;
   // @method
   o.dispose               = FDsTemplateWorkspace_dispose;
   return o;
}

//==========================================================
// <T>建立当前控件的显示框架。</T>
//
// @method
// @param p:event:TEventProcess 事件处理
//==========================================================
function FDsTemplateWorkspace_onBuild(p){
   var o = this;
   o.__base.FWorkspace.onBuild.call(o, p);
   o._hPanel.style.width = '100%';
   o._hPanel.style.height = '100%';
   // 建立主框架
   var fs = o._framesetMain = RClass.create(FFrameSet);
   fs.build(p);
   // 建立工具区
   var f = o._frameToolBar = RClass.create(FFrame);
   f.setHeight(26);
   f.build(p);
   f._hPanel.className = o.styleName('Toolbar_Ground');
   fs.appendFrame(f);
   // 建立内容区
   var f = o._frameBody = RClass.create(FFrame);
   f.build(p);
   fs.appendFrame(f);
   // 建立状态区
   var f = o._frameStatusBar = RClass.create(FFrame);
   f.setHeight(18);
   f.build(p);
   f._hPanel.className = o.styleName('Statusbar_Ground');
   fs.appendFrame(f);
   fs.setPanel(o._hPanel);
   //..........................................................
   // 建立内容框架
   var fs = RClass.create(FFrameSet);
   fs._directionCd = EDirection.Horizontal;
   fs.build(p);
   // 建立目录区
   var f = o._frameCatalog = RClass.create(FFrame);
   f.setWidth(300);
   f.build(p);
   f._hPanel.className = o.styleName('Catalog_Ground');
   fs.appendFrame(f);
   // 建立分割符
   var sp1 = fs.appendSpliter();
   // 建立工作区
   var f = o._frameWorkspace = RClass.create(FFrame);
   f.build(p);
   f._hPanel.className = o.styleName('Workspace_Ground');
   fs.appendFrame(f);
   // 建立分割符
   var sp2 = fs.appendSpliter();
   // 建立属性区
   var f = o._frameProperty = RClass.create(FFrame);
   f.setWidth(240);
   f.build(p);
   f._hPanel.className = o.styleName('Property_Ground');
   fs.appendFrame(f);
   fs.setPanel(o._frameBody._hPanel);
   // 设置分割
   sp1._alignCd = EAlign.Left;
   sp1._hSize = o._frameCatalog._hPanel;
   sp2._alignCd = EAlign.Right;
   sp2._hSize = o._frameStatusBar._hPanel;
   //..........................................................
   var c = o._catalog = RClass.create(FDsTemplateCatalog);
   c._worksapce = o;
   c.build(p);
   c.setPanel(o._frameCatalog._hPanel);
   o.push(c);
   //..........................................................
   var c = o._toolbar = RClass.create(FDsTemplateToolBar);
   c._worksapce = o;
   c.build(p);
   c.setPanel(o._frameToolBar._hPanel);
   o.push(c);
   //..........................................................
   var c = o._canvas = RClass.create(FDsTemplateCanvas);
   c.addLoadListener(o, o.onTemplateLoad);
   c._worksapce = o;
   c.build(p);
   c.setPanel(o._frameWorkspace._hPanel);
   o.push(c);
   //..........................................................
   var c = o._materialFrame = RClass.create(FDsTemplateMaterialFrame);
   c._worksapce = o;
   c.buildConfig(p);
   c.setPanel(o._frameProperty._hPanel);
}

//==========================================================
// <T>加载模板处理。</T>
//
// @method
// @param p:template:FTemplate3d 模板
//==========================================================
function FDsTemplateWorkspace_onTemplateLoad(p){
   var o = this;
   // 加载完成
   o._catalog.buildTemplate(p._activeTemplate);
   var t = p._activeTemplate;
   var rt = t._resource;
   var rtm = rt._themes.get(0);
   var rm = rtm.materials().value(0);
   o._materialFrame.loadMaterial(rm);
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FDsTemplateWorkspace_construct(){
   var o = this;
   // 父处理
   o.__base.FWorkspace.construct.call(o);
}

//==========================================================
// <T>加载模板处理。</T>
//
// @method
//==========================================================
function FDsTemplateWorkspace_loadTemplate(p){
   var o = this;
   o._canvas.loadTemplate(p);
}

//==========================================================
// <T>释放处理。</T>
//
// @method
//==========================================================
function FDsTemplateWorkspace_dispose(){
   var o = this;
   // 父处理
   o.__base.FWorkspace.dispose.call(o);
}
