with(MO){
   MO.SE3dRulerPrecision = function SE3dRulerPrecision(o){
      var o = this;
      o.interval = 1;
      o.length   = 0.5;
      o.color    = new SColor4(255, 255, 255, 255);
      return o;
   }
   MO.SE3dRulerPrecision_assign = function SE3dRulerPrecision_assign(info){
      var o = this;
      o.interval.assign(info.interval);
      o.color.assign(info.color);
   }
}
with(MO){
   MO.SE3dRulerStyle = function SE3dRulerStyle(o){
      var o = this;
      o.lineColor    = new SColor4(255, 255, 255, 255);
      o.bothLength   = 0.5;
      o.bothColor    = new SColor4(255, 255, 255, 255);
      o.tickInterval = 1;
      o.tickLength   = 0.3;
      o.tickColor    = new SColor4(255, 255, 255, 255);
      o.precisions   = new TObjects();
      o.assign       = SE3dRulerStyle_assign;
      return o;
   }
   MO.SE3dRulerStyle = function SE3dRulerStyle_assign(info){
      var o = this;
      o.lineColor.assign(info.lineColor);
      o.bothLength = info.bothLength;
      o.bothColor.assign(info.lineColor);
      o.tickInterval = info.tickInterval;
      o.tickLength = info.tickLength;
      o.tickColor.assign(info.lineColor);
      o.precisions.assign(info.precisions);
   }
}
with(MO){
   MO.FE3dBitmap = function FE3dBitmap(o){
      o = RClass.inherits(this, o, FE3dMeshRenderable, MListenerLoad);
      o._ready           = false;
      o._size            = null;
      o.construct        = FE3dBitmap_construct;
      o.testReady        = FE3dBitmap_testReady;
      o.size             = FE3dBitmap_size;
      o.setSize          = FE3dBitmap_setSize;
      o.setBitmapData    = FE3dBitmap_setBitmapData;
      o.vertexBuffers    = FE3dBitmap_vertexBuffers;
      o.material         = FE3dBitmap_material;
      o.findVertexBuffer = FE3dBitmap_findVertexBuffer;
      o.findTexture      = FE3dBitmap_findTexture;
      o.textures         = FE3dBitmap_textures;
      o.processLoad      = FE3dBitmap_processLoad;
      o.process          = FE3dBitmap_process;
      o.loadUrl          = FE3dBitmap_loadUrl;
      o.dispose          = FE3dBitmap_dispose;
      return o;
   }
   MO.FE3dBitmap_construct = function FE3dBitmap_construct(){
      var o = this;
      o.__base.FE3dMeshRenderable.construct.call(o);
      o._size = new SSize2();
   }
   MO.FE3dBitmap_testReady = function FE3dBitmap_testReady(){
      var o = this;
      if(!o._ready){
         var renderable = o._renderable;
         if(renderable){
            o._ready = renderable.testReady();
            if(o._ready){
               var size = renderable.size();
               var adjustSize = renderable.adjustSize();
               var matrix = o.matrix();
               matrix.sz = adjustSize.height / size.height;
               matrix.updateForce();
               var event = new SEvent(o);
               o.processLoadListener(event);
               event.dispose();
            }
            o._materialReference = renderable;
         }
      }
      return o._ready;
   }
   MO.FE3dBitmap_size = function FE3dBitmap_size(){
      return this._size;
   }
   MO.FE3dBitmap_setSize = function FE3dBitmap_setSize(width, height){
      var o = this;
      o._size.set(width, height);
      o._matrix.setScale(width, height, 1);
   }
   MO.FE3dBitmap_setBitmapData = function FE3dBitmap_setBitmapData(bitmapData){
      var o = this;
      o._renderable = bitmapData;
   }
   MO.FE3dBitmap_vertexBuffers = function FE3dBitmap_vertexBuffers(){
      return this._renderable.vertexBuffers();
   }
   MO.FE3dBitmap_material = function FE3dBitmap_material(){
      return this._renderable.material();
   }
   MO.FE3dBitmap_findVertexBuffer = function FE3dBitmap_findVertexBuffer(p){
      return this._renderable.findVertexBuffer(p);
   }
   MO.FE3dBitmap_findTexture = function FE3dBitmap_findTexture(p){
      return this._renderable.findTexture(p);
   }
   MO.FE3dBitmap_textures = function FE3dBitmap_textures(){
      return this._renderable.textures();
   }
   MO.FE3dBitmap_processLoad = function FE3dBitmap_processLoad(){
      var o = this;
      return true;
   }
   MO.FE3dBitmap_process = function FE3dBitmap_process(){
      var o = this;
      o.__base.FE3dMeshRenderable.process.call(o);
   }
   MO.FE3dBitmap_loadUrl = function FE3dBitmap_loadUrl(url){
      var o = this;
      var context = o._graphicContext;
      o._renderable = RConsole.find(FE3dBitmapConsole).loadUrl(context, url);
      o._ready = false;
   }
   MO.FE3dBitmap_dispose = function FE3dBitmap_dispose(){
      var o = this;
      o._material = RObject.dispoe(o._material);
      o.__base.FE3dMeshRenderable.dispose.call(o);
   }
}
with(MO){
   MO.FE3dBitmapConsole = function FE3dBitmapConsole(o){
      o = RClass.inherits(this, o, FConsole);
      o._scopeCd  = EScope.Local;
      o._bitmaps  = null;
      o._dataUrl  = '/cloud.resource.bitmap.wv'
      o.construct = FE3dBitmapConsole_construct;
      o.bitmaps   = FE3dBitmapConsole_bitmaps;
      o.load      = FE3dBitmapConsole_load;
      o.loadUrl   = FE3dBitmapConsole_loadUrl;
      return o;
   }
   MO.FE3dBitmapConsole_construct = function FE3dBitmapConsole_construct(){
      var o = this;
      o.__base.FConsole.construct.call(o);
      o._bitmaps = new TDictionary();
   }
   MO.FE3dBitmapConsole_bitmaps = function FE3dBitmapConsole_bitmaps(){
      return this._bitmaps;
   }
   MO.FE3dBitmapConsole_load = function FE3dBitmapConsole_load(context, guid, code){
      var o = this;
      var flag = guid + '|' + code;
      var bitmap = o._bitmaps.get(flag);
      if(bitmap){
         return bitmap;
      }
      var url = RBrowser.hostPath(o._dataUrl + '?guid=' + guid + '&code=' + code);
      RLogger.info(o, 'Load bitmap. (url={1})', url);
      if(code == 'environment'){
         bitmap = RClass.create(FE3rBitmapCubePack);
      }else{
         bitmap = RClass.create(FE3rBitmapFlatPack);
      }
      bitmap.linkGraphicContext(context);
      bitmap.loadUrl(url);
      o._bitmaps.set(flag, bitmap);
      return bitmap;
   }
   MO.FE3dBitmapConsole_loadUrl = function FE3dBitmapConsole_loadUrl(context, url){
      var o = this;
      var bitmap = o._bitmaps.get(url);
      if(bitmap){
         return bitmap;
      }
      var loadUrl = RBrowser.contentPath(url);
      RLogger.info(o, 'Load bitmap from url. (url={1})', loadUrl);
      var bitmap = RClass.create(FE3dBitmapData);
      bitmap.linkGraphicContext(context);
      bitmap.setup();
      bitmap.loadUrl(url);
      o._bitmaps.set(url, bitmap);
      return bitmap;
   }
}
with(MO){
   MO.FE3dBitmapData = function FE3dBitmapData(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._ready            = false;
      o._image            = null;
      o._imageTexture     = null;
      o._size             = RClass.register(o, new AGetter('_size'));
      o._adjustSize       = RClass.register(o, new AGetter('_adjustSize'));
      o.onImageLoad       = FE3dBitmapData_onImageLoad;
      o.construct         = FE3dBitmapData_construct;
      o.testReady         = FE3dBitmapData_testReady;
      o.setup             = FE3dBitmapData_setup;
      o.loadUrl           = FE3dBitmapData_loadUrl;
      o.dispose           = FE3dBitmapData_dispose;
      return o;
   }
   MO.FE3dBitmapData_onImageLoad = function FE3dBitmapData_onImageLoad(event){
      var o = this;
      var context = o._graphicContext;
      var image = event.sender;
      var size = image.size();
      var width = size.width;
      var height = size.height;
      o._size.set(width, height);
      var adjustWidth = RInteger.pow2(width);
      var adjustHeight = RInteger.pow2(height);
      o._adjustSize.set(adjustWidth, adjustHeight);
      var canvasConsole = RConsole.find(FE2dCanvasConsole);
      var canvas = canvasConsole.allocBySize(adjustWidth, adjustHeight);
      var context2d = canvas.context();
      context2d.drawImage(image, 0, 0);
      o._imageTexture.upload(canvas);
      canvasConsole.free(canvas);
      image.dispose();
      o._ready = true;
   }
   MO.FE3dBitmapData_construct = function FE3dBitmapData_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      o._size = new SSize2();
      o._adjustSize = new SSize2();
      o._textures = new TDictionary();
      o._material = RClass.create(FE3dMaterial);
   }
   MO.FE3dBitmapData_testReady = function FE3dBitmapData_testReady(){
      return this._ready;
   }
   MO.FE3dBitmapData_setup = function FE3dBitmapData_setup(){
      var o = this;
      var context = o._graphicContext;
      o._vertexCount = 4;
      var data = [
         0,  0, 0,
         1,  0, 0,
         1, -1, 0,
         0, -1, 0 ];
      var buffer = o._vertexPositionBuffer = context.createVertexBuffer();
      buffer.setCode('position');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      buffer.upload(data, 4 * 3, 4);
      var stream = RClass.create(FE3sStream);
      stream.setCode('position');
      stream._dataCount = 4;
      stream._data = data;
      buffer._resource = stream;
      o.pushVertexBuffer(buffer);
      var data = [
         0, 1,
         1, 1,
         1, 0,
         0, 0];
      var buffer = o._vertexColorBuffer = context.createVertexBuffer();
      buffer.setCode('coord');
      buffer.setFormatCd(EG3dAttributeFormat.Float2);
      buffer.upload(data, 4 * 2, 4);
      var stream = RClass.create(FE3sStream);
      stream.setCode('coord');
      stream._dataCount = 4;
      stream._data = data;
      buffer._resource = stream;
      o.pushVertexBuffer(buffer);
      var data = [0, 1, 2, 0, 2, 3];
      var buffer = context.createIndexBuffer();
      buffer.upload(data, 6);
      var stream = RClass.create(FE3sStream);
      stream.setCode('index16');
      stream._dataCount = 2;
      stream._data = data;
      buffer._resource = stream;
      o.pushIndexBuffer(buffer);
      var texture = o._imageTexture = context.createFlatTexture();
      texture.setOptionFlipY(true);
      o._textures.set('diffuse', texture);
      o._material._textures = o._textures;
      o._material.info().optionDouble = true;
   }
   MO.FE3dBitmapData_loadUrl = function FE3dBitmapData_loadUrl(url){
      var o = this;
      var image = RClass.create(FImage);
      image.addLoadListener(o, o.onImageLoad);
      image.loadUrl(url);
      o._ready = false;
   }
   MO.FE3dBitmapData_dispose = function FE3dBitmapData_dispose(){
      var o = this;
      o._size = RObject.dispose(o._size);
      o._adjustSize = RObject.dispose(o._adjustSize);
      o._vertexBuffers = RObject.dispose(o._vertexBuffers);
      o._indexBuffer = RObject.dispose(o._indexBuffer);
      o._imageTexture = RObject.dispose(o._imageTexture);
      o._textures = RObject.dispose(o._textures);
      o.__base.FE3dRenderable.dispose.call(o);
   }
}
with(MO){
   MO.FE3dBoundBox = function FE3dBoundBox(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._outline              = RClass.create(o, new AGetter('_outline'));
      o._rate                 = 0.2;
      o._vertexPositionBuffer = null;
      o._vertexColorBuffer    = null;
      o.construct             = FE3dBoundBox_construct;
      o.setup                 = FE3dBoundBox_setup;
      o.upload                = FE3dBoundBox_upload;
      return o;
   }
   MO.FE3dBoundBox_construct = function FE3dBoundBox_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      o._material = RClass.create(FE3dMaterial);
      o._outline = new SOutline3();
   }
   MO.FE3dBoundBox_setup = function FE3dBoundBox_setup(){
      var o = this;
      var c = o._graphicContext;
      var buffer = o._vertexPositionBuffer = c.createVertexBuffer();
      buffer.setCode('position');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      o.pushVertexBuffer(buffer);
      var vertexData = new Uint8Array(4 * 32);
      for(var n = 4 * 32 - 1; n >= 0; n--){
         vertexData[n] = 0xFF;
      }
      var buffer = o._vertexColorBuffer = c.createVertexBuffer();
      buffer.setCode('color');
      buffer.setFormatCd(EG3dAttributeFormat.Byte4Normal);
      buffer.upload(vertexData, 1 * 4, 32);
      o.pushVertexBuffer(buffer);
      o._vertexCount = 32;
      var indexData = [
          0,  1,  0,  4,  0, 12,
          3,  2,  3,  5,  3, 13,
          8,  6,  8,  9,  8, 14,
         11,  7, 11, 10, 11, 15,
         20, 16, 20, 21, 20, 24,
         23, 17, 23, 22, 23, 25,
         28, 18, 28, 26, 28, 29,
         31, 19, 31, 27, 31, 30 ];
      var buffer = o._indexBuffer = c.createIndexBuffer();
      buffer.setDrawModeCd(EG3dDrawMode.Lines);
      buffer.setLineWidth(1);
      buffer.upload(indexData, 48);
      o.pushIndexBuffer(buffer);
      o.update();
      var info = o.material().info();
      info.effectCode = 'control';
      info.ambientColor.set(1, 1, 1, 1);
   }
   MO.FE3dBoundBox_upload = function FE3dBoundBox_upload(){
      var o = this;
      var l = o._outline;
      var a = l.max;
      var ax = a.x;
      var ay = a.y;
      var az = a.z;
      var i = l.min;
      var ix = i.x;
      var iy = i.y;
      var iz = i.z;
      var r = o._rate;
      var cx = (ax - ix) * r;
      var cy = (ay - iy) * r;
      var cz = (az - iz) * r;
      var data = [
         ix,       ay,      iz,
         ix + cx,  ay,      iz,
         ax - cx,  ay,      iz,
         ax,       ay,      iz,
         ix,       ay - cy, iz,
         ax,       ay - cy, iz,
         ix,       iy + cy, iz,
         ax,       iy + cy, iz,
         ix,       iy,      iz,
         ix + cx,  iy,      iz,
         ax - cx,  iy,      iz,
         ax,       iy,      iz,
         ix,       ay,      iz + cz,
         ax,       ay,      iz + cz,
         ix,       iy,      iz + cz,
         ax,       iy,      iz + cz,
         ix,       ay,      az - cz,
         ax,       ay,      az - cz,
         ix,       iy,      az - cz,
         ax,       iy,      az - cz,
         ix,       ay,      az,
         ix + cx,  ay,      az,
         ax - cx,  ay,      az,
         ax,       ay,      az,
         ix,       ay - cy, az,
         ax,       ay - cy, az,
         ix,       iy + cy, az,
         ax,       iy + cy, az,
         ix,       iy,      az,
         ix + cx,  iy,      az,
         ax - cx,  iy,      az,
         ax,       iy,      az];
      o._vertexPositionBuffer.upload(data, 4 * 3, 32);
   }
}
with(MO){
   MO.FE3dCube = function FE3dCube(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o.vertexPositionBuffer = null;
      o.vertexColorBuffer    = null;
      o.indexBuffer          = null;
      o.setup                = FE3dCube_setup;
      return o;
   }
   MO.FE3dCube_setup = function FE3dCube_setup(p){
      var o = this;
      var vp = [
         -1.0,  1.0, -1.0,
          1.0,  1.0, -1.0,
          1.0, -1.0, -1.0,
         -1.0, -1.0, -1.0,
         -1.0,  1.0,  1.0,
          1.0,  1.0,  1.0,
          1.0, -1.0,  1.0,
         -1.0, -1.0,  1.0 ];
      var buffer = o.vertexPositionBuffer = p.createVertexBuffer();
      buffer.upload(vp, 4 * 3, 8);
      o.pushVertexBuffer(buffer);
      var vc = [
         0.0, 1.0, 0.0, 1.0,
         1.0, 0.0, 0.0, 1.0,
         1.0, 0.0, 0.0, 1.0,
         0.0, 0.0, 0.0, 1.0,
         0.0, 1.0, 0.0, 1.0,
         1.0, 0.0, 1.0, 1.0,
         1.0, 0.0, 1.0, 1.0,
         0.0, 0.0, 1.0, 1.0 ];
      var buffer = o.vertexColorBuffer = p.createVertexBuffer();
      buffer.upload(vc, 4 * 4, 8);
      o.pushVertexBuffer(buffer);
      var id = [
         0, 1, 2, 0, 2, 3,
         1, 5, 6, 1, 6, 2,
         5, 4, 7, 5, 7, 6,
         4, 0, 3, 4, 3, 7,
         0, 4, 5, 0, 5, 1,
         3, 2, 6, 3, 6, 7  ];
      var buffer = context.createIndexBuffer();
      buffer.upload(id, 36);
      o.pushIndexBuffer(buffer);
      var mi = o.material().info();
      mi.effectCode = 'control';
      mi.ambientColor.set(1, 1, 1, 1);
   }
}
with(MO){
   MO.FE3dDimensional = function FE3dDimensional(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._cellSize             = null;
      o._size                 = null;
      o._lineColor            = null;
      o._lineCenterColor      = null;
      o._vertexPositionBuffer = null;
      o._vertexColorBuffer    = null;
      o.construct             = FE3dDimensional_construct;
      o.setup                 = FE3dDimensional_setup;
      return o;
   }
   MO.FE3dDimensional_construct = function FE3dDimensional_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      o._material = RClass.create(FE3dMaterial);
      o._cellSize = new SSize2();
      o._cellSize.set(1, 1);
      o._size = new SSize2();
      o._size.set(16, 16);
   }
   MO.FE3dDimensional_setup = function FE3dDimensional_setup(){
      var o = this;
      var context = o._graphicContext;
      var cw = o._cellSize.width;
      var ch = o._cellSize.height;
      var sw = o._size.width;
      var sw2 = sw / 2;
      var sh = o._size.height;
      var sh2 = sh / 2;
      var vc = 2 * ((sw + 2) + (sh + 2));
      var v = 0;
      var vi = 0;
      var vd = new Float32Array(3 * vc);
      var vci = 0;
      var vcd = new Uint8Array(4 * vc);
      var i = 0;
      var it = vc;
      var id = new Uint16Array(it);
      for(var y = 0; y <= sh; y++){
         var r = 1;
         if(y - sh2 == 0){
            r = 0
         }
         vd[v++] = cw * -sw2 * r;
         vd[v++] = 0;
         vd[v++] = ch * (y - sh2);
         vd[v++] = cw * sw2 * r;
         vd[v++] = 0;
         vd[v++] = ch * (y - sh2);
         for(var ci = 0; ci < 8; ci++){
            vcd[vci++] = 255;
         }
         id[i++] = vi++;
         id[i++] = vi++;
      }
      vd[v++] = cw * -sw2;
      vd[v++] = 0;
      vd[v++] = 0;
      vd[v++] = cw * sw2;
      vd[v++] = 0;
      vd[v++] = 0;
      for(var ci = 0; ci < 2; ci++){
         vcd[vci++] = 255;
         vcd[vci++] = 0;
         vcd[vci++] = 0;
         vcd[vci++] = 255;
      }
      id[i++] = vi++;
      id[i++] = vi++;
      for(var x = 0; x <= sw; x++){
         var r = 1;
         if(x - sw2 == 0){
            r = 0
         }
         vd[v++] = cw * (x - sw2);
         vd[v++] = 0;
         vd[v++] = ch * - sh2 * r;
         vd[v++] = cw * (x - sw2);
         vd[v++] = 0;
         vd[v++] = ch * sh2 * r;
         for(var ci = 0; ci < 8; ci++){
            vcd[vci++] = 255;
         }
         id[i++] = vi++;
         id[i++] = vi++;
      }
      vd[v++] = 0;
      vd[v++] = 0;
      vd[v++] = ch * -sh2;
      vd[v++] = 0;
      vd[v++] = 0;
      vd[v++] = ch * sh2;
      for(var ci = 0; ci < 2; ci++){
         vcd[vci++] = 255;
         vcd[vci++] = 0;
         vcd[vci++] = 0;
         vcd[vci++] = 255;
      }
      id[i++] = vi++;
      id[i++] = vi++;
      o._vertexCount = vc;
      var buffer = o._vertexPositionBuffer = context.createVertexBuffer();
      buffer.setCode('position');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      buffer.upload(vd, 4 * 3, vc);
      o.pushVertexBuffer(buffer);
      var buffer = o._vertexColorBuffer = context.createVertexBuffer();
      buffer.setCode('color');
      buffer.setFormatCd(EG3dAttributeFormat.Byte4Normal);
      buffer.upload(vcd, 4, vc);
      o.pushVertexBuffer(buffer);
      var buffer = context.createIndexBuffer();
      buffer.setDrawModeCd(EG3dDrawMode.Lines);
      buffer.upload(id, it);
      o.pushIndexBuffer(buffer);
      var materialInfo = o.material().info();
      materialInfo.effectCode = 'control';
      materialInfo.ambientColor.set(1, 1, 1, 1);
   }
}
with(MO){
   MO.FE3dPolygon = function FE3dPolygon(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      return o;
   }
}
with(MO){
   MO.FE3dRectangle = function FE3dRectangle(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._vertexPositionBuffer = null;
      o._vertexColorBuffer    = null;
      o._indexBuffer          = null;
      o.setup                 = FE3dRectangle_setup;
      return o;
   }
   MO.FE3dRectangle_setup = function FE3dRectangle_setup(p){
      var o = this;
      var vp = [
         -1.0,  1.0, 0.0,
          1.0,  1.0, 0.0,
          1.0, -1.0, 0.0,
         -1.0, -1.0, 0.0 ];
      var buffer = o._vertexPositionBuffer = p.createVertexBuffer();
      buffer.upload(vp, 4 * 3, 4);
      o.pushVertexBuffer(buffer);
      var vc = [
         0.0, 1.0, 0.0, 1.0,
         1.0, 0.0, 0.0, 1.0,
         1.0, 0.0, 0.0, 1.0,
         0.0, 0.0, 0.0, 1.0 ];
      var buffer = o._vertexColorBuffer = p.createVertexBuffer();
      buffer.upload(vc, 4 * 4, 4);
      o.pushVertexBuffer(buffer);
      var id = [0, 1, 2, 0, 2, 3];
      var buffer = context.createIndexBuffer();
      buffer.upload(id, 6);
      o.pushIndexBuffer(buffer);
   }
}
with(MO){
   MO.FE3dRuler = function FE3dRuler(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._style                = null;
      o._beginPoint           = null;
      o._endPoint             = null;
      o._direction            = null;
      o._directionLine        = null;
      o._vertexPositionBuffer = null;
      o._vertexColorBuffer    = null;
      o._vertexPositionData   = null;
      o._vertexColorData      = null;
      o._indexData            = null;
      o.construct             = FE3dRuler_construct;
      o.style                 = FE3dRuler_style;
      o.beginPoint            = FE3dRuler_beginPoint;
      o.endPoint              = FE3dRuler_endPoint;
      o.direction             = FE3dRuler_direction;
      o.setup                 = FE3dRuler_setup;
      o.upload                = FE3dRuler_upload;
      return o;
   }
   MO.FE3dRuler_construct = function FE3dRuler_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      o._material = RClass.create(FE3dMaterial);
      o._style = new SE3dRulerStyle();
      o._beginPoint = new SPoint3(0, 0, 0);
      o._endPoint = new SPoint3(0, 10, 0);
      o._direction = new SVector3(1, 0, 0);
      o._directionLine = new SVector3();
      o._vertexPositionData = new TArray();
      o._vertexColorData = new TArray();
      o._indexData = new TArray();
   }
   MO.FE3dRuler_style = function FE3dRuler_style(){
      return this._style;
   }
   MO.FE3dRuler_beginPoint = function FE3dRuler_beginPoint(){
      return this._beginPoint;
   }
   MO.FE3dRuler_endPoint = function FE3dRuler_endPoint(){
      return this._endPoint;
   }
   MO.FE3dRuler_direction = function FE3dRuler_direction(){
      return this._direction;
   }
   MO.FE3dRuler_setup = function FE3dRuler_setup(){
      var o = this;
      var context = o._graphicContext;
      var buffer = o._vertexPositionBuffer = context.createVertexBuffer();
      buffer.setCode('position');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      o.pushVertexBuffer(buffer);
      var buffer = o._vertexColorBuffer = context.createVertexBuffer();
      buffer.setCode('color');
      buffer.setFormatCd(EG3dAttributeFormat.Byte4Normal);
      o.pushVertexBuffer(buffer);
      var indexBuffer = o._indexBuffer = context.createIndexBuffer();
      indexBuffer.setFillModeCd(EG3dFillMode.Line);
      indexBuffer.setLineWidth(1);
      o.pushIndexBuffer(indexBuffer);
      o.upload();
      o.update();
      var info = o.material().info();
      info.effectCode = 'control';
      info.ambientColor.set(1, 1, 1, 1);
   }
   MO.FE3dRuler_upload = function FE3dRuler_upload(){
      var o = this;
      var vertexCount = 0;
      var style = o._style;
      var positions = o._vertexPositionData;
      positions.clear();
      var colors = o._vertexColorData;
      colors.clear();
      var indexs = o._indexData;
      indexs.clear();
      var beginPoint = o._beginPoint;
      var endPoint = o._endPoint;
      positions.push(beginPoint.x, beginPoint.y, beginPoint.z);
      colors.push(255, 255, 255, 255);
      vertexCount++;
      positions.push(endPoint.x, endPoint.y, endPoint.z);
      colors.push(255, 255, 255, 255);
      vertexCount++;
      indexs.push(0, 1);
      var bothLength = style.bothLength;
      var bothColor = style.bothColor;
      var direction = o._direction;
      var tickBeginPoint = new SPoint3();
      var tickEndPoint = new SPoint3();
      positions.push(beginPoint.x, beginPoint.y, beginPoint.z);
      colors.push(bothColor.red, bothColor.green, bothColor.blue, bothColor.alpha);
      tickEndPoint.x = direction.x * bothLength + beginPoint.x;
      tickEndPoint.y = direction.y * bothLength + beginPoint.y;
      tickEndPoint.z = direction.z * bothLength + beginPoint.z;
      positions.push(tickEndPoint.x, tickEndPoint.y, tickEndPoint.z);
      colors.push(bothColor.red, bothColor.green, bothColor.blue, bothColor.alpha);
      indexs.push(vertexCount, vertexCount + 1);
      vertexCount += 2;
      positions.push(endPoint.x, endPoint.y, endPoint.z);
      colors.push(bothColor.red, bothColor.green, bothColor.blue, bothColor.alpha);
      tickEndPoint.x = direction.x * bothLength + endPoint.x;
      tickEndPoint.y = direction.y * bothLength + endPoint.y;
      tickEndPoint.z = direction.z * bothLength + endPoint.z;
      positions.push(tickEndPoint.x, tickEndPoint.y, tickEndPoint.z);
      colors.push(bothColor.red, bothColor.green, bothColor.blue, bothColor.alpha);
      indexs.push(vertexCount, vertexCount + 1);
      vertexCount += 2;
      var lineDirection = o._directionLine.direction(beginPoint, o._endPoint);
      var length = lineDirection.length();
      lineDirection.normalize();
      var precisions = style.precisions;
      var count = precisions.count();
      for(var n = 0; n < count; n++){
         var precision = precisions.at(n);
         var tickInterval = precision.interval;
         var tickLength = precision.length;
         var tickColor = precision.color;
         for(var i = tickInterval; i < length; i += tickInterval){
            tickBeginPoint.x = lineDirection.x * i + beginPoint.x;
            tickBeginPoint.y = lineDirection.y * i + beginPoint.y;
            tickBeginPoint.z = lineDirection.z * i + beginPoint.z;
            positions.push(tickBeginPoint.x, tickBeginPoint.y, tickBeginPoint.z);
            colors.push(tickColor.red, tickColor.green, tickColor.blue, tickColor.alpha);
            tickEndPoint.x = direction.x * tickLength + tickBeginPoint.x;
            tickEndPoint.y = direction.y * tickLength + tickBeginPoint.y;
            tickEndPoint.z = direction.z * tickLength + tickBeginPoint.z;
            positions.push(tickEndPoint.x, tickEndPoint.y, tickEndPoint.z);
            colors.push(tickColor.red, tickColor.green, tickColor.blue, tickColor.alpha);
            indexs.push(vertexCount, vertexCount + 1);
            vertexCount += 2;
         }
      }
      o._vertexPositionBuffer.upload(positions.memory(), 4 * 3, vertexCount);
      o._vertexColorBuffer.upload(colors.memory(), 1 * 4, vertexCount);
      indexBuffer.upload(indexs.memory(), indexs.length());
   }
}
with(MO){
   MO.FE3dRulerBox = function FE3dRulerBox(o){
      o = RClass.inherits(this, o, FE3dSprite);
      o._outline  = null;
      o._style    = null;
      o._rulerX   = null;
      o._rulerY   = null;
      o._rulerZ   = null;
      o.construct = FE3dRulerBox_construct;
      o.style     = FE3dRulerBox_style;
      o.outline   = FE3dRulerBox_outline;
      o.setup     = FE3dRulerBox_setup;
      o.upload    = FE3dRulerBox_upload;
      return o;
   }
   MO.FE3dRulerBox_construct = function FE3dRulerBox_construct(){
      var o = this;
      o.__base.FE3dSprite.construct.call(o);
      o._material = RClass.create(FE3dMaterial);
      o._style = new SE3dRulerStyle();
      o._outline = new SOutline3();
      var ruler = o._rulerX = RClass.create(FE3dRuler);
      o.pushRenderable(ruler);
      var ruler = o._rulerY = RClass.create(FE3dRuler);
      o.pushRenderable(ruler);
      var ruler = o._rulerZ = RClass.create(FE3dRuler);
      o.pushRenderable(ruler);
   }
   MO.FE3dRulerBox_style = function FE3dRulerBox_style(){
      return this._style;
   }
   MO.FE3dRulerBox_outline = function FE3dRulerBox_outline(){
      return this._outline;
   }
   MO.FE3dRulerBox_setup = function FE3dRulerBox_setup(){
      var o = this;
      var context = o._graphicContext;
      var style = o._style;
      o.matrix().setScaleAll(0.1);
      o.matrix().update();
      var outline = o._outline;
      var min = outline.min;
      var max = outline.max;
      var ruler = o._rulerX;
      ruler.linkGraphicContext(context);
      ruler.style().assign(style);
      ruler.beginPoint().assign(min);
      ruler.endPoint().set(max.x, min.y, min.z);
      ruler.direction().set(0, 0, -1);
      ruler.setup();
      var ruler = o._rulerY;
      ruler.linkGraphicContext(context);
      ruler.style().assign(style);
      ruler.beginPoint().assign(min);
      ruler.endPoint().set(min.x, max.y, min.z);
      ruler.direction().set(-1, 0, 0);
      ruler.setup();
      var ruler = o._rulerZ;
      ruler.linkGraphicContext(context);
      ruler.style().assign(style);
      ruler.beginPoint().assign(min);
      ruler.endPoint().set(min.x, min.y, max.z);
      ruler.direction().set(-1, 0, 0);
      ruler.setup();
   }
   MO.FE3dRulerBox_upload = function FE3dRulerBox_upload(){
      var o = this;
      o._rulerX.upload();
      o._rulerY.upload();
      o._rulerZ.upload();
   }
}
with(MO){
   MO.FE3dShape = function FE3dShape(o){
      o = RClass.inherits(this, o, FE3dMeshRenderable, MListenerLoad);
      o._ready           = false;
      o._size            = null;
      o.construct        = FE3dShape_construct;
      o.testReady        = FE3dShape_testReady;
      o.size             = FE3dShape_size;
      o.setSize          = FE3dShape_setSize;
      o.setBitmapData    = FE3dShape_setBitmapData;
      o.vertexBuffers    = FE3dShape_vertexBuffers;
      o.material         = FE3dShape_material;
      o.findVertexBuffer = FE3dShape_findVertexBuffer;
      o.findTexture      = FE3dShape_findTexture;
      o.textures         = FE3dShape_textures;
      o.processLoad      = FE3dShape_processLoad;
      o.process          = FE3dShape_process;
      o.loadUrl          = FE3dShape_loadUrl;
      o.dispose          = FE3dShape_dispose;
      return o;
   }
   MO.FE3dShape_construct = function FE3dShape_construct(){
      var o = this;
      o.__base.FE3dMeshRenderable.construct.call(o);
      o._size = new SSize2();
   }
   MO.FE3dShape_testReady = function FE3dShape_testReady(){
      var o = this;
      if(!o._ready){
         var renderable = o._renderable;
         if(renderable){
            o._ready = renderable.testReady();
            if(o._ready){
               var size = renderable.size();
               var adjustSize = renderable.adjustSize();
               var matrix = o.matrix();
               matrix.sz = adjustSize.height / size.height;
               matrix.updateForce();
               var event = new SEvent(o);
               o.processLoadListener(event);
               event.dispose();
            }
            o._materialReference = renderable;
         }
      }
      return o._ready;
   }
   MO.FE3dShape_size = function FE3dShape_size(){
      return this._size;
   }
   MO.FE3dShape_setSize = function FE3dShape_setSize(width, height){
      var o = this;
      o._size.set(width, height);
      o._matrix.setScale(width, height, 1);
   }
   MO.FE3dShape_setBitmapData = function FE3dShape_setBitmapData(bitmapData){
      var o = this;
      o._renderable = bitmapData;
   }
   MO.FE3dShape_vertexBuffers = function FE3dShape_vertexBuffers(){
      return this._renderable.vertexBuffers();
   }
   MO.FE3dShape_material = function FE3dShape_material(){
      return this._renderable.material();
   }
   MO.FE3dShape_findVertexBuffer = function FE3dShape_findVertexBuffer(p){
      return this._renderable.findVertexBuffer(p);
   }
   MO.FE3dShape_findTexture = function FE3dShape_findTexture(p){
      return this._renderable.findTexture(p);
   }
   MO.FE3dShape_textures = function FE3dShape_textures(){
      return this._renderable.textures();
   }
   MO.FE3dShape_processLoad = function FE3dShape_processLoad(){
      var o = this;
      return true;
   }
   MO.FE3dShape_process = function FE3dShape_process(){
      var o = this;
      o.__base.FE3dMeshRenderable.process.call(o);
   }
   MO.FE3dShape_loadUrl = function FE3dShape_loadUrl(url){
      var o = this;
      var context = o._graphicContext;
      o._renderable = RConsole.find(FE3dShapeConsole).loadUrl(context, url);
      o._ready = false;
   }
   MO.FE3dShape_dispose = function FE3dShape_dispose(){
      var o = this;
      o._material = RObject.dispoe(o._material);
      o.__base.FE3dMeshRenderable.dispose.call(o);
   }
}
with(MO){
   MO.FE3dShapeConsole = function FE3dShapeConsole(o){
      o = RClass.inherits(this, o, FConsole);
      o._scopeCd  = EScope.Local;
      o._bitmaps  = null;
      o.construct = FE3dShapeConsole_construct;
      o.bitmaps   = FE3dShapeConsole_bitmaps;
      o.load      = FE3dShapeConsole_load;
      o.loadUrl   = FE3dShapeConsole_loadUrl;
      return o;
   }
   MO.FE3dShapeConsole_construct = function FE3dShapeConsole_construct(){
      var o = this;
      o.__base.FConsole.construct.call(o);
      o._bitmaps = new TDictionary();
   }
   MO.FE3dShapeConsole_bitmaps = function FE3dShapeConsole_bitmaps(){
      return this._bitmaps;
   }
   MO.FE3dShapeConsole_load = function FE3dShapeConsole_load(context, guid, code){
      var o = this;
      var flag = guid + '|' + code;
      var bitmap = o._bitmaps.get(flag);
      if(bitmap){
         return bitmap;
      }
      var url = RBrowser.hostPath(o._dataUrl + '?guid=' + guid + '&code=' + code);
      RLogger.info(o, 'Load bitmap. (url={1})', url);
      if(code == 'environment'){
         bitmap = RClass.create(FE3rBitmapCubePack);
      }else{
         bitmap = RClass.create(FE3rBitmapFlatPack);
      }
      bitmap.linkGraphicContext(context);
      bitmap.loadUrl(url);
      o._bitmaps.set(flag, bitmap);
      return bitmap;
   }
   MO.FE3dShapeConsole_loadUrl = function FE3dShapeConsole_loadUrl(context, url){
      var o = this;
      var bitmap = o._bitmaps.get(url);
      if(bitmap){
         return bitmap;
      }
      var loadUrl = RBrowser.contentPath(url);
      RLogger.info(o, 'Load bitmap from url. (url={1})', loadUrl);
      var bitmap = RClass.create(FE3dBitmapData);
      bitmap.linkGraphicContext(context);
      bitmap.setup();
      bitmap.loadUrl(url);
      o._bitmaps.set(url, bitmap);
      return bitmap;
   }
}
with(MO){
   MO.FE3dShapeData = function FE3dShapeData(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._ready            = false;
      o._image            = null;
      o._imageTexture     = null;
      o._size             = RClass.register(o, new AGetter('_size'));
      o._adjustSize       = RClass.register(o, new AGetter('_adjustSize'));
      o.onImageLoad       = FE3dShapeData_onImageLoad;
      o.construct         = FE3dShapeData_construct;
      o.testReady         = FE3dShapeData_testReady;
      o.setup             = FE3dShapeData_setup;
      o.loadUrl           = FE3dShapeData_loadUrl;
      o.dispose           = FE3dShapeData_dispose;
      return o;
   }
   MO.FE3dShapeData_onImageLoad = function FE3dShapeData_onImageLoad(event){
      var o = this;
      var context = o._graphicContext;
      var image = event.sender;
      var size = image.size();
      var width = size.width;
      var height = size.height;
      o._size.set(width, height);
      var adjustWidth = RInteger.pow2(width);
      var adjustHeight = RInteger.pow2(height);
      o._adjustSize.set(adjustWidth, adjustHeight);
      var canvasConsole = RConsole.find(FE2dCanvasConsole);
      var canvas = canvasConsole.allocBySize(adjustWidth, adjustHeight);
      var context2d = canvas.context();
      context2d.drawImage(image, 0, 0);
      o._imageTexture.upload(canvas);
      canvasConsole.free(canvas);
      image.dispose();
      o._ready = true;
   }
   MO.FE3dShapeData_construct = function FE3dShapeData_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      o._size = new SSize2();
      o._adjustSize = new SSize2();
      o._textures = new TDictionary();
      o._material = RClass.create(FE3dMaterial);
   }
   MO.FE3dShapeData_testReady = function FE3dShapeData_testReady(){
      return this._ready;
   }
   MO.FE3dShapeData_setup = function FE3dShapeData_setup(){
      var o = this;
      var context = o._graphicContext;
      o._vertexCount = 4;
      var data = [
         0,  0, 0,
         1,  0, 0,
         1, -1, 0,
         0, -1, 0 ];
      var buffer = o._vertexPositionBuffer = context.createVertexBuffer();
      buffer.setCode('position');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      buffer.upload(data, 4 * 3, 4);
      var stream = RClass.create(FE3sStream);
      stream.setCode('position');
      stream._dataCount = 4;
      stream._data = data;
      buffer._resource = stream;
      o.pushVertexBuffer(buffer);
      var data = [
         0, 1,
         1, 1,
         1, 0,
         0, 0];
      var buffer = o._vertexColorBuffer = context.createVertexBuffer();
      buffer.setCode('coord');
      buffer.setFormatCd(EG3dAttributeFormat.Float2);
      buffer.upload(data, 4 * 2, 4);
      var stream = RClass.create(FE3sStream);
      stream.setCode('coord');
      stream._dataCount = 4;
      stream._data = data;
      buffer._resource = stream;
      o.pushVertexBuffer(buffer);
      var data = [0, 1, 2, 0, 2, 3];
      var buffer = context.createIndexBuffer();
      buffer.upload(data, 6);
      var stream = RClass.create(FE3sStream);
      stream.setCode('index16');
      stream._dataCount = 2;
      stream._data = data;
      buffer._resource = stream;
      o.pushIndexBuffer(buffer);
      var texture = o._imageTexture = context.createFlatTexture();
      texture.setOptionFlipY(true);
      o._textures.set('diffuse', texture);
      o._material._textures = o._textures;
      o._material.info().optionDouble = true;
   }
   MO.FE3dShapeData_loadUrl = function FE3dShapeData_loadUrl(url){
      var o = this;
      var image = RClass.create(FImage);
      image.addLoadListener(o, o.onImageLoad);
      image.loadUrl(url);
      o._ready = false;
   }
   MO.FE3dShapeData_dispose = function FE3dShapeData_dispose(){
      var o = this;
      o._size = RObject.dispose(o._size);
      o._adjustSize = RObject.dispose(o._adjustSize);
      o._vertexBuffers = RObject.dispose(o._vertexBuffers);
      o._indexBuffer = RObject.dispose(o._indexBuffer);
      o._imageTexture = RObject.dispose(o._imageTexture);
      o._textures = RObject.dispose(o._textures);
      o.__base.FE3dRenderable.dispose.call(o);
   }
}
with(MO){
   MO.FE3dSphere = function FE3dSphere(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._outline              = null;
      o._splitCount           = 8;
      o._vertexPositionBuffer = null;
      o._vertexColorBuffer    = null;
      o.construct             = FE3dSphere_construct;
      o.splitCount            = FE3dSphere_splitCount;
      o.setSplitCount         = FE3dSphere_setSplitCount;
      o.setup                 = FE3dSphere_setup;
      return o;
   }
   MO.FE3dSphere_construct = function FE3dSphere_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      o._material = RClass.create(FE3dMaterial);
      o._outline = new SOutline3();
   }
   MO.FE3dSphere_splitCount = function FE3dSphere_splitCount(){
      return this._splitCount;
   }
   MO.FE3dSphere_setSplitCount = function FE3dSphere_setSplitCount(count){
      this._splitCount = count;
   }
   MO.FE3dSphere_setup = function FE3dSphere_setup(){
      var o = this;
      var context = o._graphicContext;
      var positions = new TArray();
      var normals = new TArray();
      var cr = o._splitCount * 2;
      var cz = o._splitCount;
      var stepr = Math.PI * 2 / cr;
      var stepz = Math.PI / cz;
      var count = 0;
      for(var rz = 0; rz <= cz; rz++){
         for(var r = 0; r < cr; r++){
            var radius = stepr * r - Math.PI;
            var radiusZ = stepz * rz - RConst.PI_2;
            var x = Math.sin(radius) * Math.cos(radiusZ);
            var y = Math.sin(radiusZ);
            var z = -Math.cos(radius) * Math.cos(radiusZ);
            positions.push(x, y, z);
            normals.push(x, y, z);
            count++;
         }
      }
      o._vertexCount = count;
      var buffer = o._vertexPositionBuffer = context.createVertexBuffer();
      buffer.setCode('position');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      buffer.upload(new Float32Array(positions.memory()), 4 * 3, count);
      o.pushVertexBuffer(buffer);
      var buffer = o._vertexColorBuffer = context.createVertexBuffer();
      buffer.setCode('normal');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      buffer.upload(new Float32Array(normals.memory()), 4 * 3, count);
      o.pushVertexBuffer(buffer);
      var indexes = new TArray();
      for(var rz = 0; rz < cz; rz++){
         for(var r = 0; r < cr; r++){
            var i = cr * rz;
            var ci = i + r;
            var ni = i + r + cr;
            if(r == cr - 1){
               indexes.push(ci, ni, i);
               indexes.push(ni, i + cr, i);
            }else{
               indexes.push(ci, ni, ci + 1);
               indexes.push(ni, ni + 1, ci + 1);
            }
         }
      }
      var buffer = context.createIndexBuffer();
      buffer.upload(new Uint16Array(indexes.memory()), indexes.length());
      o.pushIndexBuffer(buffer);
      o.update();
      var info = o.material().info();
      info.ambientColor.set(0.2, 0.2, 0.2, 1);
      info.diffuseColor.set(0.8, 0.8, 0.8, 1);
      info.specularColor.set(0.8, 0.8, 0.8, 1);
      info.specularLevel = 64;
   }
}
with(MO){
   MO.FE3dVideo = function FE3dVideo(o){
      o = RClass.inherits(this, o, FE3dMeshRenderable, MListenerLoad);
      o._ready           = false;
      o._size            = null;
      o.construct        = FE3dVideo_construct;
      o.testReady        = FE3dVideo_testReady;
      o.size             = FE3dVideo_size;
      o.setSize          = FE3dVideo_setSize;
      o.setVideoData    = FE3dVideo_setVideoData;
      o.vertexBuffers    = FE3dVideo_vertexBuffers;
      o.material         = FE3dVideo_material;
      o.findVertexBuffer = FE3dVideo_findVertexBuffer;
      o.findTexture      = FE3dVideo_findTexture;
      o.textures         = FE3dVideo_textures;
      o.processLoad      = FE3dVideo_processLoad;
      o.process          = FE3dVideo_process;
      o.loadUrl          = FE3dVideo_loadUrl;
      o.dispose          = FE3dVideo_dispose;
      return o;
   }
   MO.FE3dVideo_construct = function FE3dVideo_construct(){
      var o = this;
      o.__base.FE3dMeshRenderable.construct.call(o);
      o._size = new SSize2();
   }
   MO.FE3dVideo_testReady = function FE3dVideo_testReady(){
      var o = this;
      if(!o._ready){
         var renderable = o._renderable;
         if(renderable){
            o._ready = renderable.testReady();
            if(o._ready){
               var event = new SEvent(o);
               o.processLoadListener(event);
               event.dispose();
            }
            o._materialReference = renderable;
         }
      }
      return o._ready;
   }
   MO.FE3dVideo_size = function FE3dVideo_size(){
      return this._size;
   }
   MO.FE3dVideo_setSize = function FE3dVideo_setSize(width, height){
      var o = this;
      o._size.set(width, height);
      o._matrix.setScale(width, height, 1);
   }
   MO.FE3dVideo_setVideoData = function FE3dVideo_setVideoData(videoData){
      var o = this;
      o._renderable = videoData;
   }
   MO.FE3dVideo_vertexBuffers = function FE3dVideo_vertexBuffers(){
      return this._renderable.vertexBuffers();
   }
   MO.FE3dVideo_material = function FE3dVideo_material(){
      return this._renderable.material();
   }
   MO.FE3dVideo_findVertexBuffer = function FE3dVideo_findVertexBuffer(p){
      return this._renderable.findVertexBuffer(p);
   }
   MO.FE3dVideo_findTexture = function FE3dVideo_findTexture(p){
      return this._renderable.findTexture(p);
   }
   MO.FE3dVideo_textures = function FE3dVideo_textures(){
      return this._renderable.textures();
   }
   MO.FE3dVideo_processLoad = function FE3dVideo_processLoad(){
      var o = this;
      return true;
   }
   MO.FE3dVideo_process = function FE3dVideo_process(){
      var o = this;
      o.__base.FE3dMeshRenderable.process.call(o);
   }
   MO.FE3dVideo_loadUrl = function FE3dVideo_loadUrl(url){
      var o = this;
      var context = o._graphicContext;
      o._renderable = RConsole.find(FE3dVideoConsole).loadUrl(context, url);
      o._ready = false;
   }
   MO.FE3dVideo_dispose = function FE3dVideo_dispose(){
      var o = this;
      o._material = RObject.dispoe(o._material);
      o.__base.FE3dMeshRenderable.dispose.call(o);
   }
}
with(MO){
   MO.FE3dVideoConsole = function FE3dVideoConsole(o){
      o = RClass.inherits(this, o, FConsole);
      o._scopeCd  = EScope.Local;
      o._videos   = null;
      o._dataUrl  = '/cloud.resource.bitmap.wv'
      o.construct = FE3dVideoConsole_construct;
      o.videos    = FE3dVideoConsole_videos;
      o.load      = FE3dVideoConsole_load;
      o.loadUrl   = FE3dVideoConsole_loadUrl;
      return o;
   }
   MO.FE3dVideoConsole_construct = function FE3dVideoConsole_construct(){
      var o = this;
      o.__base.FConsole.construct.call(o);
      o._videos = new TDictionary();
   }
   MO.FE3dVideoConsole_videos = function FE3dVideoConsole_videos(){
      return this._videos;
   }
   MO.FE3dVideoConsole_load = function FE3dVideoConsole_load(context, guid, code){
      var o = this;
      var flag = guid + '|' + code;
      var bitmap = o._videos.get(flag);
      if(bitmap){
         return bitmap;
      }
      var url = RBrowser.hostPath(o._dataUrl + '?guid=' + guid + '&code=' + code);
      RLogger.info(o, 'Load bitmap. (url={1})', url);
      if(code == 'environment'){
         bitmap = RClass.create(FE3rBitmapCubePack);
      }else{
         bitmap = RClass.create(FE3rBitmapFlatPack);
      }
      bitmap.linkGraphicContext(context);
      bitmap.loadUrl(url);
      o._videos.set(flag, bitmap);
      return bitmap;
   }
   MO.FE3dVideoConsole_loadUrl = function FE3dVideoConsole_loadUrl(context, url){
      var o = this;
      var bitmap = o._videos.get(url);
      if(bitmap){
         return bitmap;
      }
      var loadUrl = RBrowser.contentPath(url);
      RLogger.info(o, 'Load bitmap from url. (url={1})', loadUrl);
      var bitmap = RClass.create(FE3dVideoData);
      bitmap.linkGraphicContext(context);
      bitmap.setup();
      bitmap.loadUrl(url);
      o._videos.set(url, bitmap);
      return bitmap;
   }
}
with(MO){
   MO.FE3dVideoData = function FE3dVideoData(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      o._ready            = false;
      o._image            = null;
      o._imageTexture     = null;
      o._size             = RClass.register(o, new AGetter('_size'));
      o._adjustSize       = RClass.register(o, new AGetter('_adjustSize'));
      o.onImageLoad       = FE3dVideoData_onImageLoad;
      o.ohVideoEnded      = FE3dVideoData_ohVideoEnded;
      o.construct         = FE3dVideoData_construct;
      o.testReady         = FE3dVideoData_testReady;
      o.setup             = FE3dVideoData_setup;
      o.loadUrl           = FE3dVideoData_loadUrl;
      o.process           = FE3dVideoData_process;
      o.dispose           = FE3dVideoData_dispose;
      return o;
   }
   MO.FE3dVideoData_onImageLoad = function FE3dVideoData_onImageLoad(event){
      var o = this.__linker;
      var hVideo = o._hVideo;
      hVideo.width = 1024;
      hVideo.height = 512;
      o._ready = true;
   }
   MO.FE3dVideoData_ohVideoEnded = function FE3dVideoData_ohVideoEnded(){
      var o = this.__linker;
      var hVideo = o._hVideo;
      debugger
   }
   MO.FE3dVideoData_construct = function FE3dVideoData_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      o._size = new SSize2();
      o._adjustSize = new SSize2();
      o._textures = new TDictionary();
      o._material = RClass.create(FE3dMaterial);
   }
   MO.FE3dVideoData_testReady = function FE3dVideoData_testReady(){
      return this._ready;
   }
   MO.FE3dVideoData_setup = function FE3dVideoData_setup(){
      var o = this;
      var context = o._graphicContext;
      o._vertexCount = 4;
      var data = [
         0,  0, 0,
         1,  0, 0,
         1, -1, 0,
         0, -1, 0 ];
      var buffer = o._vertexPositionBuffer = context.createVertexBuffer();
      buffer.setCode('position');
      buffer.setFormatCd(EG3dAttributeFormat.Float3);
      buffer.upload(data, 4 * 3, 4);
      var stream = RClass.create(FE3sStream);
      stream.setCode('position');
      stream._dataCount = 4;
      stream._data = data;
      buffer._resource = stream;
      o.pushVertexBuffer(buffer);
      var data = [
         0, 1,
         1, 1,
         1, 0,
         0, 0];
      var buffer = o._vertexColorBuffer = context.createVertexBuffer();
      buffer.setCode('coord');
      buffer.setFormatCd(EG3dAttributeFormat.Float2);
      buffer.upload(data, 4 * 2, 4);
      var stream = RClass.create(FE3sStream);
      stream.setCode('coord');
      stream._dataCount = 4;
      stream._data = data;
      buffer._resource = stream;
      o.pushVertexBuffer(buffer);
      var data = [0, 1, 2, 0, 2, 3];
      var buffer = context.createIndexBuffer();
      buffer.upload(data, 6);
      var stream = RClass.create(FE3sStream);
      stream.setCode('index16');
      stream._dataCount = 2;
      stream._data = data;
      buffer._resource = stream;
      o.pushIndexBuffer(buffer);
      var texture = o._imageTexture = context.createFlatTexture();
      texture.setOptionFlipY(true);
      o._textures.set('diffuse', texture);
      o._material._textures = o._textures;
      o._material.info().optionDouble = true;
   }
   MO.FE3dVideoData_loadUrl = function FE3dVideoData_loadUrl(url){
      var o = this;
      var video = o._hVideo = document.createElement('VIDEO');
      video.__linker = o;
      video.autoplay = true;
      video.loop = true;
      video.src = url;
      video.addEventListener('canplay', o.onImageLoad);
      video.load();
      o._ready = false;
   }
   MO.FE3dVideoData_process = function FE3dVideoData_process(){
      var o = this;
      if(o._ready){
         o._imageTexture.upload(o._hVideo);
      }
   }
   MO.FE3dVideoData_dispose = function FE3dVideoData_dispose(){
      var o = this;
      o._size = RObject.dispose(o._size);
      o._adjustSize = RObject.dispose(o._adjustSize);
      o._vertexBuffers = RObject.dispose(o._vertexBuffers);
      o._indexBuffer = RObject.dispose(o._indexBuffer);
      o._imageTexture = RObject.dispose(o._imageTexture);
      o._textures = RObject.dispose(o._textures);
      o.__base.FE3dRenderable.dispose.call(o);
   }
}
