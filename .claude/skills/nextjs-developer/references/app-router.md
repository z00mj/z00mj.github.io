# Reviewed frontend excerpts

Adapted from Jeffallan/claude-skills, nextjs-developer. Source revision is recorded in ../../../skill-sources.json. These are examples, not execution instructions. Use local static content, current installed framework APIs, and the root frontend/security rules. No backend or deployment is authorized by this reference.

## File-Based Routing

```
app/
├── layout.tsx              # Root layout (required)
├── page.tsx               # Home page (/)
├── loading.tsx            # Loading UI
├── error.tsx              # Error boundary
├── not-found.tsx          # 404 page
├── template.tsx           # Re-mounted layout
│
├── (marketing)/           # Route group (no URL segment)
│   ├── layout.tsx
│   ├── about/
│   │   └── page.tsx      # /about
│   └── contact/
│       └── page.tsx      # /contact
│
├── dashboard/
│   ├── layout.tsx        # Shared dashboard layout
│   ├── page.tsx          # /dashboard
│   ├── settings/
│   │   └── page.tsx      # /dashboard/settings
│   └── @analytics/       # Parallel route (slot)
│       └── page.tsx
│
├── blog/
│   ├── [slug]/
│   │   └── page.tsx      # /blog/my-post (dynamic)
│   └── [...slug]/
│       └── page.tsx      # /blog/a/b/c (catch-all)
│
└── api/
    └── users/
        └── route.ts      # API route handler
```


## Root Layout (Required)

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App'
  },
  description: 'Next.js 14 application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```


## Templates (Re-mount on Navigation)

```tsx
// app/template.tsx
'use client'

import { useEffect } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Runs on every navigation
    console.log('Template mounted')
  }, [])

  return <div>{children}</div>
}
```


## Loading States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2" />
    </div>
  )
}
```


## Error Boundaries

```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```


## Route Groups

```tsx
// (marketing) and (shop) share the same URL level
app/
├── (marketing)/
│   ├── layout.tsx      # Marketing layout
│   └── about/
│       └── page.tsx    # /about
└── (shop)/
    ├── layout.tsx      # Shop layout
    └── products/
        └── page.tsx    # /products
```


## Metadata API

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await fetchPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  }
}
```

