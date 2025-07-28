import * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    '--tw-ring-color'?: string;
    [key: `--${string}`]: any;
  }
}