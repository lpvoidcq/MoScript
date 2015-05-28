//==========================================================
// <T>存储数据的方式。</T>
//
// @class
// @author maocy
// @version 150319
//==========================================================
var EUiDataStore = new function EUiDataStore(){
   var o = this;
   // @member
   o.Full     = 0;
   o.Sort     = 1;
   o.Config   = 2;
   o.Value    = 3;
   // 保存的数据以控件名作为字段名
   o.Name     = 4;
   // 保存的数据以数据名作为字段名
   o.DataName = 5;
   // 只读取存在的数据部分
   o.DataNvl  = 6;
   // 重置所有数据
   o.Reset    = 7;
   // 新建数据模式
   o.Prepare  = 8;
   return o;
}
