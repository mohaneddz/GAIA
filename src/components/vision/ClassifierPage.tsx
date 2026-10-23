import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ClassifierWorkbench from "@/components/vision/ClassifierWorkbench"

type Props = {
  modelId: string
  title: string
  subtitle: string
  // What the tool is for, and where it stops being useful.
  useFor: ReactNode[]
  limits: ReactNode[]
}

export default function ClassifierPage({ modelId, title, subtitle, useFor, limits }: Props) {
  return (
    <div className="col w-full max-w-7xl gap-6 p-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </header>

      <ClassifierWorkbench modelId={modelId} />

      <div className="grid w-full gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Intended use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
              {useFor.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Known limits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700">
              {limits.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
