with(MO){
   MO.FWglContext = function FWglContext(o){
      o = RClass.inherits(this, o, FG3dContext);
      o._handle             = RClass.register(o, new AGetter('_handle'));
      o._handleInstance     = null;
      o._handleLayout       = null;
      o._handleSamplerS3tc  = null;
      o._handleDebugShader  = null;
      o._activeRenderTarget = null;
      o._activeTextureSlot  = null;
      o._parameters         = null;
      o._extensions         = null;
      o._statusRecord       = false;
      o._recordBuffers      = null;
      o._recordSamplers     = null;
      o._data9              = null;
      o._data16             = null;
      o.construct           = FWglContext_construct;
      o.linkCanvas          = FWglContext_linkCanvas;
      o.parameters          = FWglContext_parameters;
      o.extensions          = FWglContext_extensions;
      o.recordBuffers       = FWglContext_recordBuffers;
      o.recordSamplers      = FWglContext_recordSamplers;
      o.recordBegin         = FWglContext_recordBegin;
      o.recordEnd           = FWglContext_recordEnd;
      o.createProgram       = FWglContext_createProgram;
      o.createLayout        = FWglContext_createLayout;
      o.createVertexBuffer  = FWglContext_createVertexBuffer;
      o.createIndexBuffer   = FWglContext_createIndexBuffer;
      o.createFlatTexture   = FWglContext_createFlatTexture;
      o.createCubeTexture   = FWglContext_createCubeTexture;
      o.createRenderTarget  = FWglContext_createRenderTarget;
      o.setViewport         = FWglContext_setViewport;
      o.setFillMode         = FWglContext_setFillMode;
      o.setDepthMode        = FWglContext_setDepthMode;
      o.setCullingMode      = FWglContext_setCullingMode;
      o.setBlendFactors     = FWglContext_setBlendFactors;
      o.setScissorRectangle = FWglContext_setScissorRectangle;
      o.setRenderTarget     = FWglContext_setRenderTarget;
      o.setProgram          = FWglContext_setProgram;
      o.bindConst           = FWglContext_bindConst;
      o.bindVertexBuffer    = FWglContext_bindVertexBuffer;
      o.bindTexture         = FWglContext_bindTexture;
      o.clear               = FWglContext_clear;
      o.clearColor          = FWglContext_clearColor;
      o.clearDepth          = FWglContext_clearDepth;
      o.readPixels          = FWglContext_readPixels;
      o.drawTriangles       = FWglContext_drawTriangles;
      o.present             = FWglContext_present;
      o.checkError          = FWglContext_checkError;
      o.dispose             = FWglContext_dispose;
      return o;
   }
   MO.FWglContext_construct = function FWglContext_construct(){
      var o = this;
      o.__base.FG3dContext.construct.call(o);
      o._capability = new SG3dContextCapability();
      o._data9 = new Float32Array(9);
      o._data16 = new Float32Array(16);
      o._recordBuffers = new TObjects();
      o._recordSamplers = new TObjects();
   }
   MO.FWglContext_linkCanvas = function FWglContext_linkCanvas(hCanvas){
      var o = this;
      o.__base.FG3dContext.linkCanvas.call(o, hCanvas)
      o._hCanvas = hCanvas;
      if(hCanvas.getContext){
         var parameters = new Object();
         parameters.alpha = o._optionAlpha;
         parameters.antialias = o._optionAntialias;
         var handle = hCanvas.getContext('experimental-webgl2', parameters);
         if(!handle){
            handle = hCanvas.getContext('experimental-webgl', parameters);
         }
         if(!handle){
            handle = hCanvas.getContext('webgl', parameters);
         }
         if(!handle){
            throw new TError("Current browser can't support WebGL technique.");
         }
         o._handle = handle;
         o._contextAttributes = handle.getContextAttributes();
      }else{
         throw new TError("Canvas can't support WebGL technique.");
      }
      var handle = o._handle;
      o.setViewport(0, 0, hCanvas.width, hCanvas.height);
      o.setDepthMode(true, EG3dDepthMode.LessEqual);
      o.setCullingMode(true, EG3dCullMode.Front);
      var capability = o._capability;
      capability.vendor = handle.getParameter(handle.VENDOR);
      capability.version = handle.getParameter(handle.VERSION);
      capability.shaderVersion = handle.getParameter(handle.SHADING_LANGUAGE_VERSION);
      capability.attributeCount = handle.getParameter(handle.MAX_VERTEX_ATTRIBS);
      capability.vertexConst = handle.getParameter(handle.MAX_VERTEX_UNIFORM_VECTORS);
      capability.varyingCount = handle.getParameter(handle.MAX_VARYING_VECTORS);
      capability.fragmentConst = handle.getParameter(handle.MAX_FRAGMENT_UNIFORM_VECTORS);
      capability.samplerCount = handle.getParameter(handle.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
      capability.samplerSize = handle.getParameter(handle.MAX_TEXTURE_SIZE);
      var e = o._handleInstance = handle.getExtension('ANGLE_instanced_arrays');
      if(e){
         capability.optionInstance = true;
      }
      capability.mergeCount = parseInt((capability.vertexConst - 32) / 4);
      var e = o._handleLayout = handle.getExtension('OES_vertex_array_object');
      if(e){
         capability.optionLayout = true;
      }
      var e = handle.getExtension('OES_element_index_uint');
      if(e){
         capability.optionIndex32 = true;
      }
      var e = o._handleSamplerS3tc = handle.getExtension('WEBGL_compressed_texture_s3tc');
      if(e){
         capability.samplerCompressRgb = e.COMPRESSED_RGB_S3TC_DXT1_EXT;
         capability.samplerCompressRgba = e.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      }
      var s = capability.shader = new Object();
      var vertexPrecision = s.vertexPrecision = new Object();
      if(handle.getShaderPrecisionFormat){
         vertexPrecision.floatLow = handle.getShaderPrecisionFormat(handle.VERTEX_SHADER, handle.LOW_FLOAT);
         vertexPrecision.floatMedium = handle.getShaderPrecisionFormat(handle.VERTEX_SHADER, handle.MEDIUM_FLOAT);
         vertexPrecision.floatHigh = handle.getShaderPrecisionFormat(handle.VERTEX_SHADER, handle.HIGH_FLOAT);
         vertexPrecision.intLow = handle.getShaderPrecisionFormat(handle.VERTEX_SHADER, handle.LOW_INT);
         vertexPrecision.intMedium = handle.getShaderPrecisionFormat(handle.VERTEX_SHADER, handle.MEDIUM_INT);
         vertexPrecision.intHigh = handle.getShaderPrecisionFormat(handle.VERTEX_SHADER, handle.HIGH_INT);
      }
      var fragmentPrecision = s.fragmentPrecision = new Object();
      if(handle.getShaderPrecisionFormat){
         fragmentPrecision.floatLow = handle.getShaderPrecisionFormat(handle.FRAGMENT_SHADER, handle.LOW_FLOAT);
         fragmentPrecision.floatMedium = handle.getShaderPrecisionFormat(handle.FRAGMENT_SHADER, handle.MEDIUM_FLOAT);
         fragmentPrecision.floatHigh = handle.getShaderPrecisionFormat(handle.FRAGMENT_SHADER, handle.HIGH_FLOAT);
         fragmentPrecision.intLow = handle.getShaderPrecisionFormat(handle.FRAGMENT_SHADER, handle.LOW_INT);
         fragmentPrecision.intMedium = handle.getShaderPrecisionFormat(handle.FRAGMENT_SHADER, handle.MEDIUM_INT);
         fragmentPrecision.intHigh = handle.getShaderPrecisionFormat(handle.FRAGMENT_SHADER, handle.HIGH_INT);
      }
      var e = o._handleDebugShader = handle.getExtension('WEBGL_debug_shaders');
      if(e){
         capability.optionShaderSource = true;
      }
   }
   MO.FWglContext_parameters = function FWglContext_parameters(){
      var o = this;
      var parameters = o._parameters;
      if(parameters){
         return parameters;
      }
      var names =['ACTIVE_TEXTURE',
         'ALIASED_LINE_WIDTH_RANGE',
         'ALIASED_POINT_SIZE_RANGE',
         'ALPHA_BITS',
         'ARRAY_BUFFER_BINDING',
         'BLEND',
         'BLEND_COLOR',
         'BLEND_DST_ALPHA',
         'BLEND_DST_RGB',
         'BLEND_EQUATION_ALPHA',
         'BLEND_EQUATION_RGB',
         'BLEND_SRC_ALPHA',
         'BLEND_SRC_RGB',
         'BLUE_BITS',
         'COLOR_CLEAR_VALUE',
         'COLOR_WRITEMASK',
         'COMPRESSED_TEXTURE_FORMATS',
         'CULL_FACE',
         'CULL_FACE_MODE',
         'CURRENT_PROGRAM',
         'DEPTH_BITS',
         'DEPTH_CLEAR_VALUE',
         'DEPTH_FUNC',
         'DEPTH_RANGE',
         'DEPTH_TEST',
         'DEPTH_WRITEMASK',
         'DITHER',
         'ELEMENT_ARRAY_BUFFER_BINDING',
         'FRAMEBUFFER_BINDING',
         'FRONT_FACE',
         'GENERATE_MIPMAP_HINT',
         'GREEN_BITS',
         'IMPLEMENTATION_COLOR_READ_FORMAT',
         'IMPLEMENTATION_COLOR_READ_TYPE',
         'LINE_WIDTH',
         'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
         'MAX_CUBE_MAP_TEXTURE_SIZE',
         'MAX_FRAGMENT_UNIFORM_VECTORS',
         'MAX_RENDERBUFFER_SIZE',
         'MAX_TEXTURE_IMAGE_UNITS',
         'MAX_TEXTURE_SIZE',
         'MAX_VARYING_VECTORS',
         'MAX_VERTEX_ATTRIBS',
         'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
         'MAX_VERTEX_UNIFORM_VECTORS',
         'MAX_VIEWPORT_DIMS',
         'PACK_ALIGNMENT',
         'POLYGON_OFFSET_FACTOR',
         'POLYGON_OFFSET_FILL',
         'POLYGON_OFFSET_UNITS',
         'RED_BITS',
         'RENDERBUFFER_BINDING',
         'RENDERER',
         'SAMPLE_BUFFERS',
         'SAMPLE_COVERAGE_INVERT',
         'SAMPLE_COVERAGE_VALUE',
         'SAMPLES',
         'SCISSOR_BOX',
         'SCISSOR_TEST',
         'SHADING_LANGUAGE_VERSION',
         'STENCIL_BACK_FAIL',
         'STENCIL_BACK_FUNC',
         'STENCIL_BACK_PASS_DEPTH_FAIL',
         'STENCIL_BACK_PASS_DEPTH_PASS',
         'STENCIL_BACK_REF',
         'STENCIL_BACK_VALUE_MASK',
         'STENCIL_BACK_WRITEMASK',
         'STENCIL_BITS',
         'STENCIL_CLEAR_VALUE',
         'STENCIL_FAIL',
         'STENCIL_FUNC',
         'STENCIL_PASS_DEPTH_FAIL',
         'STENCIL_PASS_DEPTH_PASS',
         'STENCIL_REF',
         'STENCIL_TEST',
         'STENCIL_VALUE_MASK',
         'STENCIL_WRITEMASK',
         'SUBPIXEL_BITS',
         'TEXTURE_BINDING_2D',
         'TEXTURE_BINDING_CUBE_MAP',
         'UNPACK_ALIGNMENT',
         'UNPACK_COLORSPACE_CONVERSION_WEBGL',
         'UNPACK_FLIP_Y_WEBGL',
         'UNPACK_PREMULTIPLY_ALPHA_WEBGL',
         'VENDOR',
         'VERSION',
         'VIEWPORT'];
      var handle = o._handle;
      var count = names.length;
      parameters = new Object();
      for(var i = 0; i < count; i++){
         var name = names[i];
         parameters[name] = handle.getParameter(handle[name]);
      }
      var extension = handle.getExtension('WEBGL_debug_renderer_info');
      if(extension){
         parameters['UNMASKED_RENDERER_WEBGL'] = handle.getParameter(extension.UNMASKED_RENDERER_WEBGL);
         parameters['UNMASKED_VENDOR_WEBGL'] = handle.getParameter(extension.UNMASKED_VENDOR_WEBGL);
      }
      o._parameters = parameters;
      return parameters;
   }
   MO.FWglContext_extensions = function FWglContext_extensions(){
      var o = this;
      var extensions = o._extensions;
      if(!extensions){
         extensions = o._extensions = new Object();
         var handle = o._handle;
         var extensionNames = handle.getSupportedExtensions();
         var count = extensionNames.length;
         for(var i = 0; i < count; i++){
            var extensionName = extensionNames[i];
            extensions[name] = handle.getExtension(extensionName);
         }
      }
      return extensions;
   }
   MO.FWglContext_recordBuffers = function FWglContext_recordBuffers(){
      return this._recordBuffers;
   }
   MO.FWglContext_recordSamplers = function FWglContext_recordSamplers(){
      return this._recordSamplers;
   }
   MO.FWglContext_recordBegin = function FWglContext_recordBegin(){
      var o = this;
      o._recordBuffers.clear();
      o._recordSamplers.clear();
      o._statusRecord = true;
   }
   MO.FWglContext_recordEnd = function FWglContext_recordEnd(){
      this._statusRecord = false;
   }
   MO.FWglContext_createProgram = function FWglContext_createProgram(){
      var o = this;
      var program = RClass.create(FWglProgram);
      program.linkGraphicContext(o);
      program.setup();
      o._storePrograms.push(program);
      o._statistics._programTotal++;
      return program;
   }
   MO.FWglContext_createLayout = function FWglContext_createLayout(){
      var o = this;
      var layout = RClass.create(FWglLayout);
      layout.linkGraphicContext(o);
      if(o._capability.optionLayout){
         layout.setup();
      }
      o._storeLayouts.push(layout);
      o._statistics._layoutTotal++;
      return layout;
   }
   MO.FWglContext_createVertexBuffer = function FWglContext_createVertexBuffer(clazz){
      var o = this;
      var buffer = RClass.create(clazz ? clazz : FWglVertexBuffer);
      buffer.linkGraphicContext(o);
      buffer.setup();
      o._storeBuffers.push(buffer);
      o._statistics._vertexBufferTotal++;
      return buffer;
   }
   MO.FWglContext_createIndexBuffer = function FWglContext_createIndexBuffer(clazz){
      var o = this;
      var buffer = RClass.create(clazz ? clazz : FWglIndexBuffer);
      buffer.linkGraphicContext(o);
      buffer.setup();
      o._storeBuffers.push(buffer);
      o._statistics._indexBufferTotal++;
      return buffer;
   }
   MO.FWglContext_createFlatTexture = function FWglContext_createFlatTexture(){
      var o = this;
      var texture = RClass.create(FWglFlatTexture);
      texture.linkGraphicContext(o);
      texture.setup();
      o._storeTextures.push(texture);
      o._statistics._flatTextureTotal++;
      return texture;
   }
   MO.FWglContext_createCubeTexture = function FWglContext_createCubeTexture(){
      var o = this;
      var texture = RClass.create(FWglCubeTexture);
      texture.linkGraphicContext(o);
      texture.setup();
      o._storeTextures.push(texture);
      o._statistics._cubeTextureTotal++;
      return texture;
   }
   MO.FWglContext_createRenderTarget = function FWglContext_createRenderTarget(){
      var o = this;
      var target = RClass.create(FWglRenderTarget);
      target.linkGraphicContext(o);
      target.setup();
      o._storeTargets.push(target);
      o._statistics._targetTotal++;
      return target;
   }
   MO.FWglContext_setViewport = function FWglContext_setViewport(left, top, width, height){
      var o = this;
      o._size.set(width, height);
      o._handle.viewport(left, top, width, height);
   }
   MO.FWglContext_setFillMode = function FWglContext_setFillMode(fillModeCd){
      var o = this;
      var graphic = o._handle;
      if(o._fillModeCd == fillModeCd){
         return false;
      }
      o._statistics._frameFillModeCount++;
      switch(fillModeCd){
         case EG3dFillMode.Point:
            graphic.polygonMode(graphic.FRONT_AND_BACK, graphic.POINT);
            break;
         case EG3dFillMode.Line:
            graphic.polygonMode(graphic.FRONT_AND_BACK, graphic.LINE);
            break;
         case EG3dFillMode.Face:
            graphic.polygonMode(graphic.FRONT, graphic.FILL);
            break;
         default:
            throw new TError('Invalid parameter. (fill_mode={1})', fillModeCd);
      }
      o._fillModeCd = fillModeCd;
      return true;
   }
   MO.FWglContext_setDepthMode = function FWglContext_setDepthMode(depthFlag, depthCd){
      var o = this;
      var graphic = o._handle;
      if((o._optionDepth == depthFlag) && (o._depthModeCd == depthCd)){
         return false;
      }
      o._statistics._frameDepthModeCount++;
      if(o._optionDepth != depthFlag){
         if(depthFlag){
            graphic.enable(graphic.DEPTH_TEST);
         }else{
            graphic.disable(graphic.DEPTH_TEST);
         }
         o._optionDepth = depthFlag;
      }
      if(depthFlag && (o._depthModeCd != depthCd)){
         var depthCode = RWglUtility.convertDepthMode(graphic, depthCd);
         graphic.depthFunc(depthCode);
         o._depthModeCd = depthCd;
      }
      return true;
   }
   MO.FWglContext_setCullingMode = function FWglContext_setCullingMode(cullFlag, cullCd){
      var o = this;
      var graphic = o._handle;
      if((o._optionCull == cullFlag) && (o._cullModeCd == cullCd)){
         return false;
      }
      o._statistics._frameCullModeCount++;
      if(o._optionCull != cullFlag){
         if(cullFlag){
            graphic.enable(graphic.CULL_FACE);
         }else{
            graphic.disable(graphic.CULL_FACE);
         }
         o._optionCull = cullFlag;
      }
      if(cullFlag && (o._cullModeCd != cullCd)){
         var cullValue = RWglUtility.convertCullMode(graphic, cullCd);
         graphic.cullFace(cullValue);
         o._cullModeCd = cullCd;
      }
      return true;
   }
   MO.FWglContext_setBlendFactors = function FWglContext_setBlendFactors(blendFlag, sourceCd, tagetCd){
      var o = this;
      var graphic = o._handle;
      if((o._statusBlend == blendFlag) && (o._blendSourceCd == sourceCd) && (o._blendTargetCd == tagetCd)){
         return false;
      }
      o._statistics._frameBlendModeCount++;
      if(o._statusBlend != blendFlag){
         if(blendFlag){
            graphic.enable(graphic.BLEND);
         }else{
            graphic.disable(graphic.BLEND);
            o._blendSourceCd = 0;
            o._blendTargetCd = 0;
         }
         o._statusBlend = blendFlag;
      }
      if(blendFlag && ((o._blendSourceCd != sourceCd) || (o._blendTargetCd != tagetCd))){
         var sourceValue = RWglUtility.convertBlendFactors(graphic, sourceCd);
         var tagetValue = RWglUtility.convertBlendFactors(graphic, tagetCd);
         graphic.blendFunc(sourceValue, tagetValue);
         o._blendSourceCd = sourceCd;
         o._blendTargetCd = tagetCd;
      }
      return true;
   }
   MO.FWglContext_setScissorRectangle = function FWglContext_setScissorRectangle(left, top, width, height){
      this._handle.scissor(left, top, width, height);
   }
   MO.FWglContext_setRenderTarget = function FWglContext_setRenderTarget(renderTarget){
      var o = this;
      var graphic = o._handle;
      if(o._activeRenderTarget == renderTarget){
         return;
      }
      o._statistics._frameTargetCount++;
      var result = true;
      if(renderTarget == null){
         graphic.bindFramebuffer(graphic.FRAMEBUFFER, null);
         result = o.checkError("glBindFramebuffer", "Bind frame buffer. (frame_buffer={1})", null);
         if(!result){
            return result;
         }
         graphic.viewport(0, 0, o._size.width, o._size.height);
      }else{
         graphic.bindFramebuffer(graphic.FRAMEBUFFER, renderTarget._handle);
         result = o.checkError("glBindFramebuffer", "Bind frame buffer. (frame_buffer={1})", renderTarget._handle);
         if(!result){
            return result;
         }
         var size = renderTarget.size();
         graphic.viewport(0, 0, size.width, size.height);
      }
      o._activeRenderTarget = renderTarget;
      return result;
   }
   MO.FWglContext_setProgram = function FWglContext_setProgram(program){
      var o = this;
      var graphic = o._handle;
      if(o._program == program){
         return;
      }
      o._statistics._frameProgramCount++;
      if(program){
         graphic.useProgram(program._handle);
      }else{
         graphic.useProgram(null);
      }
      o._program = program;
      return o.checkError("useProgram", "Set program failure. (program={1}, program_native={2})", program, program._handle);
   }
   MO.FWglContext_bindConst = function FWglContext_bindConst(shaderCd, slot, formatCd, data, count){
      var o = this;
      var graphic = o._handle;
      var result = true;
      o._statistics._frameConstCount++;
      switch(formatCd){
         case EG3dParameterFormat.Float1:{
            graphic.uniform1fv(slot, data);
            o._statistics._frameConstLength += data.byteLength;
            result = o.checkError("uniform1fv", "Bind const data failure. (shader_cd={1}, slot={2}, data={3}, count={4})", shaderCd, slot, data, count);
            break;
         }
         case EG3dParameterFormat.Float2:{
            graphic.uniform2fv(slot, data);
            o._statistics._frameConstLength += data.byteLength;
            result = o.checkError("uniform2fv", "Bind const data failure. (shader_cd={1}, slot={2}, data={3}, count={4})", shaderCd, slot, data, count);
            break;
         }
         case EG3dParameterFormat.Float3:{
            graphic.uniform3fv(slot, data);
            o._statistics._frameConstLength += data.byteLength;
            result = o.checkError("uniform3fv", "Bind const data failure. (shader_cd={1}, slot={2}, data={3}, count={4})", shaderCd, slot, data, count);
            break;
         }
         case EG3dParameterFormat.Float4:{
            graphic.uniform4fv(slot, data);
            o._statistics._frameConstLength += data.byteLength;
            result = o.checkError("uniform4fv", "Bind const data failure. (shader_cd={1}, slot={2}, data={3}, count={4})", shaderCd, slot, data, count);
            break;
         }
         case EG3dParameterFormat.Float3x3:{
            var bytes = o._data9;
            bytes[ 0] = data[ 0];
            bytes[ 1] = data[ 4];
            bytes[ 2] = data[ 8];
            bytes[ 3] = data[ 1];
            bytes[ 4] = data[ 5];
            bytes[ 5] = data[ 9];
            bytes[ 6] = data[ 2];
            bytes[ 7] = data[ 6];
            bytes[ 8] = data[10];
            graphic.uniformMatrix3fv(slot, graphic.FALSE, bytes);
            o._statistics._frameConstLength += bytes.byteLength;
            result = o.checkError("uniformMatrix3fv", "Bind const matrix3x3 failure. (shader_cd={1}, slot={2}, data={3}, count={4})", shaderCd, slot, data, count);
            break;
         }
         case EG3dParameterFormat.Float4x4:{
            var bytes = null;
            if(data.constructor == Float32Array){
               bytes = data;
            }else if(data.writeData){
               bytes = o._data16;
               data.writeData(bytes, 0);
            }else{
               throw new TError('Unknown data type.');
            }
            graphic.uniformMatrix4fv(slot, graphic.FALSE, bytes);
            o._statistics._frameConstLength += bytes.byteLength;
            result = o.checkError("uniformMatrix4fv", "Bind const matrix4x4 failure. (shader_cd={1}, slot={2}, data={3}, count={4})", shaderCd, slot, data, count);
            break;
         }
         default:{
            throw new TError(o, 'Unknown format type. (format_cd={1})', formatCd);
         }
      }
      return result;
   }
   MO.FWglContext_bindVertexBuffer = function FWglContext_bindVertexBuffer(slot, vertexBuffer, offset, formatCd){
      var o = this;
      var graphic = o._handle;
      var result = true;
      o._statistics._frameBufferCount++;
      if(o._statusRecord){
         var layout = new SG3dLayoutBuffer();
         layout.slot = slot;
         layout.buffer = vertexBuffer;
         layout.index = offset;
         layout.formatCd = formatCd;
         o._recordBuffers.push(layout);
      }
      var handle = null;
      if(vertexBuffer != null){
         handle = vertexBuffer._handle;
      }
      graphic.bindBuffer(graphic.ARRAY_BUFFER, handle);
      result = o.checkError("bindBuffer", "Bind buffer. (buffer_id=%d)", handle);
      if(!result){
         return result;
      }
      if(vertexBuffer){
         graphic.enableVertexAttribArray(slot);
         result = o.checkError("enableVertexAttribArray", "Enable vertex attribute array. (slot=%d)", slot);
         if(!result){
            return result;
         }
      }else{
         graphic.disableVertexAttribArray(slot);
         result = o.checkError("disableVertexAttribArray", "Disable vertex attribute array. (slot=%d)", slot);
         return result;
      }
      var stride = vertexBuffer._stride;
      switch(formatCd){
         case EG3dAttributeFormat.Float1:
            graphic.vertexAttribPointer(slot, 1, graphic.FLOAT, false, stride, offset);
            break;
         case EG3dAttributeFormat.Float2:
            graphic.vertexAttribPointer(slot, 2, graphic.FLOAT, false, stride, offset);
            break;
         case EG3dAttributeFormat.Float3:
            graphic.vertexAttribPointer(slot, 3, graphic.FLOAT, false, stride, offset);
            break;
         case EG3dAttributeFormat.Float4:
            graphic.vertexAttribPointer(slot, 4, graphic.FLOAT, false, stride, offset);
            break;
         case EG3dAttributeFormat.Byte4:
            graphic.vertexAttribPointer(slot, 4, graphic.UNSIGNED_BYTE, false, stride, offset);
            break;
         case EG3dAttributeFormat.Byte4Normal:
            graphic.vertexAttribPointer(slot, 4, graphic.UNSIGNED_BYTE, true, stride, offset);
            break;
         default:
            throw new TError(o, "Unknown vertex format. (format_cd=%d)", formatCd);
            break;
      }
      result = o.checkError("glVertexAttribPointer", "Bind vertex attribute pointer. (slot=%d, format_cd=%d)", slot, formatCd);
      return result;
   }
   MO.FWglContext_bindTexture = function FWglContext_bindTexture(slot, index, texture){
      var o = this;
      var graphic = o._handle;
      var result = true;
      o._statistics._frameTextureCount++;
      if(o._statusRecord){
         var layout = new SG3dLayoutSampler();
         layout.slot = slot;
         layout.index = index;
         layout.texture = texture;
         o._recordSamplers.push(layout);
      }
      if(o._activeTextureSlot != slot){
         graphic.uniform1i(slot, index);
         graphic.activeTexture(graphic.TEXTURE0 + index);
         result = o.checkError("activeTexture", "Active texture failure. (slot=%d, index=%d)", slot, index);
         if(!result){
            return result;
         }
         o._activeTextureSlot = slot;
      }
      if(texture == null){
         graphic.bindTexture(graphic.TEXTURE_2D, null);
         result = o.checkError("bindTexture", "Bind texture clear failure. (slot=%d)", slot);
         return result;
      }
      var handle = texture._handle;
      switch(texture.textureCd()){
         case EG3dTexture.Flat2d:{
            graphic.bindTexture(graphic.TEXTURE_2D, handle);
            result = o.checkError("glBindTexture", "Bind flag texture failure. (texture_id=%d)", handle);
            if(!result){
               return result;
            }
            break;
         }
         case EG3dTexture.Cube:{
            graphic.bindTexture(graphic.TEXTURE_CUBE_MAP, handle);
            result = o.checkError("glBindTexture", "Bind cube texture failure. (texture_id=%d)", handle);
            if(!result){
               return result;
            }
            break;
         }
         default:{
            RLogger.fatal(o, null, "Unknown texture type.");
            break;
         }
      }
      return result;
   }
   MO.FWglContext_clear = function FWglContext_clear(red, green, blue, alpha, depth){
      var o = this;
      var graphic = o._handle;
      graphic.clearColor(red, green, blue, alpha);
      graphic.clearDepth(depth);
      graphic.clear(graphic.COLOR_BUFFER_BIT | graphic.DEPTH_BUFFER_BIT);
      o._statistics._frameClearCount++;
   }
   MO.FWglContext_clearColor = function FWglContext_clearColor(red, green, blue, alpha){
      var o = this;
      var graphic = o._handle;
      graphic.clearColor(red, green, blue, alpha);
      graphic.clear(graphic.COLOR_BUFFER_BIT);
      o._statistics._frameClearCount++;
   }
   MO.FWglContext_clearDepth = function FWglContext_clearDepth(depth){
      var o = this;
      var graphic = o._handle;
      graphic.clearDepth(depth);
      graphic.clear(graphic.DEPTH_BUFFER_BIT);
      o._statistics._frameClearCount++;
   }
   MO.FWglContext_readPixels = function FWglContext_readPixels(left, top, width, height){
      var o = this;
      var graphic = o._handle;
      var length = 4 * width * height;
      var data = new Uint8Array(length);
      graphic.readPixels(left, top, width, height, graphic.RGBA, graphic.UNSIGNED_BYTE, data);
      return data;
   }
   MO.FWglContext_drawTriangles = function FWglContext_drawTriangles(indexBuffer, offset, count){
      var o = this;
      var graphic = o._handle;
      var result = true;
      if(offset == null){
         offset = 0;
      }
      if(count == null){
         count = indexBuffer.count();
      }
      graphic.bindBuffer(graphic.ELEMENT_ARRAY_BUFFER, indexBuffer._handle);
      result = o.checkError("bindBuffer", "Bind element array buffer failure. (index=0x%08X, offset=%d, count=%d, buffer_id)", indexBuffer, offset, count, indexBuffer._handle);
      if(!result){
          return result;
      }
      var strideCd = indexBuffer.strideCd();
      var strideValue = RWglUtility.convertIndexStride(graphic, strideCd);
      var offsetValue = 0;
      switch(strideCd){
         case EG3dIndexStride.Uint16:
            offsetValue = offset << 1;
            break;
         case EG3dIndexStride.Uint32:
            offsetValue = offset << 2;
            break;
      }
      var drawModeCd = indexBuffer.drawModeCd();
      var drawModeValue = RWglUtility.convertDrawMode(graphic, drawModeCd);
      switch(drawModeCd){
         case EG3dDrawMode.Line:
            break;
      }
      graphic.drawElements(drawModeValue, count, strideValue, offsetValue);
      o._statistics._frameTriangleCount += count;
      o._statistics._frameDrawCount++;
      result = o.checkError("drawElements", "Draw triangles failure. (index={1}, offset={2}, count={3})", indexBuffer, offset, count);
      if(!result){
          return result;
      }
      graphic.bindBuffer(graphic.ELEMENT_ARRAY_BUFFER, null);
      result = o.checkError("bindBuffer", "Bind element array buffer failure. (index={1}, offset={2}, count={3})", indexBuffer, offset, count);
      if(!result){
          return result;
      }
      return result;
   }
   MO.FWglContext_present = function FWglContext_present(){
   }
   MO.FWglContext_checkError = function FWglContext_checkError(code, message, parameter1){
      var o = this;
      if(!o._capability.optionDebug){
         return true;
      }
      if(!MO.Runtime.isDebug()){
         return true;
      }
      var graphic = o._handle;
      var result = false;
      var error = null;
      var errorInfo = null;
      while(true){
         error = graphic.getError();
         if(error == graphic.NO_ERROR){
            result = true;
            break;
         }
         switch(error){
            case graphic.INVALID_OPERATION:
               errorInfo = "Invalid operation.";
               break;
            case graphic.INVALID_ENUM:
               errorInfo = "Invalid enum.";
               break;
            case graphic.INVALID_VALUE:
               errorInfo = "Invalid value.";
               break;
            case graphic.INVALID_FRAMEBUFFER_OPERATION:
               errorInfo = "Invalid paramebuffer opeartion.";
               break;
            case graphic.OUT_OF_MEMORY:
               errorInfo = "Out of memory.";
               break;
            default:
               errorInfo = "Unknown";
               break;
         }
      }
      if(!result){
         RLogger.fatal(o, null, 'OpenGL check failure. (code={1}, description={2})', error, errorInfo);
      }
      return result;
   }
   MO.FWglContext_dispose = function FWglContext_dispose(){
      var o = this;
      o._data9 = null;
      o._data16 = null;
      o._recordBuffers = RObject.dispose(o._recordBuffers);
      o._recordSamplers = RObject.dispose(o._recordSamplers);
      o._contextAttributes = null;
      o._handleSamplerS3tc = null;
      o._handleDebugShader = null;
      o.__base.FG3dContext.dispose.call(o);
   }
}
with(MO){
   MO.FWglCubeTexture = function FWglCubeTexture(o){
      o = RClass.inherits(this, o, FG3dCubeTexture);
      o._handle    = null;
      o.setup      = FWglCubeTexture_setup;
      o.isValid    = FWglCubeTexture_isValid;
      o.makeMipmap = FWglCubeTexture_makeMipmap;
      o.upload     = FWglCubeTexture_upload;
      o.update     = FWglCubeTexture_update;
      o.dispose    = FWglCubeTexture_dispose;
      return o;
   }
   MO.FWglCubeTexture_setup = function FWglCubeTexture_setup(){
      var o = this;
      var g = o._graphicContext._handle;
      o.__base.FG3dCubeTexture.setup.call(o);
      o._handle = g.createTexture();
   }
   MO.FWglCubeTexture_isValid = function FWglCubeTexture_isValid(){
      var o = this;
      var g = o._graphicContext._handle;
      return g.isTexture(o._handle);
   }
   MO.FWglCubeTexture_makeMipmap = function FWglCubeTexture_makeMipmap(){
      var o = this;
      var g = o._graphicContext._handle;
      g.bindTexture(g.TEXTURE_CUBE_MAP, o._handle);
      g.generateMipmap(g.TEXTURE_CUBE_MAP);
   }
   MO.FWglCubeTexture_upload = function FWglCubeTexture_upload(x1, x2, y1, y2, z1, z2){
      var o = this;
      var c = o._graphicContext;
      var g = c._handle;
      g.bindTexture(g.TEXTURE_CUBE_MAP, o._handle);
      g.texImage2D(g.TEXTURE_CUBE_MAP_POSITIVE_X, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, x1.image());
      g.texImage2D(g.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, x2.image());
      g.texImage2D(g.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, y1.image());
      g.texImage2D(g.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, y2.image());
      g.texImage2D(g.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, z1.image());
      g.texImage2D(g.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, z2.image());
      o._statusLoad = c.checkError("texImage2D", "Upload cube image failure.");
      o.update();
   }
   MO.FWglCubeTexture_update = function FWglCubeTexture_update(){
      var o = this;
      o.__base.FG3dCubeTexture.update.call(o);
      var g = o._graphicContext._handle;
      g.bindTexture(g.TEXTURE_CUBE_MAP, o._handle);
      var c = RWglUtility.convertSamplerFilter(g, o._filterMinCd);
      if(c){
         g.texParameteri(g.TEXTURE_CUBE_MAP, g.TEXTURE_MIN_FILTER, c);
      }
      var c = RWglUtility.convertSamplerFilter(g, o._filterMagCd);
      if(c){
         g.texParameteri(g.TEXTURE_CUBE_MAP, g.TEXTURE_MAG_FILTER, c);
      }
   }
   MO.FWglCubeTexture_dispose = function FWglCubeTexture_dispose(){
      var o = this;
      var c = o._graphicContext;
      var n = o._handle;
      if(n){
         c._handle.deleteTexture(n);
         o._handle = null;
      }
      o.__base.FG3dCubeTexture.dispose.call(o);
   }
}
with(MO){
   MO.FWglFlatTexture = function FWglFlatTexture(o){
      o = RClass.inherits(this, o, FG3dFlatTexture);
      o._handle    = null;
      o.setup      = FWglFlatTexture_setup;
      o.isValid    = FWglFlatTexture_isValid;
      o.texture    = FWglFlatTexture_texture;
      o.makeMipmap = FWglFlatTexture_makeMipmap;
      o.uploadData = FWglFlatTexture_uploadData;
      o.upload     = FWglFlatTexture_upload;
      o.update     = FWglFlatTexture_update;
      o.dispose    = FWglFlatTexture_dispose;
      return o;
   }
   MO.FWglFlatTexture_setup = function FWglFlatTexture_setup(){
      var o = this;
      var g = o._graphicContext._handle;
      o.__base.FG3dFlatTexture.setup.call(o);
      o._handle = g.createTexture();
   }
   MO.FWglFlatTexture_isValid = function FWglFlatTexture_isValid(){
      var o = this;
      var g = o._graphicContext._handle;
      return g.isTexture(o._handle);
   }
   MO.FWglFlatTexture_texture = function FWglFlatTexture_texture(){
      return this;
   }
   MO.FWglFlatTexture_makeMipmap = function FWglFlatTexture_makeMipmap(){
      var o = this;
      var g = o._graphicContext._handle;
      g.bindTexture(g.TEXTURE_2D, o._handle);
      g.generateMipmap(g.TEXTURE_2D);
   }
   MO.FWglFlatTexture_uploadData = function FWglFlatTexture_uploadData(content, width, height){
      var o = this;
      var context = o._graphicContext;
      var handle = context._handle;
      var data = null;
      if(content.constructor == ArrayBuffer){
         data = new Uint8Array(content);
      }else if(content.constructor == Uint8Array){
         data = content;
      }else{
         throw new TError('Invalid content format.');
      }
      o.width = width;
      o.height = height;
      handle.bindTexture(handle.TEXTURE_2D, o._handle);
      handle.texImage2D(handle.TEXTURE_2D, 0, handle.RGBA, width, height, 0, handle.RGBA, handle.UNSIGNED_BYTE, data);
      o._statusLoad = context.checkError("texImage2D", "Upload content failure.");
      o.update();
   }
   MO.FWglFlatTexture_upload = function FWglFlatTexture_upload(content){
      var o = this;
      var context = o._graphicContext;
      var capability = context.capability();
      var handle = context._handle;
      var data = null;
      var tagName = content.tagName;
      if((tagName == 'IMG') || (tagName == 'VIDEO') || (tagName == 'CANVAS')){
         data = content;
      }else if(RClass.isClass(content, FImage)){
         data = content.image();
      }else if(RClass.isClass(content, MCanvasObject)){
         data = content.htmlCanvas();
      }else{
         throw new TError('Invalid image format.');
      }
      handle.bindTexture(handle.TEXTURE_2D, o._handle);
      if(o._optionFlipY){
         handle.pixelStorei(handle.UNPACK_FLIP_Y_WEBGL, true);
      }
      handle.texImage2D(handle.TEXTURE_2D, 0, handle.RGBA, handle.RGBA, handle.UNSIGNED_BYTE, data);
      o.update();
      o._statusLoad = context.checkError("texImage2D", "Upload image failure.");
   }
   MO.FWglFlatTexture_update = function FWglFlatTexture_update(){
      var o = this;
      o.__base.FG3dFlatTexture.update.call(o);
      var g = o._graphicContext._handle;
      g.bindTexture(g.TEXTURE_2D, o._handle);
      var c = RWglUtility.convertSamplerFilter(g, o._filterMinCd);
      if(c){
         g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, c);
      }
      var c = RWglUtility.convertSamplerFilter(g, o._filterMagCd);
      if(c){
         g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, c);
      }
   }
   MO.FWglFlatTexture_dispose = function FWglFlatTexture_dispose(){
      var o = this;
      var context = o._graphicContext;
      var handle = o._handle;
      if(handle){
         context._handle.deleteTexture(handle);
         o._handle = null;
      }
      o.__base.FG3dFlatTexture.dispose.call(o);
   }
}
with(MO){
   MO.FWglFragmentShader = function FWglFragmentShader(o){
      o = RClass.inherits(this, o, FG3dFragmentShader);
      o._handle      = null;
      o.setup        = FWglFragmentShader_setup;
      o.targetSource = FWglFragmentShader_targetSource;
      o.upload       = FWglFragmentShader_upload;
      o.dispose      = FWglFragmentShader_dispose;
      return o;
   }
   MO.FWglFragmentShader_setup = function FWglFragmentShader_setup(){
      var o = this;
      o.__base.FG3dFragmentShader.setup.call(o);
      var graphic = o._graphicContext._handle;
      o._handle = graphic.createShader(graphic.FRAGMENT_SHADER);
   }
   MO.FWglFragmentShader_targetSource = function FWglFragmentShader_targetSource(){
      var o = this;
      var source = null;
      var context = o._graphicContext;
      var capability = context.capability();
      if(capability.optionShaderSource){
         source = context._handleDebugShader.getTranslatedShaderSource(o._handle);
      }else{
         source = o._source;
      }
      return source;
   }
   MO.FWglFragmentShader_upload = function FWglFragmentShader_upload(source){
      var o = this;
      var graphic = o._graphicContext._handle;
      var shader = o._handle;
      graphic.shaderSource(shader, source);
      graphic.compileShader(shader);
      var result = graphic.getShaderParameter(shader, graphic.COMPILE_STATUS);
      if(!result){
         var info = graphic.getShaderInfoLog(shader);
         graphic.deleteShader(shader);
         o._handle = null;
         throw new TError(o, 'Upload fragment shader source failure. (error={1})\n{2}', info, source);
      }
      o._source = source;
      return true;
   }
   MO.FWglFragmentShader_dispose = function FWglFragmentShader_dispose(){
      var o = this;
      var context = o._graphicContext;
      var shader = o._handle;
      if(shader){
         context._handle.deleteShader(shader);
         o._handle = null;
      }
      o.__base.FG3dFragmentShader.dispose.call(o);
   }
}
with(MO){
   MO.FWglIndexBuffer = function FWglIndexBuffer(o){
      o = RClass.inherits(this, o, FG3dIndexBuffer);
      o._handle = null;
      o.setup   = FWglIndexBuffer_setup;
      o.isValid = FWglIndexBuffer_isValid;
      o.upload  = FWglIndexBuffer_upload;
      o.dispose = FWglIndexBuffer_dispose;
      return o;
   }
   MO.FWglIndexBuffer_setup = function FWglIndexBuffer_setup(){
      var o = this;
      o.__base.FG3dIndexBuffer.setup.call(o);
      o._handle = o._graphicContext._handle.createBuffer();
   }
   MO.FWglIndexBuffer_isValid = function FWglIndexBuffer_isValid(){
      var o = this;
      var g = o._graphicContext._handle;
      return g.isBuffer(o._handle);
   }
   MO.FWglIndexBuffer_upload = function FWglIndexBuffer_upload(pd, pc){
      var o = this;
      var c = o._graphicContext;
      var g = c._handle;
      o._count = pc;
      var d = null;
      if((pd.constructor == Array) || (pd.constructor == ArrayBuffer)){
         if(o._strideCd == EG3dIndexStride.Uint16){
            d = new Uint16Array(pd);
         }else if(o._strideCd == EG3dIndexStride.Uint32){
            d = new Uint32Array(pd);
         }else{
            throw new TError(o, 'Index stride is invalid.');
         }
      }else if(pd.constructor == Uint16Array){
         if(o._strideCd != EG3dIndexStride.Uint16){
            throw new TError(o, 'Index stride16 is invalid.');
         }
         d = pd;
      }else if(pd.constructor == Uint32Array){
         if(o._strideCd != EG3dIndexStride.Uint32){
            throw new TError(o, 'Index stride16 is invalid.');
         }
         d = pd;
      }else{
         throw new TError(o, 'Upload index data type is invalid. (value={1})', pd);
      }
      g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, o._handle);
      c.checkError('bindBuffer', 'Bind buffer failure.');
      g.bufferData(g.ELEMENT_ARRAY_BUFFER, d, g.STATIC_DRAW);
      c.checkError('bufferData', 'Upload buffer data. (count={1})', pc);
   }
   MO.FWglIndexBuffer_dispose = function FWglIndexBuffer_dispose(){
      var o = this;
      var context = o._graphicContext;
      o._resource = null;
      var handle = o._handle;
      if(handle){
         c._handle.deleteBuffer(handle);
         o._handle = null;
      }
      o.__base.FG3dIndexBuffer.dispose.call(o);
   }
}
with(MO){
   MO.FWglLayout = function FWglLayout(o){
      o = RClass.inherits(this, o, FG3dLayout);
      o._handle  = null;
      o.setup    = FWglLayout_setup;
      o.bind     = FWglLayout_bind;
      o.unbind   = FWglLayout_unbind;
      o.active   = FWglLayout_active;
      o.deactive = FWglLayout_deactive;
      o.dispose  = FWglLayout_dispose;
      return o;
   }
   MO.FWglLayout_setup = function FWglLayout_setup(){
      var o = this;
      o.__base.FG3dLayout.setup.call(o);
      var c = o._graphicContext;
      o._handle = c._handleLayout.createVertexArrayOES();
   }
   MO.FWglLayout_bind = function FWglLayout_bind(){
      var o = this;
      var c = o._graphicContext;
      c._handleLayout.bindVertexArrayOES(o._handle);
   }
   MO.FWglLayout_unbind = function FWglLayout_unbind(){
      var o = this;
      var c = o._graphicContext;
      c._handleLayout.bindVertexArrayOES(null);
   }
   MO.FWglLayout_active = function FWglLayout_active(){
      var o = this;
      var c = o._graphicContext;
      c._handleLayout.bindVertexArrayOES(o._handle);
   }
   MO.FWglLayout_deactive = function FWglLayout_deactive(){
      var o = this;
      var c = o._graphicContext;
      c._handleLayout.bindVertexArrayOES(null);
   }
   MO.FWglLayout_dispose = function FWglLayout_dispose(){
      var o = this;
      var c = o._graphicContext;
      var layout = o._handle;
      if(layout){
         c._handleLayout.deleteVertexArrayOES(layout);
         o._handle = null;
      }
      o.__base.FG3dLayout.dispose.call(o);
   }
}
with(MO){
   MO.FWglProgram = function FWglProgram(o){
      o = RClass.inherits(this, o, FG3dProgram);
      o._handle        = null;
      o.setup          = FWglProgram_setup;
      o.vertexShader   = FWglProgram_vertexShader;
      o.fragmentShader = FWglProgram_fragmentShader;
      o.upload         = FWglProgram_upload;
      o.build          = FWglProgram_build;
      o.link           = FWglProgram_link;
      o.dispose        = FWglProgram_dispose;
      return o;
   }
   MO.FWglProgram_setup = function FWglProgram_setup(){
      var o = this;
      var c = g = o._graphicContext;
      o._handle = c._handle.createProgram();
   }
   MO.FWglProgram_vertexShader = function FWglProgram_vertexShader(){
      var o = this;
      var shader = o._vertexShader;
      if(!shader){
         shader = o._vertexShader = RClass.create(FWglVertexShader);
         shader.linkGraphicContext(o);
         shader.setup();
      }
      return shader;
   }
   MO.FWglProgram_fragmentShader = function FWglProgram_fragmentShader(){
      var o = this;
      var shader = o._fragmentShader;
      if(!shader){
         shader = o._fragmentShader = RClass.create(FWglFragmentShader);
         shader.linkGraphicContext(o);
         shader.setup();
      }
      return shader;
   }
   MO.FWglProgram_upload = function FWglProgram_upload(shaderCd, source){
      var o = this;
      if(shaderCd == EG3dShader.Vertex){
         o.vertexShader().upload(source);
      }else if(shaderCd == EG3dShader.Fragment){
         o.fragmentShader().upload(source);
      }else{
         throw new Error('Unknown type');
      }
   }
   MO.FWglProgram_build = function FWglProgram_build(){
      var o = this;
      var context = o._graphicContext;
      var g = context._handle;
      var pn = o._handle;
      var vertexShader = o.vertexShader();
      g.attachShader(pn, vertexShader._handle);
      var result = context.checkError("attachShader", "Attach shader failure. (program_id=%d, shader_id=%d)", pn, vertexShader._handle);
      if(!result){
         return result;
      }
      var fragmentShader = o.fragmentShader();
      g.attachShader(pn, fragmentShader._handle);
      var result = context.checkError("attachShader", "Attach shader failure. (program_id=%d, shader_id=%d)", pn, fragmentShader._handle);
      if(!result){
         return result;
      }
      if(o.hasAttribute()){
         var attributes = o.attributes();
         var ac = attributes.count();
         for(var n = 0; n < ac; n++){
            var attribute = attributes.at(n);
            var attributeName = attribute.name();
            g.bindAttribLocation(pn, n, attributeName);
            result = context.checkError("bindAttribLocation", "Bind attribute location. (program_id=%d, slot=%d, name=%s)", pn, n, attributeName);
            if(!result){
               return result;
            }
         }
      }
   }
   MO.FWglProgram_link = function FWglProgram_link(){
      var o = this;
      var context = o._graphicContext;
      var g = context._handle;
      var result = false;
      var pn = o._handle;
      g.linkProgram(pn);
      var pr = g.getProgramParameter(pn, g.LINK_STATUS);
      if(!pr){
         var pi = g.getProgramInfoLog(pn);
         RLogger.fatal(this, null, "Link program failure. (status={1}, reason={2})", pr, pi);
         g.deleteProgram(o._handle);
         o._handle = null;
         return false;
      }
      g.validateProgram(pn);
      var pr = g.getProgramParameter(pn, g.VALIDATE_STATUS);
      if(!pr){
         var pi = g.getProgramInfoLog(pn);
      }
      g.finish();
      result = context.checkError("finish", "Finish program link faliure. (program_id={1})", pn);
      if(!result){
         return result;
      }
      if(o.hasParameter()){
         var count = o._parameters.count();
         for(var n = 0; n < count; n++){
            var parameter = o._parameters.at(n);
            var handle = g.getUniformLocation(pn, parameter.name());
            result = context.checkError("getUniformLocation", "Find parameter slot. (program_id=%d, name=%s, slot=%d)", pn, parameter.name(), handle);
            if(!result){
               return result;
            }
            parameter._slot = handle;
            if(handle != null){
               parameter._statusUsed = true;
            }
         }
      }
      if(o.hasAttribute()){
         var count = o._attributes.count();
         for(var n = 0; n < count; n++){
            var attribute = o._attributes.at(n);
            var handle = g.getAttribLocation(pn, attribute.name());
            result = context.checkError("getAttribLocation", "Find attribute slot. (program_id=%d, name=%s, slot=%d)", pn, attribute.name(), handle);
            if(!result){
               return result;
            }
            attribute._slot = handle;
            if(handle != -1){
               attribute._statusUsed = true;
            }
         }
      }
      if(o.hasSampler()){
         var count = o._samplers.count();
         for(var n = 0; n < count; n++){
            var sampler = o._samplers.at(n);
            var handle = g.getUniformLocation(pn, sampler.name());
            result = context.checkError("getUniformLocation", "Find sampler slot. (program_id=%d, name=%s, slot=%d)", pn, sampler.name(), handle);
            if(!result){
               return result;
            }
            sampler._slot = handle;
            if(handle != null){
               sampler._statusUsed = true;
            }
         }
         var si = 0;
         for(var n = 0; n < count; n++){
            var sampler = o._samplers.value(n);
            if(sampler._statusUsed){
               sampler._index = si++;
            }
         }
      }
      return result;
   }
   MO.FWglProgram_dispose = function FWglProgram_dispose(){
      var o = this;
      var context = o._graphicContext;
      var handle = o._handle;
      if(handle){
         context._handle.deleteProgram(handle);
         o._handle = null;
      }
      o.__base.FG3dProgram.dispose.call(o);
   }
}
with(MO){
   MO.FWglRenderTarget = function FWglRenderTarget(o){
      o = RClass.inherits(this, o, FG3dRenderTarget);
      o._optionDepth = true;
      o._handle      = null;
      o._handleDepth = null;
      o.setup        = FWglRenderTarget_setup;
      o.build        = FWglRenderTarget_build;
      o.dispose      = FWglRenderTarget_dispose;
      return o;
   }
   MO.FWglRenderTarget_setup = function FWglRenderTarget_setup(){
      var o = this;
      o.__base.FG3dRenderTarget.setup.call(o);
      var c = o._graphicContext;
      var g = c._handle;
      o._handle = g.createFramebuffer();
      return c.checkError('createFramebuffer', 'Create frame buffer failure.');
   }
   MO.FWglRenderTarget_build = function FWglRenderTarget_build(){
      var o = this;
      var s = o._size;
      var c = o._graphicContext;
      var g = c._handle;
      g.bindFramebuffer(g.FRAMEBUFFER, o._handle);
      var r = c.checkError('bindFramebuffer', 'Bind frame buffer failure.');
      if(!r){
         return r;
      }
      if(o._optionDepth){
         var nd = o._handleDepth = g.createRenderbuffer();
         var r = c.checkError('createRenderbuffer', 'Create render buffer failure.');
         if(!r){
            return r;
         }
         g.bindRenderbuffer(g.RENDERBUFFER, nd);
         var r = c.checkError('bindRenderbuffer', 'Bind render buffer failure.');
         if(!r){
            return r;
         }
         g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, s.width, s.height);
         var r = c.checkError('renderbufferStorage', 'Set render buffer storage format failure.');
         if(!r){
            return r;
         }
         g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, nd);
         var r = c.checkError('framebufferRenderbuffer', "Set depth buffer to frame buffer failure. (framebuffer=%d, depthbuffer=%d)", o._handle, nd);
         if(!r){
            return r;
         }
      }
      var ts = o._textures;
      var tc = ts.count();
      for(var i = 0; i < tc; i++){
         var t = ts.get(i);
         g.bindTexture(g.TEXTURE_2D, t._handle);
         g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
         g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
         g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, s.width, s.height, 0, g.RGBA, g.UNSIGNED_BYTE, null);
         var r = c.checkError('texImage2D', "Alloc texture storage. (texture_id, size=%dx%d)", t._handle, o._size.width, o._size.height);
         if(!r){
            return r;
         }
         g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0 + i, g.TEXTURE_2D, t._handle, 0);
         var r = c.checkError('framebufferTexture2D', "Set color buffer into frame buffer failure. (framebuffer_id=%d, texture_id=%d)", o._handle, t._handle);
         if(!r){
            return r;
         }
      }
   }
   MO.FWglRenderTarget_dispose = function FWglRenderTarget_dispose(){
      var o = this;
      var c = o._graphicContext;
      var n = o._handleDepth;
      if(n){
         c._handle.deleteRenderbuffer(n);
         o._handleDepth = null;
      }
      var n = o._handle;
      if(n){
         c._handle.deleteFramebuffer(n);
         o._handle = null;
      }
      o.__base.FG3dRenderTarget.dispose.call(o);
   }
}
with(MO){
   MO.FWglVertexBuffer = function FWglVertexBuffer(o){
      o = RClass.inherits(this, o, FG3dVertexBuffer);
      o._handle = null;
      o.setup   = FWglVertexBuffer_setup;
      o.isValid = FWglVertexBuffer_isValid;
      o.upload  = FWglVertexBuffer_upload;
      o.dispose = FWglVertexBuffer_dispose;
      return o;
   }
   MO.FWglVertexBuffer_setup = function FWglVertexBuffer_setup(){
      var o = this;
      o.__base.FG3dVertexBuffer.setup.call(o);
      var graphic = o._graphicContext._handle;
      o._handle = graphic.createBuffer();
   }
   MO.FWglVertexBuffer_isValid = function FWglVertexBuffer_isValid(){
      var o = this;
      var graphic = o._graphicContext._handle;
      return graphic.isBuffer(o._handle);
   }
   MO.FWglVertexBuffer_upload = function FWglVertexBuffer_upload(data, stride, count){
      var o = this;
      var context = o._graphicContext;
      var graphics = context._handle;
      o._stride = stride;
      o._count = count;
      var arrays = null;
      if((data.constructor == Array) || (data.constructor == ArrayBuffer)){
         switch(o._formatCd){
            case EG3dAttributeFormat.Float1:
            case EG3dAttributeFormat.Float2:
            case EG3dAttributeFormat.Float3:
            case EG3dAttributeFormat.Float4:
               arrays = new Float32Array(data);
               break;
            case EG3dAttributeFormat.Byte4:
            case EG3dAttributeFormat.Byte4Normal:
               arrays = new Uint8Array(data);
               break;
            default:
               throw new TError(o, 'Unknown data type.');
         }
      }else if(data.constructor == Uint8Array){
         arrays = data;
      }else if(data.constructor == Float32Array){
         arrays = data;
      }else{
         throw new TError(o, 'Upload vertex data type is invalid. (data={1})', data);
      }
      graphics.bindBuffer(graphics.ARRAY_BUFFER, o._handle);
      context.checkError('bindBuffer', 'Bindbuffer');
      graphics.bufferData(graphics.ARRAY_BUFFER, arrays, graphics.STATIC_DRAW);
      context.checkError('bufferData', 'bufferData');
   }
   MO.FWglVertexBuffer_dispose = function FWglVertexBuffer_dispose(){
      var o = this;
      var context = o._graphicContext;
      o._resource = null;
      var buffer = o._handle;
      if(buffer){
         context._handle.deleteBuffer(buffer);
         o._handle = null;
      }
      o.__base.FG3dVertexBuffer.dispose.call(o);
   }
}
with(MO){
   MO.FWglVertexShader = function FWglVertexShader(o){
      o = RClass.inherits(this, o, FG3dVertexShader);
      o._handle      = null;
      o.setup        = FWglVertexShader_setup;
      o.targetSource = FWglVertexShader_targetSource;
      o.upload       = FWglVertexShader_upload;
      o.dispose      = FWglVertexShader_dispose;
      return o;
   }
   MO.FWglVertexShader_setup = function FWglVertexShader_setup(){
      var o = this;
      o.__base.FG3dVertexShader.setup.call(o);
      var graphic = o._graphicContext._handle;
      o._handle = graphic.createShader(graphic.VERTEX_SHADER);
   }
   MO.FWglVertexShader_targetSource = function FWglVertexShader_targetSource(){
      var o = this;
      var source = null;
      var context = o._graphicContext;
      var capability = context.capability();
      if(capability.optionShaderSource){
         source = context._handleDebugShader.getTranslatedShaderSource(o._handle);
      }else{
         source = o._source;
      }
      return source;
   }
   MO.FWglVertexShader_upload = function FWglVertexShader_upload(source){
      var o = this;
      var graphic = o._graphicContext._handle;
      var shader = o._handle;
      graphic.shaderSource(shader, source);
      graphic.compileShader(shader);
      var result = graphic.getShaderParameter(shader, graphic.COMPILE_STATUS);
      if(!result){
         var info = graphic.getShaderInfoLog(shader);
         graphic.deleteShader(shader);
         o._handle = null;
         throw new TError(o, 'Upload vertex shader source failure. (error={1})\n{2}', info, source);
      }
      o._source = source;
      return true;
   }
   MO.FWglVertexShader_dispose = function FWglVertexShader_dispose(){
      var o = this;
      var context = o._graphicContext;
      var shader = o._handle;
      if(shader){
         context._handle.deleteShader(shader);
         o._handle = null;
      }
      o.__base.FG3dVertexShader.dispose.call(o);
   }
}
with(MO){
   MO.RWglUtility = function RWglUtility(){
      return this;
   }
   MO.RWglUtility.prototype.convertFillMode = function RWglUtility_convertFillMode(graphic, fillCd){
      switch(fillCd){
         case EG3dFillMode.Point:
            return graphic.POINT;
         case EG3dFillMode.Line:
            return graphic.LINE;
         case EG3dFillMode.Face:
            return graphic.FILL;
      }
      throw new TError(this, "Convert fill mode failure. (fill_cd={1})", fillCd);
   }
   MO.RWglUtility.prototype.convertDrawMode = function RWglUtility_convertDrawMode(graphic, drawCd){
      switch(drawCd){
         case EG3dDrawMode.Point:
            return graphic.POINTS;
         case EG3dDrawMode.Lines:
            return graphic.LINES;
         case EG3dDrawMode.LineStrip:
            return graphic.LINE_STRIP;
         case EG3dDrawMode.LineLoop:
            return graphic.LINE_LOOP;
         case EG3dDrawMode.Triangles:
            return graphic.TRIANGLES;
         case EG3dDrawMode.TriangleStrip:
            return graphic.TRIANGLE_STRIP;
         case EG3dDrawMode.TriangleFan:
            return graphic.TRIANGLE_FAN;
         case EG3dDrawMode.Quads:
            return graphic.QUADS;
         case EG3dDrawMode.QuadStrip:
            return graphic.QUAD_STRIP;
      }
      throw new TError(this, "Convert draw mode failure. (draw_cd={1})", drawCd);
   }
   MO.RWglUtility.prototype.convertCullMode = function RWglUtility_convertCullMode(graphic, cullCd){
      switch(cullCd){
         case EG3dCullMode.Front:
            return graphic.FRONT;
         case EG3dCullMode.Back:
            return graphic.BACK;
         case EG3dCullMode.Both:
            return graphic.FRONT_AND_BACK;
      }
      throw new TError(this, "Convert cull mode failure. (cull_cd={1})", cullCd);
   }
   MO.RWglUtility.prototype.convertDepthMode = function RWglUtility_convertDepthMode(graphic, depthCd){
      switch(depthCd){
         case EG3dDepthMode.Equal:
            return graphic.EQUAL;
         case EG3dDepthMode.NotEqual:
            return graphic.NOTEQUAL;
         case EG3dDepthMode.Less:
            return graphic.LESS;
         case EG3dDepthMode.LessEqual:
            return graphic.LEQUAL;
         case EG3dDepthMode.Greater:
            return graphic.GREATER;
         case EG3dDepthMode.GreaterEqual:
            return graphic.GEQUAL;
         case EG3dDepthMode.Always:
            return graphic.ALWAYS;
      }
      throw new TError(this, "Convert depth mode failure. (depth_cd={1})", depthCd);
   }
   MO.RWglUtility.prototype.convertBlendFactors = function RWglUtility_convertBlendFactors(graphic, blendCd){
      switch(blendCd){
         case EG3dBlendMode.Zero:
            return graphic.ZERO;
         case EG3dBlendMode.One:
            return graphic.ONE;
         case EG3dBlendMode.SrcColor:
            return graphic.SRC_COLOR;
         case EG3dBlendMode.OneMinusSrcColor:
            return graphic.ONE_MINUS_SRC_COLOR;
         case EG3dBlendMode.DstColor:
            return graphic.DST_COLOR;
         case EG3dBlendMode.OneMinusDstColor:
            return graphic.ONE_MINUS_DST_COLOR;
         case EG3dBlendMode.SrcAlpha:
            return graphic.SRC_ALPHA;
         case EG3dBlendMode.OneMinusSrcAlpha:
            return graphic.ONE_MINUS_SRC_ALPHA;
         case EG3dBlendMode.DstAlpha:
            return graphic.DST_ALPHA;
         case EG3dBlendMode.OneMinusDstAlpha:
            return graphic.ONE_MINUS_DST_ALPHA;
         case EG3dBlendMode.SrcAlphaSaturate:
            return graphic.SRC_ALPHA_SATURATE;
      }
      throw new TError(this, "Convert blend factors failure. (blend_cd={1})", blendCd);
   }
   MO.RWglUtility.prototype.convertIndexStride = function RWglUtility_convertIndexStride(graphic, strideCd){
      switch(strideCd){
         case EG3dIndexStride.Uint16:
            return graphic.UNSIGNED_SHORT;
         case EG3dIndexStride.Uint32:
            return graphic.UNSIGNED_INT;
      }
      throw new TError(this, "Convert index stride failure. (stride_cd={1})", strideCd);
   }
   MO.RWglUtility.prototype.convertSamplerFilter = function RWglUtility_convertSamplerFilter(graphic, filterCd){
      switch(filterCd){
         case EG3dSamplerFilter.Unknown:
            return 0;
         case EG3dSamplerFilter.Nearest:
            return graphic.NEAREST;
         case EG3dSamplerFilter.Linear:
            return graphic.LINEAR;
         case EG3dSamplerFilter.Repeat:
            return graphic.REPEAT;
         case EG3dSamplerFilter.ClampToEdge:
            return graphic.CLAMP_TO_EDGE;
         case EG3dSamplerFilter.ClampToBorder:
            return graphic.CLAMP_TO_BORDER;
      }
      throw new TError(this, "Convert sampler filter failure. (filter_cd={1})", filterCd);
   }
   MO.RWglUtility = new RWglUtility();
}
