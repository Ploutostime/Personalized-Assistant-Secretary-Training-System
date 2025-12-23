# 桌面宠物秘书功能说明

## 功能概述

桌面宠物秘书是智学秘伴的核心互动功能，将秘书以浮窗形式显示在屏幕上，用户可以随时与秘书互动，获得陪伴、鼓励和提醒。秘书会像桌面宠物一样陪伴你的学习时光。

## 核心特性

### 1. 桌面宠物形态

**浮窗显示**
- 以浮窗形式固定在屏幕上
- 始终显示在最上层（z-index: 50）
- 不影响其他页面操作
- 可以在任何页面看到秘书

**自由移动**
- 鼠标拖拽移动位置
- 限制在屏幕范围内
- 自动保存位置
- 下次打开恢复位置

**窗口控制**
- 最小化：缩小为小卡片
- 展开：恢复完整显示
- 关闭：隐藏桌面宠物

### 2. 互动功能

#### 点击互动

**点击秘书立绘**
- 触发问候语
- 显示对话气泡
- 播放语音（如果开启）
- 动画效果配合

**互动效果**
- 秘书会说随机的问候语
- 对话气泡显示说话内容
- 动画从idle切换到talking
- 3秒后自动消失

#### 互动按钮

**鼓励按钮** 💗
- 功能：播放鼓励语
- 效果：提升学习动力
- 内容：根据秘书性格定制
- 场景：需要鼓励时点击

**提醒按钮** 📖
- 功能：播放提醒语
- 效果：督促学习
- 内容：学习提醒和时间管理
- 场景：需要提醒时点击

**对话按钮** 💬
- 功能：打开对话窗口
- 效果：进行深度对话
- 内容：智能对话系统
- 场景：想聊天时点击

### 3. 语音互动

**语音播放**
- 使用Web Speech API
- 根据秘书类型配置音调和语速
- 支持中文语音
- 自动选择最佳语音

**语音控制**
- 开启/关闭语音按钮
- 音量图标指示状态
- 关闭时停止当前播放
- 状态持久化保存

**语音类型**
- 问候语：点击秘书时播放
- 鼓励语：点击鼓励按钮时播放
- 提醒语：点击提醒按钮时播放

### 4. 对话气泡系统

**显示效果**
- 白色/深色背景（根据主题）
- 圆角设计
- 小三角指向秘书
- 边框装饰
- 淡入动画

**自动消失**
- 显示3秒后自动消失
- 可以被新对话覆盖
- 消失时平滑过渡

**内容显示**
- 显示秘书说的话
- 文字清晰易读
- 支持多行文本
- 自适应宽度

### 5. 动画效果

#### idle（空闲状态）
- 上下浮动动画
- 3秒循环
- 营造生动感
- 绿色状态指示灯

#### talking（说话状态）
- 轻微弹跳动画
- 0.5秒循环
- 配合语音播放
- 黄色状态指示灯

#### thinking（思考状态）
- 左右摇摆动画
- 2秒持续
- 随机触发（30%概率）
- 黄色状态指示灯

## 使用方法

### 启用桌面宠物

1. **进入秘书形象页面**
   - 点击侧边栏的"秘书形象"
   - 或访问 `/secretary` 路由

2. **选择秘书和服装**
   - 在"选择秘书"标签中选择喜欢的秘书
   - 在"选择服装"标签中选择喜欢的服装
   - 在预览区域查看效果

3. **保存配置**
   - 点击"保存配置"按钮
   - 系统提示"保存成功！秘书已启用为桌面宠物"
   - 页面自动刷新

4. **查看桌面宠物**
   - 刷新后在屏幕右下角看到秘书
   - 秘书以浮窗形式显示
   - 可以开始互动

### 移动宠物

1. **开始拖拽**
   - 鼠标移到秘书上
   - 按住鼠标左键
   - 光标变为抓手形状

2. **移动位置**
   - 保持按住鼠标
   - 移动到想要的位置
   - 秘书会跟随鼠标移动

3. **完成移动**
   - 释放鼠标左键
   - 秘书固定在新位置
   - 位置自动保存

4. **位置限制**
   - 不能移出屏幕范围
   - 自动限制在可见区域
   - 确保秘书始终可见

### 互动操作

#### 点击秘书

1. 鼠标移到秘书立绘上
2. 点击秘书
3. 秘书会说问候语
4. 显示对话气泡
5. 播放语音（如果开启）
6. 动画切换到talking状态

#### 点击鼓励按钮

1. 点击底部的"鼓励"按钮
2. 秘书会说鼓励的话
3. 显示对话气泡
4. 播放语音（如果开启）
5. 获得学习动力

#### 点击提醒按钮

