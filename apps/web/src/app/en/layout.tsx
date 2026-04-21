export default function EnLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div lang="en" data-locale="en">{children}</div>;
}
