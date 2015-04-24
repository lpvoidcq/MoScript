//==========================================================
// <T>私有模型框架。</T>
//
// @author maocy
// @history 150121
//==========================================================
function FDsPrivateModelFrameSet(o){
   o = RClass.inherits(this, o, FDsModelFrameSet);
   //..........................................................
   // @property
   o._frameName = 'resource.private.model.FrameSet';
   //..........................................................
   // @process
   o.onBuilded  = FDsPrivateModelFrameSet_onBuilded;
   return o;
}

//==========================================================
// <T>构建完成处理。</T>
//
// @method
// @param event:TEventProcess 事件处理
//==========================================================
function FDsPrivateModelFrameSet_onBuilded(event){
   var o = this;
   o.__base.FDsModelFrameSet.onBuilded.call(o, event);
   //..........................................................
   // 设置目录工具栏
   var toolbar = o._catalogToolbar = RClass.create(FDsPrivateModelCatalogToolBar);
   toolbar._frameSet = o;
   toolbar.buildDefine(event);
   o._frameCatalogToolBar.push(toolbar);
   // 设置目录栏
   var catalog = o._catalogContent = RClass.create(FDsPrivateModelCatalogContent);
   catalog._frameSet = o;
   catalog.build(event);
   catalog.addSelectedListener(o, o.onCatalogSelected);
   o._frameCatalogContent.push(catalog);
   //..........................................................
   // 设置画板工具栏
   var toolbar = o._canvasToolbar = RClass.create(FDsPrivateModelCanvasToolBar);
   toolbar._frameSet = o;
   toolbar.buildDefine(event);
   o._frameCanvasToolBar.push(toolbar);
   // 设置画板
   var canvas = o._canvasContent = RClass.create(FDsPrivateModelCanvasContent);
   canvas._frameSet = o;
   canvas._toolbar = o._canvasToolbar;
   canvas._hParent = o._frameCanvasContent._hPanel;
   canvas._hParent.style.backgroundColor = '#333333';
   canvas._hParent.style.scroll = 'auto';
   canvas.addLoadListener(o, o.onDataLoaded);
   canvas.build(event);
   o._frameCanvasContent.push(canvas);
}