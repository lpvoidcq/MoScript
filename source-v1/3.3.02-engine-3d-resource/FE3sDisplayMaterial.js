//==========================================================
// <T>资源显示材质。</T>
//
// @author maocy
// @history 150129
//==========================================================
function FE3sDisplayMaterial(o){
   o = RClass.inherits(this, o, FObject);
   //..........................................................
   // @attribute
   o._groupGuid  = null;
   o._material   = null;
   //..........................................................
   // @method
   o.groupGuid   = FE3sDisplayMaterial_groupGuid;
   o.material    = FE3sDisplayMaterial_material;
   // @method
   o.unserialize = FE3sDisplayMaterial_unserialize;
   return o;
}

//==========================================================
// <T>获得材质组唯一编号。</T>
//
// @method
// @return String 唯一编号
//==========================================================
function FE3sDisplayMaterial_groupGuid(){
   return this._groupGuid;
}

//==========================================================
// <T>获得材质。</T>
//
// @method
// @return FE3sMaterial 材质
//==========================================================
function FE3sDisplayMaterial_material(){
   return this._material;
}

//==========================================================
// <T>从输入流里反序列化信息内容</T>
//
// @param p:input:FByteStream 数据流
// @return 处理结果
//==========================================================
function FE3sDisplayMaterial_unserialize(p){
   var o = this;
   // 读取属性
   o._groupGuid = p.readString();
   // 关联材质
   o._material = o._template._activeTheme.findMaterial(o._groupGuid);
}
