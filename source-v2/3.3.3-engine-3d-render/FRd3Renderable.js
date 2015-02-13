//==========================================================
// <T>渲染体。</T>
//
// @author maocy
// @history 150207
//==========================================================
function FRd3Renderable(o){
   o = RClass.inherits(this, o, FG3dRenderable, MGraphicObject);
   //..........................................................
   // @attribute
   o._display         = null;
   // @attribute
   o._vertexCount     = 0;
   o._vertexBuffers   = null;
   o._indexBuffer     = null;
   //..........................................................
   // @method
   o.construct        = FRd3Renderable_construct;
   // @method
   o.setup            = RMethod.empty;
   // @method
   o.testVisible      = RMethod.emptyTrue;
   o.display          = FRd3Renderable_display;
   o.setDisplay       = FRd3Renderable_setDisplay;
   o.vertexCount      = FRd3Renderable_vertexCount;
   o.findVertexBuffer = FRd3Renderable_findVertexBuffer;
   o.vertexBuffers    = FRd3Renderable_vertexBuffers;
   o.indexBuffer      = FRd3Renderable_indexBuffer;
   o.textures         = RMethod.empty;
   o.bones            = RMethod.empty;
   // @method
   o.update           = FRd3Renderable_update;
   o.remove           = FRd3Renderable_remove;
   return o;
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FRd3Renderable_construct(){
   var o = this;
   o.__base.FG3dRenderable.construct.call(o);
   // 构造变量
   o._vertexBuffers = new TDictionary();
}

//==========================================================
// <T>获得显示对象。</T>
//
// @method
// @return FDisplay 显示对象
//==========================================================
function FRd3Renderable_display(){
   return this._display;
}

//==========================================================
// <T>设置显示对象。</T>
//
// @method
// @param p:display:FDisplay 显示对象
//==========================================================
function FRd3Renderable_setDisplay(p){
   this._display = p;
}

//==========================================================
// <T>获得顶点个数。</T>
//
// @method
// @return Integer 顶点个数
//==========================================================
function FRd3Renderable_vertexCount(){
   return this._vertexCount;
}

//==========================================================
// <T>根据代码查找顶点缓冲。</T>
//
// @method
// @param p:code:String 代码
// @return FG3dVertexBuffer 顶点缓冲
//==========================================================
function FRd3Renderable_findVertexBuffer(p){
   return this._vertexBuffers.get(p);
}

//==========================================================
// <T>获得顶点缓冲集合。</T>
//
// @method
// @return TObjects 顶点缓冲集合
//==========================================================
function FRd3Renderable_vertexBuffers(){
   return this._vertexBuffers;
}

//==========================================================
// <T>获得索引缓冲。</T>
//
// @method
// @return FG3dIndexBuffer 索引缓冲
//==========================================================
function FRd3Renderable_indexBuffer(){
   return this._indexBuffer;
}

//==========================================================
// <T>更新处理。</T>
//
// @method
// @param p:region:FG3dRegion 区域
//==========================================================
function FRd3Renderable_update(p){
   var o = this;
   // 计算矩阵
   var m = o._currentMatrix;
   m.assign(o._matrix);
   // 计算显示矩阵
   var d = o._display;
   if(d){
      m.append(d.currentMatrix());
   }
}

//==========================================================
// <T>移除处理。</T>
//
// @method
//==========================================================
function FRd3Renderable_remove(){
   var o = this;
   var d = o._display;
   if(d){
      d.removeRenderable(o);
      o._display = null;
   }
}