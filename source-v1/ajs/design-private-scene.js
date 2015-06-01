function FDsPrivateSceneCanvasToolBar(o){
   o = RClass.inherits(this, o, FDsSceneCanvasToolBar);
   o._frameName = 'resource.private.scene.CanvasToolBar';
   return o;
}
function FDsPrivateSceneCatalogToolBar(o){
   o = RClass.inherits(this, o, FDsSceneCatalogToolBar);
   o._frameName = 'resource.private.scene.CatalogToolBar';
   return o;
}
function FDsPrivateSceneFrameSet(o){
   o = RClass.inherits(this, o, FDsSceneFrameSet);
   o._frameName = 'resource.private.scene.FrameSet';
   o.onBuilded  = FDsPrivateSceneFrameSet_onBuilded;
   return o;
}
function FDsPrivateSceneFrameSet_onBuilded(event){
   var o = this;
   o.__base.FDsSceneFrameSet.onBuilded.call(o, event);
   var toolbar = o._catalogToolbar = RClass.create(FDsPrivateSceneCatalogToolBar);
   toolbar._frameSet = o;
   toolbar.buildDefine(event);
   o._frameCatalogToolBar.push(toolbar);
   var catalog = o._catalogContent = RClass.create(FDsSceneCatalogContent);
   catalog._frameSet = o;
   catalog.build(event);
   catalog.addSelectedListener(o, o.onCatalogSelected);
   o._frameCatalogContent.push(catalog);
   var toolbar = o._canvasToolBar = RClass.create(FDsPrivateSceneCanvasToolBar);
   toolbar._frameSet = o;
   toolbar.buildDefine(event);
   o._frameCanvasToolBar.push(toolbar);
   var canvas = o._canvasContent = RClass.create(FDsSceneCanvasContent);
   canvas._frameSet = o;
   canvas._toolbar = o._canvasToolbar;
   canvas._hParent = o._frameCanvasContent._hPanel;
   canvas._hParent.style.backgroundColor = '#333333';
   canvas._hParent.style.scroll = 'auto';
   canvas.addLoadListener(o, o.onDataLoaded);
   canvas.build(event);
   o._frameCanvasContent.push(canvas);
   var toolbar = o._propertyToolbar = RClass.create(FDsScenePropertyToolBar);
   toolbar._frameSet = o;
   toolbar.buildDefine(event);
   o._framePropertyToolBar.push(toolbar);
}
function FDsPrivateSceneMenuBar(o){
   o = RClass.inherits(this, o, FDsSceneMenuBar);
   o._frameName = 'resource.private.scene.MenuBar';
   o.onBuilded  = FDsPrivateSceneMenuBar_onBuilded;
   return o;
}
function FDsPrivateSceneMenuBar_onBuilded(p){
   var o = this;
   o.__base.FDsSceneMenuBar.onBuilded.call(o, p);
   o._controlSave.addClickListener(o, o.onSaveClick);
   o._controlCapture.addClickListener(o, o.onCaptureClick);
   o._controlCreateLayer.addClickListener(o, o.onCreateLayerClick);
   o._controlImportTemplate.addClickListener(o, o.onImportTemplateClick);
   o._controlExecute.addClickListener(o, o.onExecuteClick);
}