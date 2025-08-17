# **App Name**: Chilean TV Grid

## Core Features:

- Live Stream Grid: Display a 3x3 grid of embedded YouTube live streams.
- Autoplay Streams: Automatically play live streams within the grid.
- Admin Login: Secure admin login to manage channels.
- Channel Management: Admin UI to perform CRUD (Create, Read, Update, Delete) operations on channel URLs and names. Tool for model to determine update based on login status
- Admin Restriction: Restrict CRUD functionality to super administrators only.
- Admin persistence: Uses localStorage for storing superadmin state

## Style Guidelines:

- Primary color: Dark red (#800f2f), evoking the passion of Chilean television in dark mode.
- Background color: Dark gray (#212529), a dark and unobtrusive backdrop.
- Accent color: Cyan (#8ac926), complementing the primary color and adding a modern touch in dark mode.
- Font: 'Inter' sans-serif for body text and headlines, for a modern, neutral appearance suitable for dark mode.
- Simple, minimalist icons for channel controls (play, pause, etc.), designed for clarity in dark mode.
- Clean, responsive grid layout to adapt to different screen sizes, optimized for dark mode viewing.
- Subtle fade-in effects for loading streams, with optimized brightness for dark mode.