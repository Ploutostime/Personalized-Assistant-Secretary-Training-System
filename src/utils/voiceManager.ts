import { supabase } from '@/db/supabase';

// 语音合成管理工具（使用MiniMax TTS API）
export class VoiceManager {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache: Map<string, string> = new Map(); // 缓存音频base64数据

  constructor() {
    // 初始化
  }

  // 说话（使用MiniMax TTS API）
  async speak(
    text: string,
    options?: {
      secretaryType: string; // 秘书类型
      onEnd?: () => void;
      onError?: (error: Error) => void;
    }
  ) {
    try {
      // 停止当前语音
      this.stop();

      if (!options?.secretaryType) {
        console.warn('未指定秘书类型，无法生成语音');
        return;
      }

      // 生成缓存key
      const cacheKey = `${options.secretaryType}_${text}`;

      // 检查缓存
      let audioBase64 = this.audioCache.get(cacheKey);

      if (!audioBase64) {
        // 调用Edge Function生成语音
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: {
            text,
            secretaryType: options.secretaryType,
          },
        });

        if (error) {
          throw error;
        }

        if (!data.success) {
          throw new Error(data.error || '语音生成失败');
        }

        audioBase64 = data.audio as string;

        // 缓存音频数据（最多缓存50条）
        if (this.audioCache.size >= 50) {
          const firstKey = this.audioCache.keys().next().value as string;
          this.audioCache.delete(firstKey);
        }
        this.audioCache.set(cacheKey, audioBase64);
      }

      // 创建音频对象并播放
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      this.currentAudio = audio;

      // 设置回调
      if (options?.onEnd) {
        audio.onended = options.onEnd;
      }

      if (options?.onError) {
        audio.onerror = () => options.onError?.(new Error('音频播放失败'));
      }

      // 播放音频
      await audio.play();
    } catch (error) {
      console.error('语音播放失败:', error);
      if (options?.onError) {
        options.onError(error as Error);
      }
    }
  }

  // 停止语音
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  // 检查是否正在说话
  isSpeaking(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  // 清除缓存
  clearCache() {
    this.audioCache.clear();
  }
}

// 秘书语音配置（用于对话内容）
export interface SecretaryVoiceConfig {
  greetings: string[]; // 问候语列表
  comments: string[]; // 评论列表
  encouragements: string[]; // 鼓励语列表
  reminders: string[]; // 提醒语列表
}

