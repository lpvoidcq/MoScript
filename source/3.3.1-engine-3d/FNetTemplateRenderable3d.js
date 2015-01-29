//==========================================================
// <T>渲染几何体。</T>
//
// @author maocy
// @history 141231
//==========================================================
function FNetTemplateRenderable3d(o){
   o = RClass.inherits(this, o, FG3dRenderable);
   //..........................................................
   // @attribute
   o._ready            = false;
   o._display          = null;
   o._modelMatrix      = null;
   o._resource         = null;
   o._model            = null;
   o._renderable       = null;
   o._bones            = null;
   o._materialCode     = null;
   o._materialResource = null;
   //..........................................................
   // @method
   o.construct         = FNetTemplateRenderable3d_construct;
   o.testReady         = FNetTemplateRenderable3d_testReady;
   o.testVisible       = FNetTemplateRenderable3d_testVisible;
   o.findVertexBuffer  = FNetTemplateRenderable3d_findVertexBuffer;
   o.vertexCount       = FNetTemplateRenderable3d_vertexCount;
   o.vertexBuffers     = FNetTemplateRenderable3d_vertexBuffers;
   o.indexBuffer       = FNetTemplateRenderable3d_indexBuffer;
   o.findTexture       = FNetTemplateRenderable3d_findTexture;
   o.textures          = FNetTemplateRenderable3d_textures;
   o.bones             = FNetTemplateRenderable3d_bones;
   o.loadResource      = FNetTemplateRenderable3d_loadResource;
   o.load              = FNetTemplateRenderable3d_load;
   o.build             = FNetTemplateRenderable3d_build;
   o.update            = FNetTemplateRenderable3d_update;
   return o;
}

//==========================================================
// <T>构造处理。</T>
//
// @method
//==========================================================
function FNetTemplateRenderable3d_construct(){
   var o = this;
   o.__base.FG3dRenderable.construct.call(o);
   o._modelMatrix = new SMatrix3d();
}

//==========================================================
// <T>测试是否准备好。</T>
//
// @method
// @return Boolean 准备好
//==========================================================
function FNetTemplateRenderable3d_testReady(){
   var o = this;
   if(!o._model.testReady()){
      return false;
   }
   var ts = o._textures;
   if(ts){
      var c = ts.count();
      for(var i = 0; i < c; i++){
         var t = ts.value(i);
         if(!t.testReady()){
            return false;
         }
      }
   }
   return true;
}

//==========================================================
// <T>测试是否可见。</T>
//
// @method
// @return Boolean 是否可见
//==========================================================
function FNetTemplateRenderable3d_testVisible(p){
   return this._ready;
}

//==========================================================
// <T>查找顶点缓冲。</T>
//
// @method
// @return FG3dVertexBuffer 顶点缓冲
//==========================================================
function FNetTemplateRenderable3d_findVertexBuffer(p){
   return this._renderable.findVertexBuffer(p);
}

//==========================================================
// <T>获得顶点总数。</T>
//
// @method
// @return Integer 顶点总数
//==========================================================
function FNetTemplateRenderable3d_vertexCount(){
   return this._renderable.vertexCount();
}

//==========================================================
// <T>获得顶点缓冲集合。</T>
//
// @method
// @return TObjects 顶点缓冲集合
//==========================================================
function FNetTemplateRenderable3d_vertexBuffers(){
   return this._renderable.vertexBuffers();
}

//==========================================================
// <T>获得索引缓冲。</T>
//
// @method
// @return FG3dIndexBuffer 索引缓冲
//==========================================================
function FNetTemplateRenderable3d_indexBuffer(){
   return this._renderable.indexBuffer();
}

//==========================================================
// <T>根据名称查找纹理。</T>
//
// @method
// @param p:name:String 名称
// @return FRenderIndexBuffer 纹理
//==========================================================
function FNetTemplateRenderable3d_findTexture(p){
   return this._textures.get(p);
}

//==========================================================
// <T>获得纹理集合。</T>
//
// @method
// @return TDictionary 纹理集合
//==========================================================
function FNetTemplateRenderable3d_textures(){
   return this._textures;
}

//==========================================================
// <T>获得骨头集合。</T>
//
// @method
// @return TObjects 骨头集合
//==========================================================
function FNetTemplateRenderable3d_bones(p){
   return this._bones;
}

//==========================================================
// <T>加载资源。</T>
//
// @param p:resource:FRs3TemplateRenderable 资源
//==========================================================
function FNetTemplateRenderable3d_loadResource(p){
   var o = this;
   // 设置资源
   o._resource = p;
   //............................................................
   // 设置数据
   o._modelMatrix.assign(p.matrix());
   // 加载模型
   o._model = RConsole.find(FNetRd3ModelConsole).load(o._context, p.modelGuid());
   //............................................................
   // 加载材质
   var m = p._activeMaterial._material;
   var mi = o._material.info();
   mi.ambientColor.assign(m._ambientColor);
   mi.diffuseColor.assign(m._diffuseColor);
   mi.specularColor.assign(m._specularColor);
   mi.specularLevel = m._specularLevel;
   o._effectName = m._effectCode;
   var rs = m._textures;
   if(rs){
      var bc = RConsole.find(FNetRd3BitmapConsole)
      var c = rs.count();
      var ts = o._textures = new TDictionary();
      for(var i = 0; i < c; i++){
         var r = rs.get(i);
         var t = bc.load(o._context, r._bitmapGuid, r._typeCode);
         ts.set(r._typeCode, t);
      }
   }
}

//==========================================================
// <T>加载资源。</T>
//
// @param p:resource:FRs3TemplateRenderable 资源
//==========================================================
function FNetTemplateRenderable3d_load(){
   var o = this;
   var r = o._resource;
   // 设置网格
   o._renderable = o._model.findMeshByGuid(r.meshGuid());
   // 加载完成
   o._ready = true;
}

//==========================================================
// <T>构建处理。</T>
//
// @method
// @param p:animation:FRd3Animation 动画
//==========================================================
function FNetTemplateRenderable3d_build(p){
   var o = this;
   var r = o._renderable;
   // 建立骨头集合
   var rbs = r.boneIds();
   if(rbs){
      var bs = o._bones = new TObjects();
      var c = rbs.length();
      for(var i = 0; i < c; i++){
         var bi = rbs.get(i);
         var b = p.findBone(bi);
         if(b == null){
            throw new TError("Bone is not exists. (bone_id={1})", bi);
         }
         bs.push(b);
      }
   }
}

//==========================================================
// <T>更新处理。</T>
//
// @method
// @param p:region:FG3dRegion 区域
//==========================================================
function FNetTemplateRenderable3d_update(p){
   var o = this;
   var m = o._display.matrix();
   o._matrix.assign(m);
}
