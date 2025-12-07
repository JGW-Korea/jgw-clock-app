import { Draggable } from "gsap/Draggable";
import { DEG_STEP, LINE_HEIGHT } from "../consts";
import type { CreateDraggableParameter, DraggableParameter, RegisterDraggableParameter } from "../types";
import gsap from "gsap";
import { syncMeridiem } from "./toggleMeridiem";
import { clearScrollPropsIfCSS, getScrollIndex, indexFromRotation, setProxyRotationFromIndex } from "../utils";

/** 드래그가 발생하고 있는 시점에 수행 할 로직 */
function draggable({ controller, controllers, state, currentRotation }: DraggableParameter) {
  gsap.set(controller.wheel, { rotateX: -currentRotation }); // 실제 Track 뒤에 표시되는 Wheel의 X축 각도를 현재 기울기에 맞춰서 돌린다.

  // 드래그를 통해 변환된 Track의 스크롤 위치를 조절한다.
  const trackBounds = controller.track.getBoundingClientRect();
  switch(controller.type) {
    case "meridiem": {
      gsap.set(controller.track, {
        y: gsap.utils.mapRange(0, -DEG_STEP, 0, -(trackBounds.height - LINE_HEIGHT))(currentRotation)
      });
      break;
    }
    default: {
      const rotation = currentRotation < 0 ? 360 - Math.abs(currentRotation % 360) : currentRotation;
      gsap.set(controller.track, {
        y: (1 - (rotation % 360) / 360) * -(trackBounds.height - LINE_HEIGHT)
      });
    }
  }

  // Hours Controller가 드래그가 되는 경우에는 ScrollWatcher에서 해줬던것과 마찬가지로 AM <-> PM을 자동으로 전환해준다.
  if(controller.type === "hours") {
    const currentHoursIndex = indexFromRotation(currentRotation);
    syncMeridiem(currentHoursIndex, state, controllers[0].element);
  }
}

/**
 * 특정 Proxy 요소에 GSAP Draggable 이벤트를 등록하기 위한 보조 함수
 * 
 * @param {CreateDraggableParameter} props - GSAP Draggable.create에 필요한 프로퍼티를 구성하고 있는 객체
 * @returns {Draggable[]}
*/
function createDraggable({ proxy, controller, controllers, state, onStart, onComplete }: CreateDraggableParameter): Draggable[] {
  return Draggable.create(proxy, {
    type: "rotation", // Drag 이벤트가 발생했을 때 해당 Target 요소의 Rotation Style 속성을 조작한다.
    trigger: controller.element.parentElement ?? controller.element, // 어떤 요소에 입력이 발생했을 때 Drag라는 이벤트가 발생시킬 지에 대한 요소를 지정한다.
    inertia: true, // 관성 효과를 등록한다.
    
    // Proxy의 Rotation이 움직일 수 있는 최대 / 최소 범위를 지정한다.
    bounds:
      controller.type === "meridiem"
        ? { minRotation: 0, maxRotation: -DEG_STEP }
        : undefined,
    
    // Drag 이벤트가 발생한 시점에 수행할 로직
    onDragStart: onStart,

    // Drag 이벤트가 수행되고 있는 시점에 수행할 로직
    // -> Drag 이벤트 수행 시점에 Controller의 Wheel과 Track의 각도를 돌려야되는 이유는 드래그와 스크롤의 위치가 달라지면 안되기 때문이다.
    // -> 만약 둘의 스크롤 위치가 달라지게 되면, 두 방식으로 스크롤을 할 때마다 서로 다른 Wheel과 Track을 보여주게 되는 불일치 문제가 발생한다.
    onDrag() {
      draggable(
        {
          controller,
          controllers,
          state,
          currentRotation: this.rotation
        }
      );
    },

    // Drag가 발생했을 때 관성 효과 당시에 수행할 로직 (onDrag와 동일한 로직을 사용)
    onThrowUpdate() {
      draggable(
        {
          controller,
          controllers,
          state,
          currentRotation: this.rotation
        }
      );
    },

    snap(deg: number) {
      return Math.round(deg / DEG_STEP) * DEG_STEP;
    },

    // Drag 이벤트가 끝났을 때 수행할 로직
    onThrowComplete() {
      const index = indexFromRotation(this.rotation);
      onComplete(index);
    }
  });
}

/**
 * 각 Controller에 드래그 이벤트를 등록시키는 보조 함수
 * 
 * @param {RegisterDraggableParameter} props - 실제 GSAP Draggable 이벤트를 등록하기 위해 필요한 속성
 * * @returns {Draggable[]}
*/
export function registerDraggable(props: RegisterDraggableParameter): Draggable[] {
  return createDraggable(
    {
      ...props,
      // Drag 이벤트가 발생한 시점에 수행할 로직 
      onStart() {
        props.controller.element.dataset.noSnap = "true"; // 기존 CSS을 통해 등록된 애니메이션 동작을 멈추게 하기 위해 HTML의 변수 값(dataset)을 저장한다.

        switch(props.controller.type) {
          case "meridiem": {
            props.state.meridiemStart = getScrollIndex(props.controller.element, true);
            break;
          }
          case "hours": {
            props.state.meridiemGuard = true;
            break;
          }
        }
      },

      // Drag 이벤트가 끝났을 때 수행할 로직
      onComplete(currentIndex) {
        const liElements = props.controller.element.querySelectorAll("li");

        // 각 Controller 타입에 맞게 드래그 휠의 위치를 계산한다.
        switch(props.controller.type) {
          case "meridiem": {
            liElements[currentIndex === 60 ? 0 : currentIndex].scrollIntoView({ block: "nearest" });
            break;
          }
          case "hours": {
            const off = props.state.meridiemOverride ? currentIndex - 12 : currentIndex;
            const target = liElements[((off % 60) + 60) % 60];
            target.scrollIntoView({ block: "nearest" });
            props.state.meridiemGuard = false;
            
            syncMeridiem(currentIndex, props.state, props.controllers[0].element);
            props.state.currentHours = currentIndex;
            break;
          }
          case "minutes": {
            liElements[currentIndex].scrollIntoView({ block: "nearest" });
            props.state.currentMinutes = currentIndex;
            break;
          }
        }

        clearScrollPropsIfCSS([props.controller.wheel, props.controller.track]);
        delete props.controller.element.dataset.noSnap;
        setProxyRotationFromIndex(props.proxy, getScrollIndex(props.controller.element, props.controller.type === "meridiem"));
      }
    }
  );
}