// 预设秘书语音配置
export const secretaryVoiceConfigs: Record<string, SecretaryVoiceConfig> = {
  // 小萌（萝莉）
  loli: {
    greetings: [
      '主人好呀！小萌来陪你学习啦~',
      '嘿嘿，主人今天也要加油哦！',
      '小萌在这里等你很久了呢~',
    ],
    comments: [
      '哇！这个好可爱呀~',
      '主人觉得这样好看吗？',
      '嘻嘻，小萌很喜欢这个呢！',
    ],
    encouragements: [
      '主人加油！你是最棒的！',
      '不要放弃哦，小萌相信你！',
      '再坚持一下，马上就成功了！',
    ],
    reminders: [
      '主人，该学习了哦~',
      '休息够了吗？我们继续吧！',
      '时间到啦，该完成任务了呢~',
    ],
  },

  // 优雅姐姐（御姐）
  oneesan: {
    greetings: [
      '欢迎回来，今天也要努力学习哦。',
      '你好，我会陪伴你完成今天的学习任务。',
      '准备好开始了吗？让我们一起加油吧。',
    ],
    comments: [
      '这个很适合我呢。',
      '你的品味不错。',
      '嗯，这样看起来很优雅。',
    ],
    encouragements: [
      '你做得很好，继续保持。',
      '相信自己，你一定可以的。',
      '不要着急，慢慢来就好。',
    ],
    reminders: [
      '该学习了，不要拖延哦。',
      '时间到了，我们开始吧。',
      '休息够了，该继续学习了。',
    ],
  },

  // 稳重叔叔
  uncle: {
    greetings: [
      '你好，今天也要认真学习。',
      '欢迎，让我们开始今天的学习计划。',
      '准备好了吗？我会指导你的。',
    ],
    comments: [
      '这个很得体。',
      '嗯，不错的选择。',
      '很适合工作场合。',
    ],
    encouragements: [
      '做得好，继续保持这个状态。',
      '你的努力我都看在眼里。',
      '稳扎稳打，一步一个脚印。',
    ],
    reminders: [
      '该学习了，时间很宝贵。',
      '不要浪费时间，开始吧。',
      '学习需要持之以恒。',
    ],
  },

  // 霸道总裁
  boss: {
    greetings: [
      '来了？那就开始吧。',
      '时间就是金钱，不要浪费。',
      '准备好接受挑战了吗？',
    ],
    comments: [
      '还不错。',
      '这个符合我的身份。',
      '嗯，可以接受。',
    ],
    encouragements: [
      '做得好，这才是我要的结果。',
      '继续努力，不要让我失望。',
      '你有潜力，发挥出来。',
    ],
    reminders: [
      '该工作了，别磨蹭。',
      '时间到了，立刻开始。',
      '效率第一，马上行动。',
    ],
  },

  // 温柔学姐
  senior_sister: {
    greetings: [
      '学弟/学妹，今天也要加油哦~',
      '来啦！一起学习吧！',
      '准备好了吗？学姐陪你一起努力！',
    ],
    comments: [
      '这个很可爱呢！',
      '哈哈，很适合你！',
      '学姐也很喜欢！',
    ],
    encouragements: [
      '加油！你可以的！',
      '相信自己，学姐支持你！',
      '再努力一点，胜利就在眼前！',
    ],
    reminders: [
      '该学习了，不要偷懒哦~',
      '时间到了，开始吧！',
      '休息够了，继续努力！',
    ],
  },

  // 精灵
  elf: {
    greetings: [
      '森林的祝福与你同在。',
      '欢迎，旅行者。',
      '让自然的智慧指引你前行。',
    ],
    comments: [
      '这很符合自然之美。',
      '优雅而和谐。',
      '森林会喜欢的。',
    ],
    encouragements: [
      '相信自己的力量。',
      '如同树木般坚韧成长。',
      '智慧会照亮你的道路。',
    ],
    reminders: [
      '时光流逝，该继续前行了。',
      '学习的时刻到了。',
      '让我们开始吧。',
    ],
  },

  // 骑士
  knight: {
    greetings: [
      '为了荣耀，让我们开始吧！',
      '勇士，准备好战斗了吗？',
      '今天也要勇往直前！',
    ],
    comments: [
      '这套装备很不错。',
      '符合骑士的荣耀。',
      '很好，很有气势。',
    ],
    encouragements: [
      '勇敢前进，不要退缩！',
      '你拥有战士的勇气！',
      '胜利属于坚持到底的人！',
    ],
    reminders: [
      '战斗的时刻到了！',
      '不要松懈，继续前进！',
      '荣耀在召唤你！',
    ],
  },

  // 女巫
  witch: {
    greetings: [
      '呵呵，欢迎来到魔法的世界~',
      '今天要学习什么魔法呢？',
      '准备好接受魔法的洗礼了吗？',
    ],
    comments: [
      '这个很有魔法的感觉呢~',
      '呵呵，不错的选择。',
      '很适合施展魔法。',
    ],
    encouragements: [
      '相信魔法，相信自己！',
      '你拥有强大的魔力！',
      '继续修炼，你会更强大！',
    ],
    reminders: [
      '魔法修炼的时间到了~',
      '不要偷懒哦，魔法需要勤奋。',
      '开始今天的魔法课程吧！',
    ],
  },

  // 天使
  angel: {
    greetings: [
      '愿光明照耀你的道路。',
      '孩子，我会守护你的学习。',
      '让我们一起努力吧。',
    ],
    comments: [
      '这很纯洁美好。',
      '充满了光明的气息。',
      '很适合你。',
    ],
    encouragements: [
      '不要放弃，光明与你同在。',
      '你的努力会得到回报。',
      '相信自己，你能做到。',
    ],
    reminders: [
      '学习的时刻到了。',
      '让我们开始吧，孩子。',
      '时间宝贵，不要浪费。',
    ],
  },

  // 书生
  scholar: {
    greetings: [
      '书中自有黄金屋，一起读书吧。',
      '欢迎，今日当勤学苦读。',
      '学海无涯，让我们启程。',
    ],
    comments: [
      '此装甚为得体。',
      '颇有文人风范。',
      '甚好，甚好。',
    ],
    encouragements: [
      '学而不倦，必有所成。',
      '持之以恒，方能成才。',
      '汝之努力，吾皆看在眼中。',
    ],
    reminders: [
      '时辰已到，当开始读书。',
      '莫要懈怠，勤学为要。',
      '书不可不读也。',
    ],
  },

  // 武者
  warrior: {
    greetings: [
      '武道之路，永无止境！',
      '今日也要刻苦修炼！',
      '准备好了吗？开始吧！',
    ],
    comments: [
      '这身装束很适合修炼。',
      '不错，很有武者风范。',
      '好，很有气势。',
    ],
    encouragements: [
      '坚持下去，你会更强！',
      '武道需要毅力和决心！',
      '你的潜力无限！',
    ],
    reminders: [
      '修炼的时间到了！',
      '不可松懈，继续努力！',
      '武道需要日日精进！',
    ],
  },

  // 公主
  princess: {
    greetings: [
      '欢迎，今天也要优雅地学习哦~',
      '让我们开始今天的课程吧。',
      '准备好了吗？一起加油。',
    ],
    comments: [
      '这套很华丽呢~',
      '很符合公主的气质。',
      '真是优雅美丽。',
    ],
    encouragements: [
      '你做得很好，继续保持。',
      '相信自己，你很优秀。',
      '不要气馁，慢慢来。',
    ],
    reminders: [
      '该学习了，不要拖延哦。',
      '时间到了，开始吧。',
      '让我们继续努力。',
    ],
  },

  // 程序员
  programmer: {
    greetings: [
      'Hello World! 准备好写代码了吗？',
      '今天要解决什么bug呢？',
      '让我们开始编程吧！',
    ],
    comments: [
      '这套装备很geek！',
      '程序员的标配啊。',
      '不错，很有科技感。',
    ],
    encouragements: [
      '代码写得不错，继续加油！',
      'Debug成功，你很棒！',
      '保持这个状态，你会成为大神！',
    ],
    reminders: [
      '该写代码了，别摸鱼！',
      'Deadline要到了，快开始！',
      '时间就是金钱，开始工作！',
    ],
  },

  // 艺术家
  artist: {
    greetings: [
      '艺术源于生活，让我们创作吧！',
      '今天要画什么呢？',
      '准备好释放创意了吗？',
    ],
    comments: [
      '这个很有艺术感！',
      '色彩搭配很棒！',
      '充满了创意！',
    ],
    encouragements: [
      '你的创意很棒！',
      '继续创作，你会更优秀！',
      '艺术需要坚持和热情！',
    ],
    reminders: [
      '创作的时间到了！',
      '灵感来了，快开始！',
      '不要浪费创作的冲动！',
    ],
  },

  // 运动员
  athlete: {
    greetings: [
      '准备好运动了吗？Let\'s go!',
      '今天也要充满活力！',
      '一起挑战极限吧！',
    ],
    comments: [
      '这套运动装很帅！',
      '很适合运动！',
      '充满了活力！',
    ],
    encouragements: [
      '加油！你可以做到！',
      '突破极限，超越自我！',
      '坚持就是胜利！',
    ],
    reminders: [
      '训练时间到了！',
      '不要偷懒，开始运动！',
      '汗水不会骗人，开始吧！',
    ],
  },

  // 默认配置
  default: {
    greetings: ['你好，欢迎回来。', '准备好开始了吗？', '让我们一起努力吧。'],
    comments: ['这个不错。', '很好看。', '很适合。'],
    encouragements: ['加油，你可以的。', '继续努力。', '不要放弃。'],
    reminders: ['该学习了。', '时间到了。', '开始吧。'],
  },
};

// 获取秘书语音配置
export function getSecretaryVoiceConfig(
  secretaryType: string
): SecretaryVoiceConfig {
  return secretaryVoiceConfigs[secretaryType] || secretaryVoiceConfigs.default;
}

// 随机选择一句话
export function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 创建全局语音管理器实例
export const voiceManager = new VoiceManager();
