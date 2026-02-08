import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecretaryAvatar {
  id: string;
  name: string;
  type: string;
  description: string;
  avatar_url: string | null;
}

// 根据秘书类型和性格生成详细的3D形象prompt
function generatePrompt(secretary: SecretaryAvatar): string {
  // 强调立体3D效果的基础样式
  const baseStyle = '3D rendered character, volumetric lighting, realistic depth of field, cinematic lighting, ray tracing, physically based rendering (PBR), high polygon count, detailed textures, ambient occlusion, subsurface scattering, professional 3D modeling, studio lighting setup, clean gradient background, front three-quarter view, full body portrait, ultra high quality 3D render, 8K resolution';
  
  // 根据不同类型定制prompt，强调立体感
  const typePrompts: Record<string, string> = {
    // 经典系列
    'loli': '可爱的年轻女孩3D角色，大眼睛，娇小身材，天真的微笑，穿着休闲学生装，充满活力的性格，立体建模，细腻的面部特征，柔和的体积光照',
    'oneesan': '优雅成熟的女性3D角色，自信的姿态，温柔的微笑，穿着专业商务套装，精致且关怀的性格，高质量3D渲染，真实的布料褶皱，精细的光影效果',
    'uncle': '友好的中年男性3D角色，温暖的微笑，休闲商务装，可靠且经验丰富的性格，写实的3D建模，自然的皮肤质感，立体的光影层次',
    'boss': '强大的商业高管3D角色，笔挺的西装，威严的气场，自信的表情，权威而公正的性格，精密的3D渲染，高级的材质表现，戏剧性的光照',
    'senior_sister': '优雅的大学生3D角色，聪慧的眼神，时尚的休闲装，乐于助人且知识渊博的性格，细腻的3D建模，柔和的环境光，真实的体积感',
    
    // 奇幻系列
    'elf': '神秘的精灵3D角色，尖耳朵，飘逸的长发，优雅的奇幻长袍，魔法光环，睿智宁静的性格，梦幻的3D渲染，发光效果，魔法粒子，立体的空间感',
    'knight': '高贵的骑士3D角色，闪亮的盔甲，英勇的姿态，坚定的表情，勇敢且荣誉的性格，金属质感的3D建模，反射光照，真实的金属材质',
    'witch': '神秘的女巫3D角色，魔法杖，飘逸的长袍，迷人的微笑，聪明且调皮的性格，魔幻的3D渲染，魔法光效，立体的布料动态',
    'angel': '神圣的天使3D角色，洁白的翅膀，发光的光环，纯白长袍，温柔且富有同情心的性格，圣洁的3D渲染，柔和的发光效果，羽毛的细节',
    
    // 古风系列
    'scholar': '传统中国书生3D角色，优雅的汉服长袍，手持卷轴或毛笔，睿智且有文化的性格，精致的3D建模，丝绸质感，中国风光照，立体的服饰褶皱',
    'warrior': '古代中国武者3D角色，武术服装，自信的站姿，纪律严明且强大的性格，动感的3D渲染，肌肉线条，力量感的光影',
    'princess': '优雅的中国公主3D角色，华丽的汉服礼服，优雅的姿态，高贵且温柔的性格，奢华的3D建模，精美的刺绣细节，宫廷风格光照',
    
    // 现代系列
    'programmer': '现代科技专业人士3D角色，休闲连帽衫和牛仔裤，笔记本电脑，聪明且创新的性格，现代的3D渲染，科技感光照，真实的布料质感',
    'artist': '创意艺术家3D角色，时尚的休闲装，艺术配饰，富有想象力且表现力的性格，艺术风格的3D建模，创意光照，个性化的细节',
    'athlete': '运动型3D角色，运动装，充满活力的姿势，健康的外表，坚定且积极的性格，动感的3D渲染，肌肉线条，运动感的光影效果',
  };
  
  const specificPrompt = typePrompts[secretary.type] || '专业的3D角色设计，友好的外观，现代服装，立体渲染，真实光照';
  
  return `${specificPrompt}, ${baseStyle}. 角色名称: ${secretary.name}. ${secretary.description}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const integrationKey = Deno.env.get('INTEGRATIONS_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 获取请求参数
    const { secretaryId } = await req.json();

    if (secretaryId) {
      // 生成单个秘书的3D形象
      const { data: secretary, error: fetchError } = await supabase
        .from('secretary_avatars')
        .select('*')
        .eq('id', secretaryId)
        .single();

      if (fetchError || !secretary) {
        throw new Error('秘书不存在');
      }

      const prompt = generatePrompt(secretary);
      
      // 调用文生图API
      const imageResponse = await fetch(
        'https://app-8ajfx1gov18h-api-DLEO7vB8pQba-gateway.appmiaoda.com/v1/image_generation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Gateway-Authorization': `Bearer ${integrationKey}`,
          },
          body: JSON.stringify({
            model: 'image-01',
            prompt: prompt,
            aspect_ratio: '3:4',
            response_format: 'url',
            n: 1,
            prompt_optimizer: true,
            width: 768,
            height: 1024,
          }),
        }
      );

      const imageResult = await imageResponse.json();

      if (imageResult.base_resp?.status_code !== 0) {
        throw new Error(imageResult.base_resp?.status_msg || '图片生成失败');
      }

      const imageUrl = imageResult.data?.image_urls?.[0];
      if (!imageUrl) {
        throw new Error('未获取到图片URL');
      }

      // 更新数据库
      const { error: updateError } = await supabase
        .from('secretary_avatars')
        .update({ avatar_url: imageUrl })
        .eq('id', secretaryId);

      if (updateError) {
        throw new Error('更新数据库失败');
      }

      return new Response(
        JSON.stringify({
          success: true,
          secretaryId,
          imageUrl,
          message: `成功生成 ${secretary.name} 的3D形象`,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // 批量生成所有秘书的3D形象
      const { data: secretaries, error: fetchError } = await supabase
        .from('secretary_avatars')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError || !secretaries) {
        throw new Error('获取秘书列表失败');
      }

      const results = [];
      
      for (const secretary of secretaries) {
        try {
          const prompt = generatePrompt(secretary);
          
          // 调用文生图API
          const imageResponse = await fetch(
            'https://app-8ajfx1gov18h-api-DLEO7vB8pQba-gateway.appmiaoda.com/v1/image_generation',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Gateway-Authorization': `Bearer ${integrationKey}`,
              },
              body: JSON.stringify({
                model: 'image-01',
                prompt: prompt,
                aspect_ratio: '3:4',
                response_format: 'url',
                n: 1,
                prompt_optimizer: true,
                width: 768,
                height: 1024,
              }),
            }
          );

          const imageResult = await imageResponse.json();

          if (imageResult.base_resp?.status_code === 0) {
            const imageUrl = imageResult.data?.image_urls?.[0];
            
            if (imageUrl) {
              // 更新数据库
              await supabase
                .from('secretary_avatars')
                .update({ avatar_url: imageUrl })
                .eq('id', secretary.id);

              results.push({
                success: true,
                secretaryId: secretary.id,
                name: secretary.name,
                imageUrl,
              });
            } else {
              results.push({
                success: false,
                secretaryId: secretary.id,
                name: secretary.name,
                error: '未获取到图片URL',
              });
            }
          } else {
            results.push({
              success: false,
              secretaryId: secretary.id,
              name: secretary.name,
              error: imageResult.base_resp?.status_msg || '生成失败',
            });
          }
          
          // 添加延迟避免API限流
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          results.push({
            success: false,
            secretaryId: secretary.id,
            name: secretary.name,
            error: error.message,
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success).length;

      return new Response(
        JSON.stringify({
          success: true,
          message: `批量生成完成：成功 ${successCount} 个，失败 ${failedCount} 个`,
          results,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('生成3D形象失败:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
