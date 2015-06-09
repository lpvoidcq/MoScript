with(MO){
   //==========================================================
   // <T>渲染模型网格。</T>
   //
   // @author maocy
   // @history 150106
   //==========================================================
   MO.FE3dVideoData = function FE3dVideoData(o){
      o = RClass.inherits(this, o, FE3dRenderable);
      //..........................................................
      // @attribute
      o._ready            = false;
      // @attribute
      o._image            = null;
      o._imageTexture     = null;
      o._size             = RClass.register(o, new AGetter('_size'));
      o._adjustSize       = RClass.register(o, new AGetter('_adjustSize'));
      //..........................................................
      // @event
      o.onImageLoad       = FE3dVideoData_onImageLoad;
      o.ohVideoEnded      = FE3dVideoData_ohVideoEnded;
      //..........................................................
      // @method
      o.construct         = FE3dVideoData_construct;
      // @method
      o.testReady         = FE3dVideoData_testReady;
      // @method
      o.setup             = FE3dVideoData_setup;
      o.loadUrl           = FE3dVideoData_loadUrl;
      o.process           = FE3dVideoData_process;
      // @method
      o.dispose           = FE3dVideoData_dispose;
      return o;
   }

   //==========================================================
   // <T>构造处理。</T>
   //
   // @method
   //==========================================================
   MO.FE3dVideoData_onImageLoad = function FE3dVideoData_onImageLoad(event){
      //debugger
      var o = this.__linker;
      var hVideo = o._hVideo;
      hVideo.width = 1024;
      hVideo.height = 512;
      //hVideo.currentTime = 0;
      //hVideo.play();
      //var context = o._graphicContext;
      //var image = event.sender;
      // 设置大小
      //var size = image.size();
      //var width = size.width;
      //var height = size.height;
      //o._size.set(width, height);
      //var adjustWidth = RInteger.pow2(width);
      //var adjustHeight = RInteger.pow2(height);
      //o._adjustSize.set(adjustWidth, adjustHeight);
      // 绘制画板
      //var canvasConsole = RConsole.find(FE2dCanvasConsole);
      //var canvas = canvasConsole.allocBySize(adjustWidth, adjustHeight);
      //var canvas = canvasConsole.allocBySize(1024, 512);
      //var context2d = canvas.context();
      //context2d.drawImage(image, 0, 0);
      // 创建纹理
      //o._imageTexture.upload(canvas);
      // 释放画板
      //canvasConsole.free(canvas);
      // 释放位图
      //image.dispose();
      // 设置属性
      o._ready = true;
   }

   MO.FE3dVideoData_ohVideoEnded = function FE3dVideoData_ohVideoEnded(){
      var o = this.__linker;
      var hVideo = o._hVideo;
      debugger
   }

   //==========================================================
   // <T>构造处理。</T>
   //
   // @method
   //==========================================================
   MO.FE3dVideoData_construct = function FE3dVideoData_construct(){
      var o = this;
      o.__base.FE3dRenderable.construct.call(o);
      // 设置属性
      o._size = new SSize2();
      o._adjustSize = new SSize2();
      o._textures = new TDictionary();
      o._material = RClass.create(FE3dMaterial);
   }

   //==========================================================
   // <T>测试是否加载完成。</T>
   //
   // @method
   // @return 是否完成
   //==========================================================
   MO.FE3dVideoData_testReady = function FE3dVideoData_testReady(){
      return this._ready;
   }

   //==========================================================
   // <T>加载处理。</T>
   //
   // @method
   //==========================================================
   MO.FE3dVideoData_setup = function FE3dVideoData_setup(){
      var o = this;
      var context = o._graphicContext;
      o._vertexCount = 4;
      // 设置顶点数据
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
      // 设置纹理数据
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
      // 设置索引数据
      var data = [0, 1, 2, 0, 2, 3];
      var buffer = context.createIndexBuffer();
      buffer.upload(data, 6);
      var stream = RClass.create(FE3sStream);
      stream.setCode('index16');
      stream._dataCount = 2;
      stream._data = data;
      buffer._resource = stream;
      o.pushIndexBuffer(buffer);
      // 创建纹理
      var texture = o._imageTexture = context.createFlatTexture();
      texture.setOptionFlipY(true);
      o._textures.set('diffuse', texture);
      o._material._textures = o._textures;
      o._material.info().optionDouble = true;
   }

   //==========================================================
   // <T>加载处理。</T>
   //
   // @method
   //==========================================================
   MO.FE3dVideoData_loadUrl = function FE3dVideoData_loadUrl(url){
      var o = this;
      // 加载图片
      var video = o._hVideo = document.createElement('VIDEO');
      video.__linker = o;
      video.autoplay = true;
      video.loop = true;
      video.src = url;
      video.addEventListener('canplay', o.onImageLoad);
      video.load();
      // 设置属性
      o._ready = false;
   }

   //==========================================================
   // <T>加载处理。</T>
   //
   // @method
   //==========================================================
   MO.FE3dVideoData_process = function FE3dVideoData_process(){
      var o = this;
      if(o._ready){
         //o._hVideo.play();
         o._imageTexture.upload(o._hVideo);
      }
   }

   //==========================================================
   // <T>释放处理。</T>
   //
   // @method
   //==========================================================
   MO.FE3dVideoData_dispose = function FE3dVideoData_dispose(){
      var o = this;
      // 释放属性
      o._size = RObject.dispose(o._size);
      o._adjustSize = RObject.dispose(o._adjustSize);
      o._vertexBuffers = RObject.dispose(o._vertexBuffers);
      o._indexBuffer = RObject.dispose(o._indexBuffer);
      o._imageTexture = RObject.dispose(o._imageTexture);
      o._textures = RObject.dispose(o._textures);
      // 父处理
      o.__base.FE3dRenderable.dispose.call(o);
   }
}
