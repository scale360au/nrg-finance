export const metadata = {
  title: 'NRG Finance — Business Assessment | Scale360',
  description: 'Pre-Zoom business assessment for NRG Finance & Advocacy. Prepared by Scale360.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#F5F5F5', fontFamily: "'Montserrat', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
