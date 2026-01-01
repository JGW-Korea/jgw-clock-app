interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: Props) {
  return (
    <button
      {...props}
    />
  )
}