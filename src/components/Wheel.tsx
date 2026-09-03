import { useRef, useState, useEffect } from 'react';
import type { Dish } from '@/types';

interface WheelProps {
  dishes: Dish[];
  spinning: boolean;
  result: Dish | null;
  onSpinEnd?: () => void;
}

const COLORS = ['#FF6B35', '#FFD700', '#7CB342', '#FF8C5A'];

/**
 * 转盘组件
 * 使用 CSS transition 实现减速旋转
 */
export function Wheel({ dishes, spinning, result, onSpinEnd }: WheelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSpinningRef = useRef(false);

  // 取最多8个菜品用于转盘
  const wheelDishes = dishes.slice(0, 8);
  const count = wheelDishes.length;

  useEffect(() => {
    if (spinning && !prevSpinningRef.current && count > 0) {
      // 开始旋转
      const extraRotations = 5; // 至少转5圈
      const targetIndex = result ? wheelDishes.findIndex((d) => d.id === result.id) : 0;
      const sliceAngle = 360 / count;
      // 让指针（顶部）指向结果扇形中心
      const targetAngle = 360 - (targetIndex * sliceAngle + sliceAngle / 2);
      const newRotation = rotation + extraRotations * 360 + (targetAngle - (rotation % 360));

      setIsTransitioning(true);
      setRotation(newRotation);
    }
    prevSpinningRef.current = spinning;
  }, [spinning, result, count, rotation, wheelDishes]);

  // 旋转结束回调
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        onSpinEnd?.();
      }, 4100); // transition 4s + 100ms buffer
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, onSpinEnd]);

  if (count === 0) {
    return (
      <div className="wheel-container">
        <div className="wheel-pointer" />
        <div className="wheel-center">🍽️</div>
      </div>
    );
  }

  const sliceAngle = 360 / count;
  const radius = 90;
  const cx = 100, cy = 100;

  // 生成扇形路径
  const slices = wheelDishes.map((dish, i) => {
    const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

    // 文字位置（扇形中心）
    const midAngle = (startAngle + endAngle) / 2;
    const textR = radius * 0.65;
    const tx = cx + textR * Math.cos(midAngle);
    const ty = cy + textR * Math.sin(midAngle);

    return { path, fill: COLORS[i % COLORS.length], emoji: dish.emoji, tx, ty };
  });

  return (
    <div className="wheel-container">
      <div className="wheel-pointer" />
      <svg
        ref={svgRef}
        className="wheel-svg"
        viewBox="0 0 200 200"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isTransitioning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
        }}
      >
        {slices.map((slice, i) => (
          <g key={i}>
            <path d={slice.path} fill={slice.fill} />
            <text
              x={slice.tx}
              y={slice.ty}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="14"
            >
              {slice.emoji}
            </text>
          </g>
        ))}
      </svg>
      <div className="wheel-center">🍽️</div>
    </div>
  );
}
