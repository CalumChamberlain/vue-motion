declare module 'motion-vuejs' {
  import { DefineComponent } from 'vue';

  // Define the props interface
  interface MotionProps {
    as?: string;
    enter?: object | any[];
    exit?: object | any[];
    animate?: object;
    transition?: {
      duration?: number;
      ease?: string | any[];
      [key: string]: any;
    };
    whileHover?: object;
    whileTap?: object;
    easing?: string | any[];
    show?: boolean;
    inView?: boolean;
    reverseOutView?: boolean;
  }

  // Define the Motion component
  const Motion: DefineComponent<MotionProps>;

  export { Motion };
}