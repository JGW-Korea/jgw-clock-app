// useTimePickerAnimation.ts
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

const TOTAL = 60;
const DEG_STEP = 360 / TOTAL;
const BUFFER = 2;
const FRAMES = 20;
const LINE_HEIGHT = 34; // $line-height: 8.5rem, 1rem = 4px → 34px

const pad2 = (n: number) => String(n).padStart(2, "0");
const mod = (n: number, m: number) => ((n % m) + m) % m;
const mod60 = (n: number) => mod(n, TOTAL);
const snapRotation = (deg: number) => Math.round(deg / DEG_STEP) * DEG_STEP;

const indexFromRotation = (deg: number) => {
  const raw =
    deg < 0 ? Math.abs((deg % 360) / DEG_STEP) : TOTAL - (deg % 360) / DEG_STEP;
  return Math.round(raw) % TOTAL;
};

const getScrollIndex = (el: HTMLElement, straight = false) => {
  const h = el.offsetHeight;
  if (!h) return 0;

  const raw = el.scrollTop / h;
  let idx = Math.round(raw);

  if (Math.abs(raw - Math.round(raw)) < 1e-6) idx = Math.round(raw);

  if (straight) return idx;

  const count = Math.round(el.scrollHeight / h);

  if (idx < 0 || idx > count - 2) idx = 0;
  return idx;
};

const maintainInfiniteLoop = (el: HTMLElement) => {
  const itemSize = el.offsetHeight; // li height
  const maxScroll = el.scrollHeight - itemSize;

  // bottom 무한 루프
  if (el.scrollTop >= maxScroll - itemSize) {
    el.scrollTop = BUFFER * itemSize;
  }

  // top 무한 루프
  if (el.scrollTop <= itemSize) {
    el.scrollTop = maxScroll - BUFFER * itemSize;
  }
};

const setProxyRotationFromIndex = (proxy: HTMLElement, idx: number) =>
  gsap.set(proxy, { rotation: (TOTAL - idx) * DEG_STEP });

