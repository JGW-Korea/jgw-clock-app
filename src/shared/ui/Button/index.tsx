interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: Props) {
  return (
    <button
      {...props}
    />
  )
}