import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FunLearningGuide } from '@/types/types';
import { CheckCircle2, XCircle, Lightbulb, Play, ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FunLearningCardProps {
  guide: FunLearningGuide;
  onComplete?: () => void;
}

export function FunLearningCard({ guide, onComplete }: FunLearningCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    const correct = selectedOption === guide.correct_answer;
    setIsCorrect(correct);
    if (onComplete) onComplete();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-2 transition-all duration-300">
      <CardHeader className="bg-muted/30">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {guide.subject}
          </Badge>
          <span className="text-xs text-muted-foreground">趣味学习引导</span>
        </div>
        <CardTitle className="text-xl md:text-2xl leading-tight">
          {guide.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* 选项列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guide.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = isAnswered && option === guide.correct_answer;
            const isWrongSelection = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200",
                  !isAnswered && isSelected && "border-primary bg-primary/5",
                  !isAnswered && !isSelected && "border-muted hover:border-primary/50 hover:bg-muted/50",
                  isAnswered && isCorrectOption && "border-green-500 bg-green-50 dark:bg-green-950/20",
                  isAnswered && isWrongSelection && "border-destructive bg-destructive/5"
                )}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {isAnswered && isWrongSelection && <XCircle className="w-5 h-5 text-destructive" />}
              </button>
            );
          })}
        </div>

        {!isAnswered && (
          <div className="pt-4 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedOption}
              className="px-8 rounded-full"
            >
              提交答案
            </Button>
          </div>
        )}

        {/* 答案反馈与延伸 */}
        {isAnswered && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={cn(
              "p-4 rounded-xl flex items-start gap-3",
              isCorrect ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300" : "bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
            )}>
              <Lightbulb className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold mb-1">{isCorrect ? '太棒了，答对了！' : `别灰心，正确答案是：${guide.correct_answer}`}</p>
                <p className="text-sm opacity-90">{guide.fun_explanation}</p>
              </div>
            </div>

            {/* 相关知识点 */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-bold text-lg text-primary">
                <BookOpen className="w-5 h-5" />
                关联知识点：{guide.related_knowledge_title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed bg-muted/50 p-4 rounded-lg border">
                {guide.related_knowledge_content}
              </p>
            </div>

            {/* 视频推荐 */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-bold text-lg text-primary">
                <Play className="w-5 h-5" />
                推荐视频
              </h4>
              <a 
                href={guide.video_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block aspect-video rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all"
              >
                <img 
                  src={guide.video_cover} 
                  alt={guide.video_title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-medium line-clamp-1">{guide.video_title}</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
