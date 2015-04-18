//==========================================================
// <T>场景画板工具栏。</T>
//
// @class
// @author maocy
// @history 150210
//==========================================================
function FDsSceneCanvasToolBar(o){
   o = RClass.inherits(this, o, FUiToolBar);
   //..........................................................
   // @property
   o._frameName         = 'resource.scene.CanvasToolBar';
   //..........................................................
   // @attribute
   o._canvasModeCd      = EDsCanvasMode.Drop;
   // @attribute
   o._controlModeDrop   = null;
   o._controlModeSelect = null;
   o._controlTranslate  = null;
   o._controlRotation   = null;
   o._controlScale      = null;
   o._controlLookFront  = null;
   o._controlLookUp     = null;
   o._controlLookLeft   = null;
   o._controlPlay       = null;
   o._controlView       = null;
   //..........................................................
   // @event
   o.onBuilded         = FDsSceneCanvasToolBar_onBuilded;
   // @event
   o.onModeClick       = FDsSceneCanvasToolBar_onModeClick;
   o.onLookClick       = FDsSceneCanvasToolBar_onLookClick;
   o.onPlayClick       = FDsSceneCanvasToolBar_onPlayClick;
   o.onRotationClick   = FDsSceneCanvasToolBar_onRotationClick;
   //..........................................................
   // @method
   o.construct         = FDsSceneCanvasToolBar_construct;
   // @method
   o.dispose           = FDsSceneCanvasToolBar_dispose;
   return o;
}

//==========================================================
// <T>构建完成处理。</T>
//
// @method
// @param p:event:TEventProcess 事件处理
//==========================================================
function FDsSceneCanvasToolBar_onBuilded(p){
   var o = this;
   o.__base.FUiToolBar.onBuilded.call(o, p);
   //..........................................................
   // 建立拖拽按键
   var button = o._controlModeDrop;
   button._canvasModeCd = EDsCanvasMode.Drop;
   button.addClickListener(o, o.onModeClick);
   button.check(true);
   // 建立选择按键
   var button = o._controlModeSelect;
   button._canvasModeCd = EDsCanvasMode.Select;
   button.addClickListener(o, o.onModeClick);
   //..........................................................
   // 建立移动按键
   var button = o._controlTranslate;
   button._canvasModeCd = EDsCanvasMode.Translate;
   button.addClickListener(o, o.onModeClick);
   // 建立旋转按键
   var button = o._controlRotation;
   button._canvasModeCd = EDsCanvasMode.Rotation;
   button.addClickListener(o, o.onModeClick);
   // 建立缩放按键
   var button = o._controlScale;
   button._canvasModeCd = EDsCanvasMode.Scale;
   button.addClickListener(o, o.onModeClick);
   //..........................................................
   // 关联视角事件
   o._controlLookFront.addClickListener(o, o.onLookClick);
   o._controlLookUp.addClickListener(o, o.onLookClick);
   o._controlLookLeft.addClickListener(o, o.onLookClick);
   //..........................................................
   // 关联事件
   o._controlPlay.addClickListener(o, o.onPlayClick);
   o._controlView.addClickListener(o, o.onRotationClick);
}

//==========================================================
// <T>模式选择。</T>
//
// @method
// @param event:SEvent 事件
//==========================================================
function FDsSceneCanvasToolBar_onModeClick(event){
   var o = this;
   o._canvasModeCd = p._canvasModeCd;
   o._frameSet._canvas.switchMode(p._canvasModeCd);
}

//==========================================================
// <T>模式选择。</T>
//
// @method
// @param event:SEvent 事件
//==========================================================
function FDsSceneCanvasToolBar_onLookClick(event){
   var o = this;
   o._canvasModeCd = p._canvasModeCd;
}

//==========================================================
// <T>刷新按键处理。</T>
//
// @method
// @param p:event:SEvent 事件
//==========================================================
function FDsSceneCanvasToolBar_onPlayClick(event){
   var o = this;
   var canvas = o._frameSet._canvas;
   canvas.switchPlay(event.checked);
}

//==========================================================
// <T>刷新按键处理。</T>
//
// @method
// @param p:event:SEvent 事件
//==========================================================
function FDsSceneCanvasToolBar_onRotationClick(event){
   var o = this;
   var canvas = o._frameSet._canvas;
   canvas.switchMovie(event.checked);
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FDsSceneCanvasToolBar_construct(){
   var o = this;
   // 父处理
   o.__base.FUiToolBar.construct.call(o);
}

//==========================================================
// <T>释放处理。</T>
//
// @method
//==========================================================
function FDsSceneCanvasToolBar_dispose(){
   var o = this;
   // 父处理
   o.__base.FUiToolBar.dispose.call(o);
}