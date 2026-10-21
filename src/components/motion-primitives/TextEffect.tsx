'use client';

import { motion, type TargetAndTransition, type Transition, type Variants } from 'motion/react';
import React from 'react';
import { ease, useReducedMotion } from '../../lib/motion';

export type PerType = 'word' | 'char' | 'line';
export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';

export type TextEffectProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.02, // brisk per-character pop so a whole headline reads quickly
  word: 0.05,
  line: 0.1,
};

const baseItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  blur: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
  'fade-in-blur': {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
  },
  scale: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } },
  },
  fade: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: baseItemVariants,
  },
  slide: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  },
} as const;

const AnimationComponent = React.memo(
  ({
    segment,
    variants,
    per,
    segmentWrapperClassName,
  }: {
    segment: string;
    variants: Variants;
    per: PerType;
    segmentWrapperClassName?: string;
  }) => {
    const content =
      per === 'line' ? (
        <motion.span variants={variants} className='block'>
          {segment}
        </motion.span>
      ) : per === 'word' ? (
        <motion.span
          aria-hidden='true'
          variants={variants}
          className='inline-block whitespace-pre'
        >
          {segment}
        </motion.span>
      ) : (
        <motion.span className='inline-block whitespace-pre'>
          {segment.split('').map((char, charIndex) => (
            <motion.span
              key={`char-${charIndex}`}
              aria-hidden='true'
              variants={variants}
              className='inline-block whitespace-pre'
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      );

    if (!segmentWrapperClassName) return content;

    const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';
    return (
      <span className={`${defaultWrapperClassName} ${segmentWrapperClassName}`}>
        {content}
      </span>
    );
  },
);

AnimationComponent.displayName = 'AnimationComponent';

const splitText = (text: string, per: PerType) => {
  if (per === 'line') return text.split('\n');
  return text.split(/(\s+)/);
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) {
  const reduced = useReducedMotion();
  const segments = splitText(children, per);
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  /*
   * Respect prefers-reduced-motion: render the plain text without
   * splitting it into animated spans.
   */
  if (reduced) {
    return <MotionTag className={className} style={style}>{children}</MotionTag>;
  }

  const base = presetVariants[preset];

  const containerVisible = (variants?.container?.visible ??
    base.container.visible) as TargetAndTransition;
  const itemVisible = (variants?.item?.visible ?? base.item.visible) as TargetAndTransition;

  const containerVariants: Variants = {
    ...(variants?.container ?? base.container),
    visible: {
      ...containerVisible,
      transition: {
        ...(containerVisible.transition ?? {}),
        ...containerTransition,
        staggerChildren: defaultStaggerTimes[per],
        delayChildren: delay,
        ease: ease.standard,
      },
    },
  };

  const itemVariants: Variants = {
    ...(variants?.item ?? base.item),
    visible: {
      ...itemVisible,
      transition: {
        ...(itemVisible.transition ?? {}),
        ...segmentTransition,
        duration: 0.25,
        ease: ease.sheet,
      },
    },
  };

  return (
    <MotionTag
      initial='hidden'
      animate='visible'
      // The dynamic `motion[as]` indexing narrows `variants`; framer-motion
      // accepts this `Variants` record at runtime.
      variants={({ container: containerVariants, item: itemVariants }) as unknown as Variants}
      className={className}
      style={style}
    >
      <span className='sr-only'>{children}</span>
      {segments.map((segment, index) => (
        <AnimationComponent
          key={`${per}-${index}-${segment}`}
          segment={segment}
          variants={itemVariants}
          per={per}
          segmentWrapperClassName={segmentWrapperClassName}
        />
      ))}
    </MotionTag>
  );
}
