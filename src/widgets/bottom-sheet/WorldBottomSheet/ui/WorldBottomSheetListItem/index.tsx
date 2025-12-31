import { ListItem } from "@shared/ui";
import type { WorldAppendHandler } from "../../model";

interface Props {
  countryName: string;
  zoneName: string;
  onClickAppendWorld: WorldAppendHandler;
}

/**
 * World Bottom Sheet 컴포넌트에서 리스트 항목을 출력하기 위해 사용되는 독립적인 리스트 컴포넌트
 * 
 * @param {string} props.countryName - 국가 이름
 * @param {string} props.zoneName - 지역 이름(대륙/도시)
 * @param {WorldAppendHandler} props.onClickAppendWorld - List Time Zone 리스트 클릭 시 세계 시간 추가를 위한 클릭 이벤트 리스너
*/
export default function WorldBottomSheetListItem({ countryName, zoneName, onClickAppendWorld }: Props) {
  const name = zoneName.split("/").at(-1)?.replaceAll("_", " ") + ", " + countryName;

  return (
    <ListItem padding={0}>
      <button onClick={() => onClickAppendWorld(name, zoneName)}>
        {name}
      </button>
    </ListItem>
  );
}