// import Delete from "@shared/assets/icons/delete.svg?react";

import { lazy } from "react";

interface Props {
  className: string;
  id: number | string;
  onDeleteListItem: (id: number | string) => void;
}

const DeleteSVGComponent = lazy(() => import("@shared/assets/icons/delete.svg?react"));


/**
 * SwipeToDelete List Item의 Swipe가 활성화가 된 경우 실제 Delete 영역을 나타내는 컴포넌트
*/
export default function SwipeToDeleteActions({ className, id, onDeleteListItem }: Props) {
  return (
    <div className={className}>
      <button onClick={() => onDeleteListItem(id)}>
        <DeleteSVGComponent />
      </button>
    </div>
  );
}
