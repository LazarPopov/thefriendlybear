export default function BgLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div lang="bg" data-locale="bg">{children}</div>;
}