1. 点击底部的"提醒"按钮
2. 秘书会说提醒的话
3. 显示对话气泡
4. 播放语音（如果开启）
5. 督促学习

#### 打开对话窗口

1. 点击右上角的对话按钮
2. 对话窗口在秘书旁边打开
3. 可以进行深度对话
4. 再次点击关闭对话窗口

### 窗口控制

#### 语音控制

**开启语音**
- 点击语音按钮（Volume2图标）
- 按钮变为蓝色
- 互动时会播放语音

**关闭语音**
- 点击语音按钮（VolumeX图标）
- 按钮变为灰色
- 互动时不播放语音
- 当前播放的语音会停止

#### 最小化

**最小化宠物**
1. 点击右上角的最小化按钮
2. 秘书缩小为小卡片
3. 显示头像和名称
4. 仍可拖拽移动

**展开宠物**
1. 点击小卡片上的展开按钮
2. 秘书恢复完整显示
3. 所有功能可用

#### 关闭宠物

1. 点击右上角的关闭按钮
2. 秘书消失
3. 数据库配置更新为未启用
4. 下次登录不会自动显示
5. 可以在秘书形象页面重新启用

## 技术实现

### 拖拽功能

**实现原理**
```typescript
// 1. 鼠标按下记录偏移量
const handleMouseDown = (e: React.MouseEvent) => {
  setIsDragging(true);
  const rect = floatingRef.current?.getBoundingClientRect();
  setDragOffset({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });
};

// 2. 鼠标移动更新位置
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  
  const newX = e.clientX - dragOffset.x;
  const newY = e.clientY - dragOffset.y;
  
  // 限制在屏幕范围内
  const maxX = window.innerWidth - 200;
  const maxY = window.innerHeight - 300;
  
  setPosition({
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY)),
  });
};

// 3. 鼠标释放停止拖拽
const handleMouseUp = () => {
  setIsDragging(false);
};
```

**位置持久化**
```typescript
// 保存位置到localStorage
useEffect(() => {
  localStorage.setItem('secretary-2d-position', JSON.stringify(position));
}, [position]);

// 加载位置从localStorage
useEffect(() => {
  const savedPosition = localStorage.getItem('secretary-2d-position');
  if (savedPosition) {
    setPosition(JSON.parse(savedPosition));
  }
}, []);
```

### 对话气泡

**显示逻辑**
```typescript
const showDialogMessage = (text: string, duration = 3000) => {
  // 设置对话文本
  setDialogText(text);
  // 显示气泡
  setShowDialog(true);
  // 切换到说话动画
  setAnimation('talking');
  
  // 清除之前的定时器
  if (dialogTimerRef.current) {
    clearTimeout(dialogTimerRef.current);
  }
  
  // 设置新的定时器
  dialogTimerRef.current = setTimeout(() => {
    setShowDialog(false);
    setAnimation('idle');
  }, duration);
};
```

**UI实现**
```tsx
{showDialog && (
  <div className="absolute top-4 left-2 right-2 bg-white dark:bg-gray-800 backdrop-blur rounded-lg p-2 shadow-lg animate-fade-in border border-primary/20">
    <p className="text-xs text-foreground">{dialogText}</p>
    <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
  </div>
)}
```

### 语音播放

**播放逻辑**
```typescript
const speakWithDialog = (type: 'greeting' | 'comment' | 'encouragement' | 'reminder') => {
  // 获取秘书语音配置
  const config = getSecretaryVoiceConfig(secretary.type);
  
  // 根据类型选择短语
  let phrase = '';
  switch (type) {
    case 'greeting':
      phrase = getRandomPhrase(config.greetings);
      break;
    case 'encouragement':
      phrase = getRandomPhrase(config.encouragements);
      break;
    case 'reminder':
      phrase = getRandomPhrase(config.reminders);
      break;
  }
  
  // 显示对话气泡
  showDialogMessage(phrase);
  
  // 播放语音
  if (voiceEnabled) {
    voiceManager.speak(phrase, {
      pitch: config.pitch,
      rate: config.rate,
      volume: config.volume,
    });
  }
};
```

### 动画效果

**CSS动画**
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

**动画应用**
```typescript
const getAnimationClass = () => {
  switch (animation) {
    case 'talking':
      return 'animate-bounce-subtle';
    case 'thinking':
      return 'animate-sway';
    default:
      return 'animate-float';
  }
};
```

## 应用场景

### 学习陪伴

**全程陪伴**
- 秘书始终显示在屏幕上
- 无论在哪个页面都能看到
- 提供持续的陪伴感
- 减少学习孤独感

**随时互动**
- 想说话时点击秘书
- 需要鼓励时点击按钮
- 需要提醒时点击按钮
- 即时获得回应

