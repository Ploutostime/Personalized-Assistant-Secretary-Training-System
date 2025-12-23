// 语音合成管理工具
export class VoiceManager {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  // 加载可用语音
  private loadVoices() {
    this.voices = this.synth.getVoices();

    // 某些浏览器需要异步加载语音
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  // 获取中文语音
  private getChineseVoice(): SpeechSynthesisVoice | null {
    // 优先选择中文语音
    const chineseVoice = this.voices.find(
      (voice) =>
        voice.lang.includes('zh') ||
        voice.lang.includes('CN') ||
        voice.name.includes('Chinese')
    );

    return chineseVoice || this.voices[0] || null;
  }

  // 说话
  speak(
    text: string,
    options?: {
      pitch?: number; // 音调 0-2，默认1
      rate?: number; // 语速 0.1-10，默认1
      volume?: number; // 音量 0-1，默认1
      voice?: SpeechSynthesisVoice | null;
      onEnd?: () => void;
      onError?: (error: SpeechSynthesisErrorEvent) => void;
    }
  ) {
    // 停止当前语音
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // 设置语音参数
    utterance.pitch = options?.pitch ?? 1;
    utterance.rate = options?.rate ?? 1;
    utterance.volume = options?.volume ?? 1;

    // 设置语音
    const voice = options?.voice || this.getChineseVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // 设置回调
    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    if (options?.onError) {
      utterance.onerror = options.onError;
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  // 停止语音
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  // 暂停语音
  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  // 恢复语音
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  // 检查是否正在说话
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  // 检查是否暂停
  isPaused(): boolean {
    return this.synth.paused;
  }

  // 获取所有可用语音
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// 秘书语音配置
export interface SecretaryVoiceConfig {
  pitch: number; // 音调 0-2
  rate: number; // 语速 0.1-10
  volume: number; // 音量 0-1
  greetings: string[]; // 问候语列表
  comments: string[]; // 评论列表
  encouragements: string[]; // 鼓励语列表
  reminders: string[]; // 提醒语列表
}

// 预设秘书语音配置
export const secretaryVoiceConfigs: Record<string, SecretaryVoiceConfig> = {
  // 小萌（萝莉）- 高音调，快语速
  loli: {
    pitch: 1.8,
    rate: 1.2,
    volume: 1,
    greetings: [
      '主人好呀！小萌来陪你学习啦~',
      '嘿嘿，主人今天也要加油哦！',
      '小萌在这里等你很久了呢~',
    ],
    comments: [
      '哇！这套衣服好可爱呀~',
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

  // 优雅姐姐（御姐）- 中低音调，慢语速
  oneesan: {
    pitch: 0.9,
    rate: 0.9,
    volume: 1,
    greetings: [
      '欢迎回来，今天也要努力学习哦。',
      '你好，我会陪伴你完成今天的学习任务。',
      '准备好开始了吗？让我们一起加油吧。',
    ],
    comments: [
      '这套装扮很适合我呢。',
      '你的品味不错。',
      '嗯，这样看起来很优雅。',
    ],
    encouragements: [
      '你做得很好，继续保持。',
      '相信自己，你一定可以的。',
      '不要着急，慢慢来就好。',
    ],
    reminders: [
      '该学习了，不要偷懒哦。',
      '时间管理很重要，我们开始吧。',
      '休息结束了，该继续努力了。',
    ],
  },

  // 温柔学姐 - 中音调，正常语速
  senior_sister: {
    pitch: 1.1,
    rate: 1.0,
    volume: 1,
    greetings: [
      '你好呀，今天也要好好学习哦。',
      '欢迎回来，学姐会一直陪着你的。',
      '准备好了吗？让我们一起努力吧。',
    ],
    comments: [
      '这套衣服很好看呢。',
      '嗯，很适合我。',
      '谢谢你为我挑选的衣服。',
    ],
    encouragements: [
      '加油，你一定可以做到的。',
      '学姐相信你的能力。',
      '不要气馁，继续努力吧。',
    ],
    reminders: [
      '该学习了，不要拖延哦。',
      '时间到了，我们开始吧。',
      '休息够了，该继续学习了。',
    ],
  },

  // 稳重叔叔 - 低音调，慢语速
  uncle: {
    pitch: 0.7,
    rate: 0.85,
    volume: 1,
    greetings: [
      '你好，今天也要认真学习。',
      '欢迎，让我们开始今天的学习计划。',
      '准备好了吗？我会指导你的。',
    ],
    comments: [
      '这套装扮很得体。',
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

  // 霸道总裁 - 低音调，正常语速
  boss: {
    pitch: 0.8,
    rate: 1.0,
    volume: 1,
    greetings: [
      '来了？那就开始吧。',
      '时间就是金钱，不要浪费。',
      '准备好接受挑战了吗？',
    ],
    comments: [
      '还不错。',
      '这套装扮符合我的身份。',
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

  // 阳光学长 - 中音调，快语速
  senior_brother: {
    pitch: 1.0,
    rate: 1.1,
    volume: 1,
    greetings: [
      '嘿！今天也要元气满满哦！',
      '来啦！一起加油吧！',
      '准备好了吗？让我们开始吧！',
    ],
    comments: [
      '这套衣服很帅气！',
      '哈哈，不错不错！',
      '很适合运动呢！',
    ],
    encouragements: [
      '加油！你可以的！',
      '相信自己，冲鸭！',
      '再努力一点，胜利就在眼前！',
    ],
    reminders: [
      '该学习了，动起来！',
      '时间到了，开始吧！',
      '休息够了，继续努力！',
    ],
  },

  // 默认配置
  default: {
    pitch: 1.0,
    rate: 1.0,
    volume: 1,
    greetings: ['你好，欢迎回来。', '准备好开始了吗？', '让我们一起努力吧。'],
    comments: ['这套装扮不错。', '很好看。', '很适合。'],
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
