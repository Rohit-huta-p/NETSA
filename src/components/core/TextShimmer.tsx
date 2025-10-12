
"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TextShimmer({
  className,
  duration = 2,
  children,
}: {
  className?: string;
  duration?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      init={{
        '--x': '100%',
      }}
      animate={{
        '--x': '-100%',
      }}
      transition={{
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0.2,
        type: 'spring',
        stiffness: 20,
        damping: 40,
        duration: duration,
      }}
      className={cn(
        'text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-400',
        'dark:from-neutral-600 dark:to-neutral-600',
        'animate-shimmer', // Using a CSS animation for the background gradient
        className
      )}
      style={{
        // Using CSS variables to drive the gradient animation
        backgroundImage: `linear-gradient(120deg, transparent, oklch(0.9 0.05 240), transparent, oklch(0.9 0.05 240), transparent)`,
        backgroundSize: '200% 100%',
        backgroundPosition: 'var(--x, 100%) 0',
      }}
    >
      {children}
    </motion.div>
  );
}
