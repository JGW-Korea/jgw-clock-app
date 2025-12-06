import type { TimePickerController, TimePickerState } from "../types";

const mod60 = (num: number) => ((num % 60) + 60) % 60;

function toggleMeridiem(state: TimePickerState, element: HTMLUListElement) {
  state.isPMState = !state.isPMState;
  state.passiveTrigger = true;

  if(element) {
    element.scrollTo({
      top: state.isPMState ? element.scrollHeight : 0,
      behavior: "smooth"
    });
  }
}

export function syncMeridiem(index: number, state: TimePickerState, controllers: TimePickerController[]) {
  const i = mod60(index + (state.meridiemOverride ? 12 : 0));

  if(!state.prevWrapped || !state.prevUnwrapped) {
    state.prevWrapped = i;
    state.prevUnwrapped = i;
    state.lastOverride = state.meridiemOverride;
    return;
  }

  if(state.lastOverride !== state.meridiemOverride) {
    const shift = state.meridiemOverride ? +12 : -12;
    state.prevWrapped = mod60(state.prevWrapped + shift);
    state.prevUnwrapped += shift;
    state.lastOverride = state.meridiemOverride;
  }

  let delta = i - state.prevWrapped;

  if(delta > 30) delta -= 60;
  else if(delta < -30) delta += 60;
  if(delta === 0) return;

  const before = Math.floor(state.prevUnwrapped / 12);
  const after = Math.floor((state.prevUnwrapped + delta) / 12);

  if((after - before) & 1) {
    toggleMeridiem(state, controllers[0].element);
  }

  state.prevWrapped = i;
  state.prevUnwrapped += delta;
}