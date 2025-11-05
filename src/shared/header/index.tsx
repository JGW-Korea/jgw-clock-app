import "./index.style.scss"

interface Props {
  children: React.ReactElement[]
}

export default function Header({ children }: Props) {
  return (
    <header>
      {children}
    </header>
  );
}
