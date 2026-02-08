import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceConfig {
  voice_id: string;
  speed: number;
  pitch: number;
  vol: number;
  emotion: string;
}

interface TTSRequest {
  text: string;
  secretaryType: string;
  customVoiceConfig?: Partial<VoiceConfig>;
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

    const { text, secretaryType, customVoiceConfig }: TTSRequest = await req.json();

    if (!text || !secretaryType) {
      throw new Error('缺少必要参数：text 和 secretaryType');
    }

    // 从数据库获取秘书的声音配置
    const { data: secretary, error: secretaryError } = await supabase
      .from('secretary_avatars')
      .select('voice_config')
      .eq('type', secretaryType)
      .maybeSingle();

    if (secretaryError || !secretary) {
      throw new Error('未找到秘书配置');
    }

    // 合并默认配置和自定义配置
    const voiceConfig: VoiceConfig = {
      ...secretary.voice_config,
      ...customVoiceConfig,
    };

    // 调用MiniMax TTS API
    const ttsResponse = await fetch(
      'https://app-8ajfx1gov18h-api-DLEO7Bj0lORa-gateway.appmiaoda.com/v1/t2a_v2',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${integrationKey}`,
        },
        body: JSON.stringify({
          model: 'speech-2.8-hd',
          text: text,
          stream: false,
          voice_setting: {
            voice_id: voiceConfig.voice_id,
            speed: voiceConfig.speed,
            vol: voiceConfig.vol,
            pitch: voiceConfig.pitch,
            emotion: voiceConfig.emotion,
          },
          audio_setting: {
            sample_rate: 32000,
            bitrate: 128000,
            format: 'mp3',
            channel: 1,
          },
          output_format: 'hex',
        }),
      }
    );

    const ttsResult = await ttsResponse.json();

    if (ttsResult.base_resp?.status_code !== 0) {
      throw new Error(ttsResult.base_resp?.status_msg || '语音合成失败');
    }

    // 将hex编码的音频数据转换为base64
    const hexAudio = ttsResult.data?.audio;
    if (!hexAudio) {
      throw new Error('未获取到音频数据');
    }

    // hex转bytes
    const bytes = new Uint8Array(hexAudio.length / 2);
    for (let i = 0; i < hexAudio.length; i += 2) {
      bytes[i / 2] = parseInt(hexAudio.substr(i, 2), 16);
    }

    // bytes转base64
    const base64Audio = btoa(String.fromCharCode(...bytes));

    return new Response(
      JSON.stringify({
        success: true,
        audio: base64Audio,
        format: 'mp3',
        extra_info: ttsResult.extra_info,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('TTS生成失败:', error);
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
