with(MO){
   MO.FG3dAutomaticEffect = function FG3dAutomaticEffect(o){
      o = RClass.inherits(this, o, FG3dEffect);
      o._optionMerge                 = false;
      o._optionBlendMode             = true;
      o._supportInstance             = false;
      o._supportLayout               = false;
      o._supportMaterialMap          = false;
      o._supportVertexColor          = true;
      o._supportVertexCoord          = true;
      o._supportVertexNormal         = true;
      o._supportVertexNormalFull     = true;
      o._supportVertexNormalCompress = false;
      o._supportSkeleton             = false;
      o._supportAlpha                = true;
      o._supportAmbient              = true;
      o._supportDiffuse              = true;
      o._supportDiffuseView          = true;
      o._supportSpecularColor        = true;
      o._supportSpecularLevel        = true;
      o._supportSpecularView         = true;
      o._supportLight                = true;
      o._supportReflect              = true;
      o._supportRefract              = true;
      o._supportEmissive             = true;
      o._supportHeight               = true;
      o._supportEnvironment          = true;
      o._dynamicSkeleton             = true;
      o.setup                        = FG3dAutomaticEffect_setup;
      o.buildInfo                    = FG3dAutomaticEffect_buildInfo;
      o.bindAttributes               = FG3dAutomaticEffect_bindAttributes;
      o.bindSamplers                 = FG3dAutomaticEffect_bindSamplers;
      o.bindMaterialSamplers         = FG3dAutomaticEffect_bindMaterialSamplers;
      o.bindMaterial                 = FG3dAutomaticEffect_bindMaterial;
      o.drawRenderable               = FG3dAutomaticEffect_drawRenderable;
      return o;
   }
   MO.FG3dAutomaticEffect_setup = function FG3dAutomaticEffect_setup(){
      var o = this;
      var c = o._graphicContext;
      var cp = c.capability();
      o._supportLayout = cp.optionLayout;
   }
   MO.FG3dAutomaticEffect_buildInfo = function FG3dAutomaticEffect_buildInfo(tagContext, pc){
      var o = this;
      var context = o._graphicContext;
      var capability = context.capability();
      var flag = new TString();
      flag.append(pc.techniqueModeCode)
      tagContext.set("technique.mode", pc.techniqueModeCode);
      var om = o._optionMerge = pc.optionMerge;
      if(om){
         var mc = pc.mergeCount;
         flag.append("|OI" + mc);
         tagContext.setBoolean("option.instance", true);
         tagContext.set("instance.count", mc);
      }
      if(capability.optionMaterialMap){
         flag.append("|OM");
         tagContext.setBoolean("option.material.map", true);
         o._supportMaterialMap = true;
      }
      if(pc.optionNormalInvert){
         flag.append("|ON");
         tagContext.setBoolean("option.normal.invert", true);
         o._supportNormalInvert = true;
      }
      if(pc.optionColor){
         flag.append("|OC");
         tagContext.setBoolean("option.color", true);
         o.optionAmbient = true;
      }
      if(pc.optionAmbient){
         flag.append("|OA");
         tagContext.setBoolean("option.ambient", true);
         o.optionAmbient = true;
      }
      if(pc.optionDiffuse){
         flag.append("|OD");
         tagContext.setBoolean("option.diffuse", true);
         o.optionDiffuse = true;
      }
      if(pc.optionSpecular){
         flag.append("|OS");
         tagContext.setBoolean("option.specular", true);
         o.optionSpecular = true;
      }
      if(pc.optionReflect){
         flag.append("|ORL");
         tagContext.setBoolean("option.reflect", true);
         o.optionReflect = true;
      }
      if(pc.optionRefract){
         flag.append("|ORF");
         tagContext.setBoolean("option.refract", true);
         o.optionRefract = true;
      }
      var ac = pc.attributeContains(EG3dAttribute.Color);
      o._dynamicVertexColor = (o._supportVertexColor && ac);
      if(o._dynamicVertexColor){
         flag.append("|AC");
         tagContext.setBoolean("vertex.attribute.color", true);
      }
      var ad = pc.attributeContains(EG3dAttribute.Coord);
      o._dynamicVertexCoord = (o._supportVertexCoord && ad);
      if(o._dynamicVertexCoord){
         flag.append("|AD");
         tagContext.setBoolean("vertex.attribute.coord", true);
      }
      var an = pc.attributeContains(EG3dAttribute.Normal);
      o._dynamicVertexNormal = (o._supportVertexNormal && an);
      if(o._dynamicVertexNormal){
         flag.append("|AN");
         tagContext.setBoolean("vertex.attribute.normal", true);
      }
      var ab = pc.attributeContains(EG3dAttribute.Binormal);
      var at = pc.attributeContains(EG3dAttribute.Tangent);
      var af = (an && ab && at);
      o._dynamicVertexNormalFull = (o._supportVertexNormalFull && af);
      if(o._dynamicVertexNormalFull){
         flag.append("|ANF");
         tagContext.setBoolean("vertex.attribute.normal.full", true);
      }
      o._dynamicVertexNormalCompress = pc.optionNormalCompress;
      if(o._dynamicVertexNormalCompress){
         flag.append("|ANC");
         tagContext.setBoolean("vertex.attribute.normal.compress", true);
      }
      o._dynamicInstance = (o._supportInstance && capability.optionInstance);
      if(o._dynamicInstance){
         flag.append("|SI");
         if(pc){
            tagContext.setBoolean("support.instance", true);
         }
      }
      o._dynamicSkeleton = o._supportSkeleton;
      if(o._dynamicSkeleton){
         flag.append("|SS");
         if(pc){
            tagContext.setBoolean("support.skeleton", true);
         }
      }
      var sdf  = pc.samplerContains(EG3dSampler.Diffuse);
      o._dynamicAlpha = o._supportAlpha;
      if(o._dynamicAlpha){
         flag.append("|RA");
         if(pc){
            tagContext.setBoolean("support.alpha", true);
         }
         o._optionBlendMode = true;
      }else{
         o._optionBlendMode = false;
      }
      o._dynamicAmbient = o._supportAmbient;
      if(o._dynamicAmbient){
         flag.append("|TA");
         if(pc){
            tagContext.setBoolean("support.ambient", true);
         }
         if(sdf){
            flag.append("|TAS");
            if(pc){
               tagContext.setBoolean("support.ambient.sampler", true);
            }
         }
      }
      if(pc.samplerContains(EG3dSampler.Alpha)){
         tagContext.setBoolean("support.alpha.sampler", true);
      }
      var snr = pc.samplerContains(EG3dSampler.Normal);
      o._dynamicDiffuse = o._supportDiffuse && (o._dynamicVertexNormal || snr);
      if(o._supportDiffuse){
         if(pc){
            tagContext.setBoolean("support.diffuse", true);
         }
         if(snr){
            flag.append("|TDD");
            if(pc){
               tagContext.setBoolean("support.dump", true);
               tagContext.setBoolean("support.diffuse.dump", true);
            }
         }else if(o._dynamicVertexNormal){
            flag.append("|TDN");
            if(pc){
               tagContext.setBoolean("support.diffuse.normal", true);
            }
         }
      }
      o._dynamicDiffuseView = (o._supportDiffuseView && (o._dynamicVertexNormal || snr));
      if(o._supportDiffuseView){
         if(pc){
            tagContext.setBoolean("support.diffuse.view", true);
         }
         if(snr){
            flag.append("|TDVD");
            if(pc){
               tagContext.setBoolean("support.dump", true);
               tagContext.setBoolean("support.diffuse.view.dump", true);
            }
         }else if(o._dynamicVertexNormal){
            flag.append("|TDVN");
            if(pc){
               tagContext.setBoolean("support.diffuse.view.normal", true);
            }
         }
      }
      var spc = pc.samplerContains(EG3dSampler.SpecularColor);
      var spl = pc.samplerContains(EG3dSampler.SpecularLevel);
      o._dynamicSpecularColor = (o._supportSpecularColor && spc);
      o._dynamicSpecularLevel = (o._supportSpecularLevel && spl);
      if((o._dynamicSpecularColor || o._dynamicSpecularLevel) && o._dynamicVertexNormal){
         flag.append("|TS");
         if(pc){
            tagContext.setBoolean("support.specular", true);
         }
         if(o._dynamicSpecularColor){
            flag.append("|TSC");
            if(pc){
               tagContext.setBoolean("support.specular.color", true);
            }
         }
         if(o._dynamicSpecularLevel){
            flag.append("|TSL");
            if(pc){
               tagContext.setBoolean("support.specular.level", true);
            }
         }else{
            flag.append("|NSL");
            if(pc){
               tagContext.setBoolean("support.specular.normal", true);
            }
         }
      }
      o._dynamicSpecularView = o._supportSpecularView;
      if(o._dynamicSpecularView && o._dynamicVertexNormal){
         flag.append("|TSV");
         if(pc){
            tagContext.setBoolean("support.specular.view", true);
         }
         if(o._dynamicSpecularColor){
            flag.append("|TSVC");
            if(pc){
               tagContext.setBoolean("support.specular.view.color", true);
            }
         }
         if(o._dynamicSpecularLevel){
            flag.append("|TSVL");
            if(pc){
               tagContext.setBoolean("support.specular.view.level", true);
            }
         }else{
            flag.append("|NSVL");
            if(pc){
               tagContext.setBoolean("support.specular.view.normal", true);
            }
         }
      }
      var slg = pc.samplerContains(EG3dSampler.Light);
      o._dynamicLight = (o._supportLight && slg);
      if(o._dynamicLight){
         flag.append("|TL");
         if(pc){
            tagContext.setBoolean("support.sampler.light", true);
            tagContext.setBoolean("support.light", true);
         }
      }
      var slr = pc.samplerContains(EG3dSampler.Reflect);
      o._dynamicReflect = (o._supportReflect && slr);
      if(o._dynamicReflect){
         flag.append("|TRL");
         if(pc){
            tagContext.setBoolean("support.sampler.light", true);
            tagContext.setBoolean("support.reflect", true);
         }
      }
      var slf = pc.samplerContains(EG3dSampler.Refract);
      o._dynamicRefract = (o._supportRefract && slf);
      if(o._dynamicRefract){
         flag.append("|TRF");
         if(pc){
            tagContext.setBoolean("support.sampler.light", true);
            tagContext.setBoolean("support.refract", true);
         }
      }
      var sle = pc.samplerContains(EG3dSampler.Emissive);
      o._dynamicEmissive = (o._supportEmissive && sle);
      if(o._dynamicEmissive){
         flag.append("|TLE");
         if(pc){
            tagContext.setBoolean("support.sampler.light", true);
            tagContext.setBoolean("support.emissive", true);
         }
      }
      var shg = pc.samplerContains(EG3dSampler.Height);
      o._dynamicHeight = (o._supportHeight && shg);
      if(o._dynamicHeight){
         flag.append("|TH");
         if(pc){
            tagContext.setBoolean("support.height", true);
         }
      }
      var sen = pc.samplerContains(EG3dSampler.Environment);
      o._dynamicEnvironment = (o._supportEnvironment && sen);
      if(o._dynamicEnvironment){
         flag.append("|TE");
         if(pc){
            tagContext.setBoolean("support.environment", true);
         }
      }
      if(o._dynamicSkeleton){
         var boneCount = capability.calculateBoneCount(pc.vertexBoneCount, pc.vertexCount);
         flag.append("|B" + boneCount);
         tagContext.set("bone.count", boneCount);
         tagContext.set("bone.array.count", boneCount * 3);
         tagContext.setBoolean("support.bone.weight.1", true);
         tagContext.setBoolean("support.bone.weight.2", true);
         tagContext.setBoolean("support.bone.weight.3", true);
         tagContext.setBoolean("support.bone.weight.4", true);
      }
      tagContext.code = flag.flush();
   }
   MO.FG3dAutomaticEffect_bindAttributes = function FG3dAutomaticEffect_bindAttributes(renderable){
      var o = this;
      var program = o._program;
      if(program.hasAttribute()){
         var attributes = program.attributes();
         var count = attributes.count();
         for(var n = 0; n < count; n++){
            var attribute = attributes.at(n);
            if(attribute._statusUsed){
               var buffer = renderable.findVertexBuffer(attribute._linker);
               program.setAttribute(attribute._name, buffer, buffer._formatCd);
            }
         }
      }
   }
   MO.FG3dAutomaticEffect_bindSamplers = function FG3dAutomaticEffect_bindSamplers(renderable){
      var o = this;
      var program = o._program;
      if(o._supportMaterialMap){
         program.setSampler('fs_material', region.materialMap().texture());
      }
      if(program.hasSampler()){
         var samplers = program.samplers();
         var count = samplers.count();
         for(var n = 0; n < count; n++){
            var sampler = samplers.at(n);
            if(sampler._bind && sampler._statusUsed){
               var linker = sampler.linker();
               var texture = renderable.findTexture(linker);
               program.setSampler(sampler.name(), texture.texture());
            }
         }
      }
   }
   MO.FG3dAutomaticEffect_bindMaterialSamplers = function FG3dAutomaticEffect_bindMaterialSamplers(renderable, material){
      var o = this;
      var program = o._program;
      if(program.hasSampler()){
         var samplers = program.samplers();
         var count = samplers.count();
         for(var n = 0; n < count; n++){
            var sampler = samplers.at(n);
            if(sampler._bind && sampler._statusUsed){
               var linker = sampler.linker();
               var texture = material.findBitmap(linker);
               program.setSampler(sampler.name(), texture.texture());
            }
         }
      }
   }
   MO.FG3dAutomaticEffect_bindMaterial = function FG3dAutomaticEffect_bindMaterial(material){
      var o = this;
      var context = o._graphicContext;
      var info = material.info();
      if(info.optionDepth){
         context.setDepthMode(o._stateDepth, o._stateDepthCd);
      }else{
         context.setDepthMode(false);
      }
      if(info.optionAlpha){
         context.setBlendFactors(o._stateBlend, o._stateBlendSourceCd, o._stateBlendTargetCd);
      }else{
         context.setBlendFactors(false);
      }
      if(info.optionDouble){
         context.setCullingMode(false);
      }else{
         context.setCullingMode(o._stateDepth, o._stateCullCd);
      }
   }
   MO.FG3dAutomaticEffect_drawRenderable = function FG3dAutomaticEffect_drawRenderable(region, renderable){
      var o = this;
      var context = o._graphicContext;
      var program = o._program;
      var info = renderable.activeInfo();
      var layout = info.layout;
      if(!layout){
         layout = info.layout = context.createLayout();
         if(o._supportLayout){
            layout.bind();
            o.bindAttributes(renderable);
            layout.unbind();
            layout.active();
         }else{
            context.recordBegin();
            o.bindAttributes(renderable);
            context.recordEnd();
            layout.linkBuffers(context.recordBuffers());
         }
         context.recordBegin();
         o.bindSamplers(renderable);
         context.recordEnd();
         layout.linkSamplers(context.recordSamplers());
      }else{
         if(o._supportLayout){
            layout.active();
         }else{
            layout.bindBuffers();
         }
         layout.bindSamplers();
      }
      var indexCount = 0;
      var indexBuffers = renderable.indexBuffers();
      if(indexBuffers){
         indexCount = indexBuffers.count();
      }
      if(indexCount > 1){
         var materials = renderable.materials();
         for(var i = 0; i < indexCount; i++){
            var indexBuffer = indexBuffers.at(i);
            if(materials){
               var material = materials.at(i);
               if(material){
                  o.bindMaterialSamplers(renderable, material);
               }
            }
            context.drawTriangles(indexBuffer);
         }
      }else if(indexCount == 1){
         var indexBuffer = indexBuffers.first();
         context.drawTriangles(indexBuffer);
      }else{
         throw new TError(o, 'Index buffer is not found.');
      }
      if(o._supportLayout){
         layout.deactive();
      }
   }
}
with(MO){
   MO.FG3dSelectAutomaticEffect = function FG3dSelectAutomaticEffect(o){
      o = RClass.inherits(this, o, FG3dAutomaticEffect);
      o._code          = 'select.automatic';
      o.drawRenderable = FG3dSelectAutomaticEffect_drawRenderable;
      return o;
   }
   MO.FG3dSelectAutomaticEffect_drawRenderable = function FG3dSelectAutomaticEffect_drawRenderable(region, renderable, index){
      var o = this;
      var context = o._graphicContext;
      var size = context.size();
      var program = o._program;
      var selectX = region._selectX;
      var selectY = region._selectY;
      var material = renderable.material();
      var materialInfo = material.info();
      o.bindMaterial(material);
      program.setParameter('vc_model_matrix', renderable.currentMatrix());
      program.setParameter('vc_vp_matrix', region.calculate(EG3dRegionParameter.CameraViewProjectionMatrix));
      program.setParameter4('vc_offset', size.width, size.height, 1 - (selectX / size.width) * 2, (selectY / size.height) * 2 - 1);
      var i = index + 1;
      var i1 = i  & 0xFF;
      var i2 = (i >> 8) & 0xFF;
      var i3 = (i >> 16) & 0xFF;
      program.setParameter4('fc_index', i1 / 255, i2 / 255, i3 / 255, materialInfo.alphaBase);
      o.bindAttributes(renderable);
      o.bindSamplers(renderable);
      var indexBuffers = renderable.indexBuffers();
      var count = indexBuffers.count();
      for(var i = 0; i < count; i++){
         var indexBuffer = indexBuffers.at(i);
         context.drawTriangles(indexBuffer);
      }
   }
}
with(MO){
   MO.FG3dSelectPass = function FG3dSelectPass(o){
      o = RClass.inherits(this, o, FG3dTechniquePass);
      o._code         = 'select';
      o._texture      = null;
      o._renderTarget = null;
      o._position     = null;
      o._data         = null;
      o.construct     = FG3dSelectPass_construct;
      o.setup         = FG3dSelectPass_setup;
      o.textureDepth  = FG3dSelectPass_texture;
      o.drawRegion    = FG3dSelectPass_drawRegion;
      return o;
   }
   MO.FG3dSelectPass_construct = function FG3dSelectPass_construct(){
      var o = this;
      o.__base.FG3dTechniquePass.construct.call(o);
      o._data = new Uint8Array(4);
      o._position = new SPoint2();
   }
   MO.FG3dSelectPass_setup = function FG3dSelectPass_setup(){
      var o = this;
      o.__base.FG3dTechniquePass.setup.call(o);
      var c = o._graphicContext;
      var T = o._texture = c.createFlatTexture();
      T.setFilterCd(EG3dSamplerFilter.Nearest, EG3dSamplerFilter.Nearest);
      T.setWrapCd(EG3dSamplerFilter.ClampToEdge, EG3dSamplerFilter.ClampToEdge);
      var t = o._renderTarget = c.createRenderTarget();
      t.size().set(1, 1);
      t.textures().push(T);
      t.build();
   }
   MO.FG3dSelectPass_texture = function FG3dSelectPass_texture(){
      return this._texture;
   }
   MO.FG3dSelectPass_drawRegion = function FG3dSelectPass_drawRegion(p){
      var o = this;
      var context = o._graphicContext;
      var handle = context.handle();
      context.setRenderTarget(o._renderTarget);
      context.clear(0, 0, 0, 0, 1, 1);
      var rs = p.allRenderables();
      o.activeEffects(p, rs);
      var rc = rs.count();
      for(var i = 0; i < rc; i++){
         var r = rs.get(i);
         var e = r.activeEffect();
         context.setProgram(e.program());
         var d = r.display();
         if(!d){
            e.drawRenderable(p, r, i);
         }else if(!d._optionFace){
            e.drawRenderable(p, r, i);
         }
      }
      context.clearDepth(1);
      for(var i = 0; i < rc; i++){
         var r = rs.get(i);
         var e = r.activeEffect();
         context.setProgram(e.program());
         var d = r.display();
         if(d && d._optionFace){
            e.drawRenderable(p, r, i);
         }
      }
      handle.readPixels(0, 0, 1, 1, handle.RGBA, handle.UNSIGNED_BYTE, o._data);
      var v = o._data[0] + (o._data[1] << 8) + (o._data[2] << 16);
      o._selectRenderable = null;
      if(v != 0){
         o._selectRenderable = rs.get(v - 1);
      }
   }
}
with(MO){
   MO.FG3dSelectSkeletonEffect = function FG3dSelectSkeletonEffect(o){
      o = RClass.inherits(this, o, FG3dAutomaticEffect);
      o._code          = 'select.automatic';
      o.drawRenderable = FG3dSelectSkeletonEffect_drawRenderable;
      return o;
   }
   MO.FG3dSelectSkeletonEffect_drawRenderable = function FG3dSelectSkeletonEffect_drawRenderable(pg, pr, pi){
      var o = this;
      var c = o._graphicContext;
      var s = c.size();
      var p = o._program;
      var sx = pg._selectX;
      var sy = pg._selectY;
      var m = pr.material();
      var mi = m.info();
      o.bindMaterial(m);
      p.setParameter('vc_model_matrix', pr.currentMatrix());
      p.setParameter('vc_vp_matrix', pg.calculate(EG3dRegionParameter.CameraViewProjectionMatrix));
      p.setParameter4('vc_offset', s.width, s.height, 1 - (sx / s.width) * 2, (sy / s.height) * 2 - 1);
      var i = pi + 1;
      var i1 = i  & 0xFF;
      var i2 = (i >> 8) & 0xFF;
      var i3 = (i >> 16) & 0xFF;
      p.setParameter4('fc_index', i1 / 255, i2 / 255, i3 / 255, mi.alphaBase);
      o.bindAttributes(pr);
      o.bindSamplers(pr);
      c.drawTriangles(pr.indexBuffer());
   }
}
with(MO){
   MO.FG3dSelectTechnique = function FG3dSelectTechnique(o){
      o = RClass.inherits(this, o, FG3dTechnique);
      o._code       = 'select';
      o._passSelect = null;
      o.setup       = FG3dSelectTechnique_setup;
      o.passSelect  = FG3dSelectTechnique_passSelect;
      o.test        = FG3dSelectTechnique_test;
      return o;
   }
   MO.FG3dSelectTechnique_setup = function FG3dSelectTechnique_setup(){
      var o = this;
      o.__base.FG3dTechnique.setup.call(o);
      o.registerMode(EG3dTechniqueMode.Result);
      var pd = o._passSelect = RClass.create(FG3dSelectPass);
      pd.linkGraphicContext(o);
      pd.setup();
      o._passes.push(pd);
   }
   MO.FG3dSelectTechnique_passSelect = function FG3dSelectTechnique_passSelect(){
      return this._passSelect;
   }
   MO.FG3dSelectTechnique_test = function FG3dSelectTechnique_test(p, x, y){
      var o = this;
      p._selectX = x;
      p._selectY = y;
      p.setTechnique(o);
      o.drawRegion(p);
      return o._passSelect._selectRenderable;
   }
}
