'use client';

import { motion, useInView, type Transition, type Variant, type UseInViewOptions } from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';
import { duration, ease, useReducedMotion } from '../../lib/motion';

export interface InViewProps {
  children: ReactNode;
  variants?: { hidden: Variant; visible: Variant };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  once?: boolean;
  className?: string;
}

/*
 * Default reveal: fade up from 24 px, Apple-style "sheet" ease, ~800 ms.
 * Mirrors the previous scrollReveal helper so the existing visual
 * language is preserved while scrolling.
 */
const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.entrance, ease: ease.sheet },
  },
} as const;

const defaultViewOptions: UseInViewOptions = {
  margin: '0px 0px -12% 0px',
  amount: 0.12,
} as const;

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions = defaultViewOptions,
  as = 'div',
  once = true,
  className,
  ...rest
}: InViewProps & Record<string, unknown>) {
  const reduced = useReducedMotion();
  const ref: React.RefObject<HTMLElement | null> = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, viewOptions);
  const [isViewed, setIsViewed] = useState(false);

  const MotionComponent = motion[
    as as keyof typeof motion
  ] as typeof motion.div;

  /*
   * Respect prefers-reduced-motion: render the content immediately,
   * visible and without any animation.
   */
  if (reduced) {
    return (
      <MotionComponent ref={ref as React.Ref<HTMLDivElement>} className={className} style={{ opacity: 1 }} {...rest}>
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      ref={ref as React.Ref<HTMLDivElement>}
      initial='hidden'
      onAnimationComplete={() => {
        if (once) setIsViewed(true);
      }}
      animate={(isInView || isViewed) ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
