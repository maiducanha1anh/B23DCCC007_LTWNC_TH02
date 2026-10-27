import type { Reducer } from 'react';

export function withLogger<S, A extends { type: string }>(
  reducer: Reducer<S, A>
): Reducer<S, A> {
  return (prevState: S, action: A): S => {
    const nextState = reducer(prevState, action);
    if (import.meta.env.DEV) {
      console.log(`[Action]: ${action.type}`);
      console.log('Prev State:', prevState);
      console.log('Next State:', nextState);
    }
    return nextState;
  };
}