### 时间管理

**学习提醒**
- 点击提醒按钮督促学习
- 秘书会说提醒的话
- 帮助保持学习节奏
- 养成良好学习习惯

**定时互动**
- 可以设置定时提醒（未来功能）
- 自动播放提醒语
- 防止长时间不学习
- 提高学习效率

### 情感支持

**鼓励激励**
- 点击鼓励按钮获得鼓励
- 秘书会说鼓励的话
- 提升学习动力
- 增强学习信心

**情感连接**
- 语音比文字更有温度
- 动画增加生动性
- 对话增强真实感
- 建立陪伴关系

### 个性化体验

**自定义秘书**
- 选择喜欢的秘书角色
- 选择喜欢的服装
- 调整秘书位置
- 控制语音开关

**适应习惯**
- 位置自动保存
- 语音状态保存
- 下次打开恢复
- 体验连贯

## 特色功能

### 智能动画

**自动动画**
- 空闲时自动浮动
- 随机触发思考动作
- 说话时配合弹跳
- 状态自然过渡

**动画配合**
- 点击时切换到talking
- 说话结束恢复idle
- 随机触发thinking
- 动画流畅自然

### 对话气泡

**视觉美观**
- 白色/深色背景
- 圆角设计
- 小三角指向
- 边框装饰

**信息清晰**
- 文字清晰易读
- 支持多行文本
- 自适应宽度
- 自动消失

### 语音同步

**同步显示**
- 说话时显示气泡
- 气泡内容与语音一致
- 动画配合语音
- 状态指示变化

**体验流畅**
- 语音和视觉同步
- 动画和语音配合
- 状态实时更新
- 无延迟感

### 位置记忆

**自动保存**
- 移动后自动保存
- 保存到localStorage
- 跨会话持久化
- 无需手动保存

**自动恢复**
- 下次打开恢复位置
- 保持用户习惯
- 体验连贯
- 用户友好

## 扩展方向

### 短期扩展

1. **更多互动动作**
   - 添加更多互动按钮
   - 支持更多互动类型
   - 增加互动趣味性

2. **自定义对话**
   - 支持用户自定义对话内容
   - 添加对话编辑器
   - 导入导出对话

3. **表情变化**
   - 添加多种表情
   - 根据场景切换表情
   - 增强表现力

4. **定时提醒**
   - 设置定时提醒
   - 自动播放提醒语
   - 帮助时间管理

### 长期扩展

1. **多秘书同时显示**
   - 支持多个秘书同时显示
   - 不同秘书不同位置
   - 秘书之间可以互动

2. **秘书之间互动**
   - 秘书之间对话
   - 协同提醒
   - 增加趣味性

3. **学习数据展示**
   - 在秘书上显示学习数据
   - 实时更新
   - 可视化展示

4. **智能对话系统**
   - 集成AI对话
   - 理解用户意图
   - 智能回复
   - 深度交互

## 常见问题

### Q: 如何启用桌面宠物？

A: 进入"秘书形象"页面，选择秘书和服装，点击"保存配置"按钮，页面刷新后即可看到桌面宠物。

### Q: 如何移动宠物位置？

A: 鼠标按住宠物任意位置，拖拽到想要的位置，释放鼠标即可。位置会自动保存。

### Q: 如何关闭桌面宠物？

A: 点击右上角的关闭按钮即可关闭。如需重新启用，请到"秘书形象"页面重新保存配置。

### Q: 为什么听不到声音？

A: 请检查：
1. 语音按钮是否开启（蓝色表示开启）
2. 浏览器是否允许网站播放声音
3. 系统音量是否打开
4. 浏览器是否支持Web Speech API

### Q: 对话气泡为什么自动消失？

A: 对话气泡会在显示3秒后自动消失，这是为了避免遮挡秘书立绘。如果想再次查看，可以再次点击互动。

### Q: 可以同时显示多个秘书吗？

A: 当前版本只支持显示一个秘书。多秘书同时显示功能在未来版本中会添加。

### Q: 宠物位置会保存吗？

A: 会的。移动宠物后，位置会自动保存到localStorage，下次打开会恢复到上次的位置。

### Q: 最小化后如何恢复？

A: 点击最小化卡片上的展开按钮（Maximize2图标）即可恢复完整显示。

## 总结

桌面宠物秘书是智学秘伴的核心互动功能，让秘书以浮窗形式陪伴你的学习时光。通过点击互动、语音播放、对话气泡、动画效果等功能，提供生动有趣的学习陪伴体验。

无论是需要鼓励、提醒还是陪伴，秘书都会随时响应你的需求，让学习不再孤单！
