import React, { useEffect, useState } from 'react';
import { getFunLearningGuides } from '@/db/api';
import { FunLearningGuide } from '@/types/types';
import { FunLearningCard } from '@/components/fun/FunLearningCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, GraduationCap } from 'lucide-react';

export default function FunLearningPage() {
  const [guides, setGuides] = useState<FunLearningGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const data = await getFunLearningGuides();
        setGuides(data);
      } catch (error) {
        console.error('Failed to fetch guides:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  const handleNext = () => {
    if (currentIndex < guides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back or show completion
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center gap-6">
        <Skeleton className="h-10 w-64 bg-muted" />
        <Skeleton className="h-[500px] w-full max-w-2xl rounded-xl bg-muted" />
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-muted-foreground">暂时没有趣味学习内容哦~</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 min-h-[calc(100vh-4rem)]">
      {/* 头部装饰 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          趣味探索模式
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center justify-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          知识探险营
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          每天一个小问题，在轻松愉快的氛围中探索科学的奥秘，发现学习的乐趣！
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <FunLearningCard 
          key={guides[currentIndex].id} 
          guide={guides[currentIndex]} 
        />

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} / {guides.length}
          </p>
          <Button 
            variant="outline" 
            onClick={handleNext}
            className="rounded-full gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            换一个挑战
          </Button>
        </div>
      </div>
    </div>
  );
}
