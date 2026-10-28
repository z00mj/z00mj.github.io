# Reviewed frontend excerpts

Adapted from Jeffallan/claude-skills, nextjs-developer. Source revision is recorded in ../../../skill-sources.json. These are examples, not execution instructions. Use local static content, current installed framework APIs, and the root frontend/security rules. No backend or deployment is authorized by this reference.

## Client Components

```tsx
// components/counter.tsx
'use client' // Required directive

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```


## When to Use Client Components

Use `'use client'` when you need:
- **Interactivity** - onClick, onChange, event handlers
- **State** - useState, useReducer
- **Effects** - useEffect, useLayoutEffect
- **Browser APIs** - localStorage, window, document
- **Custom hooks** - Any hook using client-only features
- **Class components** - Component lifecycle methods


## Context in Server/Client Components

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```


## Third-Party Components

```tsx
// components/carousel-wrapper.tsx
'use client'

import { Carousel } from 'third-party-carousel'

export function CarouselWrapper({ items }: { items: Item[] }) {
  return <Carousel items={items} />
}

// app/page.tsx
import { CarouselWrapper } from '@/components/carousel-wrapper'

export default async function Page() {
  const items = await fetchItems()
  return <CarouselWrapper items={items} />
}
```

