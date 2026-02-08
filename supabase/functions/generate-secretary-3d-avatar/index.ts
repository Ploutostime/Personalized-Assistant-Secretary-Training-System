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
  const baseStyle = '3D character design, professional quality, clean background, front view, full body portrait, Pixar style rendering, soft lighting, high detail';
  
  // 根据不同类型定制prompt
  const typePrompts: Record<string, string> = {
    // 经典系列
    'loli': 'cute young girl character with big eyes, petite figure, innocent smile, wearing casual student outfit, cheerful and energetic personality',
    'oneesan': 'elegant mature woman character, confident posture, gentle smile, wearing professional business suit, sophisticated and caring personality',
    'uncle': 'friendly middle-aged man character, warm smile, casual business attire, reliable and experienced personality',
    'boss': 'powerful business executive character, sharp suit, commanding presence, confident expression, authoritative yet fair personality',
    'senior_sister': 'graceful college student character, intelligent look, stylish casual outfit, helpful and knowledgeable personality',
    
    // 奇幻系列
    'elf': 'mystical elf character with pointed ears, flowing hair, elegant fantasy robes, magical aura, wise and serene personality',
    'knight': 'noble knight character in shining armor, heroic stance, determined expression, brave and honorable personality',
    'witch': 'mysterious witch character with magical staff, flowing robes, enchanting smile, clever and mischievous personality',
    'angel': 'divine angel character with white wings, glowing halo, pure white robes, gentle and compassionate personality',
    
    // 古风系列
    'scholar': 'traditional Chinese scholar character, elegant hanfu robes, holding scroll or brush, wise and cultured personality',
    'warrior': 'ancient Chinese warrior character, martial arts outfit, confident stance, disciplined and strong personality',
    'princess': 'elegant Chinese princess character, luxurious hanfu dress, graceful posture, refined and gentle personality',
    
    // 现代系列
    'programmer': 'modern tech professional character, casual hoodie and jeans, laptop nearby, smart and innovative personality',
    'artist': 'creative artist character, stylish casual wear, artistic accessories, imaginative and expressive personality',
    'athlete': 'sporty character in athletic wear, energetic pose, healthy appearance, determined and active personality',
  };
  
  const specificPrompt = typePrompts[secretary.type] || 'professional character design, friendly appearance, modern outfit';
  
  return `${specificPrompt}, ${baseStyle}. Character name: ${secretary.name}. ${secretary.description}`;
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
