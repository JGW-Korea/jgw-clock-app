import "./index.style.scss"

interface Props {
  title: string;
  children: React.ReactElement | React.ReactElement[];
}

export default function Header({ title, children }: Props) {
  return (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  );
}
