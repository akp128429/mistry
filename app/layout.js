export const metadata = {
  title: "Mistry — Face, Palm & DOB Insight Lab",
  description: "Privacy-first visual and DOB analysis playground."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}