interface Props {
  label: string;
  zoneName: string;
  onAppendTimeList: (name: string, to: string) => void;
}

export default function WorldSheetListItemContainer({ label, zoneName, onAppendTimeList }: Props) {
  return (
    <button onClick={() => onAppendTimeList(label, zoneName)}>
      {label}
    </button>
  );
}
