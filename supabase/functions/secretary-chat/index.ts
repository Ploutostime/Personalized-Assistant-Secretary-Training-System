import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 秘书性格对应的AI提示词
const personalityPrompts = {
  gentle: "你是一位温柔体贴的学习秘书，说话柔和，充满关怀。你总是用鼓励的语气帮助用户，像朋友一样关心他们的学习和生活。",
  strict: "你是一位严格认真的学习秘书，注重效率和纪律。你会督促用户按时完成任务，对学习要求严格，但也会在适当时候给予肯定。",
  lively: "你是一位活泼开朗的学习秘书，充满趣味和活力。你喜欢用幽默的方式鼓励用户，让学习过程轻松愉快。",
  calm: "你是一位冷静理性的学习秘书，善于分析和规划。你会用逻辑清晰的方式帮助用户解决问题，提供专业的学习建议。",
  motivating: "你是一位充满激情的学习秘书，总是给用户打气加油。你会用积极向上的语言激励用户，帮助他们克服困难。",
};

// 秘书形象对应的角色设定
const avatarRoles = {
  loli: "你是小萌，一个可爱活泼的萝莉形象，充满元气和活力。",
  oneesan: "你是优雅姐姐，一个成熟优雅的御姐形象，温柔体贴。",
  uncle: "你是稳重叔叔，一个稳重可靠的大叔形象，经验丰富。",
  boss: "你是霸道总裁，一个干练高效的霸总形象，追求卓越。",
  senior_sister: "你是温柔学姐，一个亲切耐心的学姐形象，善于引导。",
  senior_brother: "你是阳光学长，一个阳光积极的学长形象，充满正能量。",
};

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, userId, secretaryConfig } = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: "缺少必要参数" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 创建 Supabase 客户端
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 获取用户的秘书配置
    let config = secretaryConfig;
    if (!config) {
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select(`
          secretary_name,
          secretary_avatar_id,
          secretary_personality_id,
          secretary_avatars!secretary_avatar_id(type, name),
          secretary_personalities!secretary_personality_id(type, name)
        `)
        .eq("user_id", userId)
        .maybeSingle();

      if (preferences) {
        config = {
          name: preferences.secretary_name || "秘书",
          avatarType: preferences.secretary_avatars?.type || "oneesan",
          personalityType: preferences.secretary_personalities?.type || "gentle",
        };
      } else {
        config = {
          name: "秘书",
          avatarType: "oneesan",
          personalityType: "gentle",
        };
      }
    }

    // 构建系统提示词
    const systemPrompt = `${avatarRoles[config.avatarType as keyof typeof avatarRoles] || avatarRoles.oneesan}
${personalityPrompts[config.personalityType as keyof typeof personalityPrompts] || personalityPrompts.gentle}

你的名字是"${config.name}"。你是用户的专属学习秘书，主要职责是：
1. 帮助用户管理学习任务和时间
2. 提供学习建议和鼓励
3. 回答用户的问题
4. 关心用户的学习状态和心情

请用简洁、自然的语言回答，不要太长，保持对话的流畅性。回答时要符合你的性格特点。`;

    // 获取对话历史（最近5条）
    const { data: history } = await supabase
      .from("secretary_chat_history")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history?.reverse() || []),
      { role: "user", content: message },
    ];

    // 调用文心一言API（需要配置API密钥）
    const apiKey = Deno.env.get("ERNIE_API_KEY");
    if (!apiKey) {
      // 如果没有配置API，返回模拟回复
      const mockReply = generateMockReply(message, config);
      
      // 保存对话历史
      await supabase.from("secretary_chat_history").insert([
        { user_id: userId, role: "user", content: message },
        { user_id: userId, role: "assistant", content: mockReply },
      ]);

      return new Response(
        JSON.stringify({ reply: mockReply, mode: "mock" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 调用文心一言API
    const response = await fetch("https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.slice(-6), // 只发送最近的对话
        temperature: 0.8,
        top_p: 0.9,
      }),
    });

    const data = await response.json();
    const reply = data.result || "抱歉，我现在有点忙，稍后再聊吧~";

    // 保存对话历史
    await supabase.from("secretary_chat_history").insert([
      { user_id: userId, role: "user", content: message },
      { user_id: userId, role: "assistant", content: reply },
    ]);

    return new Response(
      JSON.stringify({ reply, mode: "ai" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// 生成模拟回复（当没有配置AI API时使用）
function generateMockReply(message: string, config: any): string {
  const lowerMessage = message.toLowerCase();
  
  // 根据性格类型生成不同风格的回复
  const replies: Record<string, string[]> = {
    gentle: [
      "我明白你的意思了，让我来帮你想想办法吧~",
      "别担心，我们一起慢慢来，一定可以解决的。",
      "你做得很好呢，继续保持这个状态！",
      "有什么需要帮助的尽管告诉我哦~",
    ],
    strict: [
      "好的，我会帮你制定一个详细的计划。",
      "时间很宝贵，我们要高效利用每一分钟。",
      "这个任务很重要，务必按时完成。",
      "我看到你的进度了，还需要继续努力。",
    ],
    lively: [
      "哈哈，这个问题有意思！让我想想~",
      "加油加油！你一定可以的！💪",
      "哇，这个想法不错哦！",
      "别灰心啦，失败是成功之母嘛~",
    ],
    calm: [
      "让我分析一下这个问题...",
      "根据目前的情况，我建议你这样做。",
      "我们需要理性地看待这个问题。",
      "这是一个很好的问题，值得深入思考。",
    ],
    motivating: [
      "太棒了！就是这个状态！",
      "相信自己，你一定可以做到的！",
      "每一步努力都不会白费，加油！",
      "你的潜力无限，继续前进吧！",
    ],
  };

  const personalityReplies = replies[config.personalityType] || replies.gentle;
  const randomReply = personalityReplies[Math.floor(Math.random() * personalityReplies.length)];

  // 根据消息内容返回更相关的回复
  if (lowerMessage.includes("学习") || lowerMessage.includes("作业")) {
    return `关于学习的事情，${randomReply}`;
  } else if (lowerMessage.includes("时间") || lowerMessage.includes("计划")) {
    return `时间管理很重要呢。${randomReply}`;
  } else if (lowerMessage.includes("累") || lowerMessage.includes("累了")) {
    return `辛苦了！要注意休息哦。${randomReply}`;
  } else {
    return randomReply;
  }
}
