import { useEffect, useRef, useState } from 'react';
import type { Dish } from '@/types';

interface SlotMachineProps {
  dishes: Dish[];
  spinning: boolean;
  result: Dish | null;
}

/**
 * 老虎机滚动组件
 * 使用 requestAnimationFrame 控制减速滚动
 */
export function SlotMachine({ dishes, spinning, result }: SlotMachineProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const speedRef = useRef(0);
  const [displayItems, setDisplayItems] = useState<Dish[]>([]);

  // 准备滚动列表（重复菜品以实现无缝滚动）
  useEffect(() => {
    if (dishes.length === 0) {
      setDisplayItems([]);
      return;
    }
    // 重复3次确保有足够内容滚动
    const repeated = [...dishes, ...dishes, ...dishes];
    setDisplayItems(repeated);
  }, [dishes]);

  // 滚动动画
  useEffect(() => {
    if (!spinning || displayItems.length === 0) return;

    const ITEM_HEIGHT = 72;
    const totalHeight = displayItems.length * ITEM_HEIGHT;
    speedRef.current = 35; // 初始速度 px/frame
    offsetRef.current = 0;

    const SPIN_DURATION = 2500; // 总时长 ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < SPIN_DURATION) {
        // 减速曲线：速度随时间递减
        const progress = elapsed / SPIN_DURATION;
        const speed = 35 * (1 - progress * 0.85);
        offsetRef.current += speed;

        // 循环
        if (offsetRef.current >= totalHeight) {
          offsetRef.current = offsetRef.current % totalHeight;
        }

        if (listRef.current) {
          listRef.current.style.transform = `translateY(-${offsetRef.current}px)`;
        }

        rafRef.current = requestAnimationFrame(animate);
      } else {
        // 停止 — 定格到结果（偏移到第二段，让结果出现在中间区域）
        if (result && listRef.current) {
          const baseLen = dishes.length;
          const firstIndex = displayItems.findIndex((d) => d.id === result.id);
          if (firstIndex !== -1) {
            // 偏移到第二段对应位置，视觉上更居中
            const targetIndex = firstIndex + baseLen;
            const targetOffset = targetIndex * ITEM_HEIGHT;
            listRef.current.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            listRef.current.style.transform = `translateY(-${targetOffset}px)`;
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (listRef.current) {
        listRef.current.style.transition = '';
      }
    };
  }, [spinning, displayItems, result]);

  // 静态展示结果（定格在第二段对应位置）
  useEffect(() => {
    if (!spinning && result && listRef.current) {
      const baseLen = dishes.length;
      const firstIndex = displayItems.findIndex((d) => d.id === result.id);
      if (firstIndex !== -1) {
        const targetIndex = firstIndex + baseLen;
        listRef.current.style.transition = '';
        listRef.current.style.transform = `translateY(-${targetIndex * 72}px)`;
      }
    }
  }, [spinning, result, displayItems, dishes.length]);

  if (displayItems.length === 0) {
    return (
      <div className="slot-machine">
        <div className="slot-viewport">
          <div className="slot-list" ref={listRef}>
            <div className="slot-item">
              <span className="emoji">🍽️</span>
              <span className="name">暂无菜品</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slot-machine">
      <div className="slot-viewport">
        <div className="slot-list" ref={listRef}>
          {displayItems.map((dish, i) => (
            <div className="slot-item" key={`${dish.id}-${i}`}>
              <span className="emoji">{dish.emoji}</span>
              <span className="name">{dish.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