export default function useTimePickerAnimation() {
  const meridiemRef = useRef<HTMLUListElement>(null);
  const hoursRef = useRef<HTMLUListElement>(null);
  const minutesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const controllerHours = hoursRef.current!;
    const controllerMinutes = minutesRef.current!;
    const controllerMeridiem = meridiemRef.current!;

    // DOM 구조: <ul controller> → <div .picker-wheel> → <div .picker-track><div .picker-track-holder>
    const wheelHours = controllerHours.nextElementSibling as HTMLElement;
    const wheelMinutes = controllerMinutes.nextElementSibling as HTMLElement;
    const wheelMeridiem = controllerMeridiem.nextElementSibling as HTMLElement;

    const trackHours = wheelHours.nextElementSibling!
      .firstElementChild as HTMLElement;
    const trackMinutes = wheelMinutes.nextElementSibling!
      .firstElementChild as HTMLElement;
    const trackMeridiem = wheelMeridiem.nextElementSibling!
      .firstElementChild as HTMLElement;

    const PROXY_HOURS = document.createElement("div");
    const PROXY_MINUTES = document.createElement("div");
    const PROXY_MERIDIEM = document.createElement("div");

    let meridiemGuard = false;
    let meridiemStart: number | undefined;
    let passiveTrigger = false;
    let programmaticClear: any = null;
    let meridiemOverride = false;

    // AM / PM 상태
    let isPMState = false;
    const setMeridiem = (isPM: boolean) => {
      isPMState = !!isPM;
    };

    const toggleMeridiem = (drive?: boolean) => {
      setMeridiem(!isPMState);
      if (drive) {
        passiveTrigger = true;
        controllerMeridiem.scrollTo({
          top: isPMState ? controllerMeridiem.scrollHeight : 0,
          behavior: "smooth",
        });
      }
    };

    const hour24FromIndex = (i: number) => {
      const h12 = i % 12 || 12;
      return isPMState ? (h12 === 12 ? 12 : h12 + 12) : h12 === 12 ? 0 : h12;
    };

    const updateTimeInput = (hIdx: number, mIdx: number) => {
      // React 상위 state로 넘겨도 되고, 현재는 단순 로그로 유지
      console.log(`${pad2(hour24FromIndex(hIdx))}:${pad2(mIdx)}`);
    };

    // ===== meridiem sync 상태 (원본 그대로) =====
    let prevWrapped: number | null = null; // 0..59
    let prevUnwrapped: number | null = null; // 연속 인덱스
    let lastOverride = false;

    function syncMeridiem(index0to59: number) {
      const i = mod60(index0to59 + (meridiemOverride ? 12 : 0));

      if (prevWrapped === null) {
        prevWrapped = i;
        prevUnwrapped = i;
        lastOverride = !!meridiemOverride;
        return;
      }

      if (lastOverride !== !!meridiemOverride) {
        const shift = meridiemOverride ? +12 : -12;
        prevWrapped = mod60(prevWrapped + shift);
        prevUnwrapped! += shift;
        lastOverride = !!meridiemOverride;
      }

      let delta = i - prevWrapped;
      if (delta > 30) delta -= 60;
      else if (delta < -30) delta += 60;
      if (delta === 0) return;

      const before = Math.floor(prevUnwrapped! / 12);
      const after = Math.floor((prevUnwrapped! + delta) / 12);
      if (Math.abs(after - before) & 1) toggleMeridiem(true);

      prevWrapped = i;
      prevUnwrapped! += delta;
    }

    // ===== Scroll watcher (원본 그대로, axis: vertical만) =====
    function createScrollWatcher(
      target: HTMLElement,
      {
        frames = FRAMES,
        onStart,
        onFrame,
        onStop,
      }: {
        frames?: number;
        onStart?: () => void;
        onFrame?: (pos: number) => void;
        onStop?: () => void;
      }
    ) {
      let last: number | null = null;
      let repeats = 0;
      let raf: number | null = null;

      const getScrollPosition = () => target.scrollTop;

      const addOnce = () =>
        target.addEventListener("scroll", kick, { once: true, passive: false });

      const frame = () => {
        const position = getScrollPosition();
        onFrame?.(position);

        const hasChanged = position !== last;
        repeats = hasChanged ? 1 : repeats + 1;
        last = position;

        if (repeats >= frames) {
          onStop?.();
          if (raf) cancelAnimationFrame(raf);
          raf = null;
          last = null;
          repeats = 0;
          addOnce();
          return;
        }
        raf = requestAnimationFrame(frame);
      };

      const kick = () => {
        onStart?.();
        if (raf) return;
        last = getScrollPosition();
        repeats = 1;
        raf = requestAnimationFrame(frame);
      };

      addOnce();

      return {
        destroy() {
          if (raf) cancelAnimationFrame(raf);
          target.removeEventListener("scroll", kick);
        },
        isRunning() {
          return !!raf;
        },
      };
    }

    // ===== Draggable wheel 생성 (원본 그대로 포트) =====
    function createWheel({
      key,
      proxyEl,
      trigger,
      wheelEl,
      track,
      controller,
      bounds,
      onStart,
      onComplete,
    }: {
      key: "hours" | "minutes" | "meridiem";
      proxyEl: HTMLElement;
      trigger: HTMLElement;
      wheelEl: HTMLElement;
      track: HTMLElement;
      controller: HTMLElement;
      bounds?: { minRotation: number; maxRotation: number };
      onStart?: (this: any) => void;
      onComplete?: (idx: number, rotation: number) => void;
    }) {
      Draggable.create(proxyEl, {
        type: "rotation",
        trigger,
        inertia: true,
        ...(bounds ? { bounds } : {}),
        onDragStart: function () {
          onStart?.call(this);
        },
        onDrag: function () {
          gsap.set(wheelEl, { rotateX: this.rotation * -1 });

          const trackBounds = track.getBoundingClientRect();
          if (!bounds) {
            const r =
              this.rotation < 0
                ? 360 - Math.abs(this.rotation % 360)
                : this.rotation;

            gsap.set(track, {
              y:
                (1 - (r % 360) / 360) *
                -(trackBounds.height - LINE_HEIGHT),
            });
          } else {
            gsap.set(track, {
              y: gsap.utils.mapRange(
                0,
                -DEG_STEP,
                0,
                -(trackBounds.height - LINE_HEIGHT)
              )(this.rotation),
            });
          }

          const h = getScrollIndex(controllerHours);
          const m = getScrollIndex(controllerMinutes);

          if (key === "hours") {
            const idx = indexFromRotation(this.rotation);
            syncMeridiem(idx);
            updateTimeInput(idx, m);
          } else if (key === "minutes") {
            const idx = indexFromRotation(this.rotation);
            syncMeridiem(h);
            updateTimeInput(h, idx);
          } else {
            syncMeridiem(h);
            updateTimeInput(h, m);
          }
        },
        onThrowUpdate: function () {
          gsap.set(wheelEl, { rotateX: this.rotation * -1 });

          const trackBounds = track.getBoundingClientRect();
          if (!bounds) {
            const r =
              this.rotation < 0
                ? 360 - Math.abs(this.rotation % 360)
                : this.rotation;

            gsap.set(track, {
              y:
                (1 - (r % 360) / 360) *
                -(trackBounds.height - LINE_HEIGHT),
            });
          } else {
            gsap.set(track, {
              y: gsap.utils.mapRange(
                0,
                -DEG_STEP,
                0,
                -(trackBounds.height - LINE_HEIGHT)
              )(this.rotation),
            });
          }

          const h = getScrollIndex(controllerHours);
          const m = getScrollIndex(controllerMinutes);

          if (key === "hours") {
            const idx = indexFromRotation(this.rotation);
            syncMeridiem(idx);
            updateTimeInput(idx, m);
          } else if (key === "minutes") {
            const idx = indexFromRotation(this.rotation);
            syncMeridiem(h);
            updateTimeInput(h, idx);
          } else {
            syncMeridiem(h);
            updateTimeInput(h, m);
          }
        },
        snap: snapRotation,
        onThrowComplete: function () {
          const idx = indexFromRotation(this.rotation);
          onComplete?.(idx, this.rotation);
        },
      });
    }

    // ===== ScrollTrigger fallback (ScrollTimeline 사용 불가능한 브라우저용) =====
    function setupScrollTriggers(
      defs: {
        scroller: HTMLElement;
        wheelEl: HTMLElement;
        factor: number;
        track: HTMLElement;
      }[]
    ) {
      if (CSS.supports("animation-timeline: scroll()")) return;

      defs.forEach(({ scroller, wheelEl, factor, track }) =>
        ScrollTrigger.create({
          scroller,
          onUpdate: (self) => {
            const trackBounds = track.getBoundingClientRect();
            gsap.set(wheelEl, { rotateX: self.progress * factor });
            gsap.set(track, {
              y: 1 - self.progress * (trackBounds.height - LINE_HEIGHT),
            });
          },
        })
      );
    }

    const clearWheelPropsIfCSS = (wheelEl: HTMLElement, trackEl: HTMLElement) => {
      if (!CSS.supports("animation-timeline: scroll()")) return;
      gsap.set(wheelEl, { clearProps: "all" });
      gsap.set(trackEl, { clearProps: "all" });
    };

    // ===== Wheel 설정 집합 (원본 WHEELS 포트) =====
    const WHEELS: {
      key: "hours" | "minutes" | "meridiem";
      controller: HTMLElement;
      wheelEl: HTMLElement;
      track: HTMLElement;
      trigger: HTMLElement;
      proxy: HTMLElement;
      bounds?: { minRotation: number; maxRotation: number };
      triggerFactor: number;
      scrollStart?: () => void;
      scrollFrame?: (controller: HTMLElement) => void;
      scrollStop?: () => void;
      dragStart?: (this: any) => void;
      dragComplete?: (idx: number) => void;
    }[] = [
      {
        key: "hours",
        controller: controllerHours,
        wheelEl: wheelHours,
        track: trackHours,
        trigger: controllerHours.parentElement as HTMLElement,
        proxy: PROXY_HOURS,
        triggerFactor: 360,
        scrollStart: () => {
          meridiemGuard = true;
        },
        scrollFrame: (controller) => {
          const h = getScrollIndex(controllerHours);
          const m = getScrollIndex(controllerMinutes);
          syncMeridiem(h);
          updateTimeInput(h, m);
          maintainInfiniteLoop(controller);
        },
        scrollStop: () => {
          setProxyRotationFromIndex(
            PROXY_HOURS,
            getScrollIndex(controllerHours)
          );
          meridiemGuard = false;
        },
        dragStart: function () {
          meridiemGuard = true;
          (controllerHours as any).dataset.noSnap = "true";
        },
        dragComplete: (idx) => {
          const lis = controllerHours.querySelectorAll("li");
          const off = meridiemOverride ? idx - 12 : idx;
          const target = lis[mod60(off)];
          if (target instanceof HTMLElement) {
            target.scrollIntoView();
          }
          clearWheelPropsIfCSS(wheelHours, trackHours);
          delete (controllerHours as any).dataset.noSnap;
          meridiemGuard = false;
        },
      },
      {
        key: "minutes",
        controller: controllerMinutes,
        wheelEl: wheelMinutes,
        track: trackMinutes,
        trigger: controllerMinutes.parentElement as HTMLElement,
        proxy: PROXY_MINUTES,
        triggerFactor: 360,
        scrollFrame: (controller) => {
          const h = getScrollIndex(controllerHours);
          const m = getScrollIndex(controllerMinutes);
          syncMeridiem(h);
          updateTimeInput(h, m);
          maintainInfiniteLoop(controller);
        },
        scrollStop: () => {
          setProxyRotationFromIndex(
            PROXY_MINUTES,
            getScrollIndex(controllerMinutes)
          );
        },
        dragStart: function () {
          (controllerMinutes as any).dataset.noSnap = "true";
        },
        dragComplete: (idx) => {
          const lis = controllerMinutes.querySelectorAll("li");
          const target = lis[idx];
          if (target instanceof HTMLElement) {
            target.scrollIntoView();
          }
          clearWheelPropsIfCSS(wheelMinutes, trackMinutes);
          delete (controllerMinutes as any).dataset.noSnap;
        },
      },
      {
        key: "meridiem",
        controller: controllerMeridiem,
        wheelEl: wheelMeridiem,
        track: trackMeridiem,
        trigger: controllerMeridiem.parentElement as HTMLElement,
        proxy: PROXY_MERIDIEM,
        bounds: { minRotation: 0, maxRotation: -DEG_STEP },
        triggerFactor: 360 / 60,
        scrollStart: () => {
          meridiemStart = getScrollIndex(controllerMeridiem, true);
        },
        scrollFrame: () => {
          if (!passiveTrigger) {
            syncMeridiem(getScrollIndex(controllerHours));
          }
        },
        scrollStop: () => {
          const idx = getScrollIndex(controllerMeridiem, true);
          gsap.set(PROXY_MERIDIEM, { rotation: idx === 0 ? 0 : -DEG_STEP });

          if (passiveTrigger) {
            clearTimeout(programmaticClear);
            programmaticClear = setTimeout(() => (passiveTrigger = false), 500);
          } else if (idx !== meridiemStart && !meridiemGuard) {
            toggleMeridiem();
            meridiemOverride = !meridiemOverride;
            const h = getScrollIndex(controllerHours);
            const m = getScrollIndex(controllerMinutes);
            updateTimeInput(h, m);
            meridiemStart = undefined;
          }
        },
        dragStart: function () {
          meridiemStart = indexFromRotation((this as any).rotation);
          (controllerMeridiem as any).dataset.noSnap = "true";
        },
        dragComplete: (idx) => {
          const lis = controllerMeridiem.querySelectorAll("li");
          const target = lis[idx === TOTAL ? 0 : idx];
          if (target instanceof HTMLElement) {
            target.scrollIntoView();
          }
          clearWheelPropsIfCSS(wheelMeridiem, trackMeridiem);
          delete (controllerMeridiem as any).dataset.noSnap;

          if (idx !== meridiemStart) {
            toggleMeridiem();
            meridiemOverride = !meridiemOverride;
            const h = getScrollIndex(controllerHours);
            const m = getScrollIndex(controllerMinutes);
            updateTimeInput(h, m);
          }
          meridiemStart = undefined;
        },
      },
    ];

    // ===== 초기 시간 세팅 (원본과 동일하게 now + 5분) =====
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    isPMState = currentHours >= 12;
    setMeridiem(isPMState);

    controllerHours.scrollTo(
      0,
      (controllerHours.scrollHeight / 61) * currentHours
    );
    controllerMinutes.scrollTo(
      0,
      (controllerMinutes.scrollHeight / 61) * Math.min(59, currentMinutes)
    );
    controllerMeridiem.scrollTo(
      0,
      isPMState ? controllerMeridiem.scrollHeight : 0
    );

    updateTimeInput(currentHours, currentMinutes);

    // ===== scroll watcher 연결 =====
    WHEELS.forEach(({ controller, scrollStart, scrollFrame, scrollStop }) => {
      createScrollWatcher(controller, {
        onStart: scrollStart,
        onFrame: () => scrollFrame?.(controller),
        onStop: scrollStop,
      });
    });

    // ===== Draggable 연결 =====
    WHEELS.forEach(
      ({
        key,
        proxy,
        trigger,
        wheelEl,
        track,
        controller,
        bounds,
        dragStart,
        dragComplete,
      }) => {
        createWheel({
          key,
          proxyEl: proxy,
          trigger,
          wheelEl,
          controller,
          bounds,
          track,
          onStart: dragStart,
          onComplete: (idx) => dragComplete?.(idx),
        });
      }
    );

    // ===== ScrollTimeline 미지원 브라우저용 fallback =====
    setupScrollTriggers(
      WHEELS.map(({ controller, wheelEl, triggerFactor, track }) => ({
        scroller: controller,
        wheelEl,
        factor: triggerFactor,
        track,
      }))
    );
  }, []);

  return {
    meridiemRef,
    hoursRef,
    minutesRef,
  };
}