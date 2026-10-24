import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  title: string
  subtitle: string
  children: ReactNode
  // What the tool is for, and where it stops being useful.
  useFor: ReactNode[]
  limits: ReactNode[]
}

export default function ToolPage({ title, subtitle, children, useFor, limits }: Props) {
  return (
    <div className="col w-full max-w-7xl gap-6 p-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </header>

      {children}

      <div className="grid w-full gap-6 md:grid-cols-2">
        {[
          { heading: "Intended use", items: useFor },
          { heading: "Known limits", items: limits },
        ].map(({ heading, items }) => (
          <Card key={heading}>
            <CardHeader>
              <CardTitle className="text-base">{heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
                {items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
