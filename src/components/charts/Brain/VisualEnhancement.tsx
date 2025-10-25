import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Contrast, Sun, Zap, EyeOff, Palette, RotateCcw, Droplet, Coffee, RotateCcwIcon, Sparkles } from "lucide-react"
import { useState } from "react"

export default function VisualEnhancement({ imageSrc }: { imageSrc: string }) {
  const [contrast, setContrast] = useState(100)
  const [brightness, setBrightness] = useState(100)
  const [sharpness, setSharpness] = useState(100)
  const [blur, setBlur] = useState(0)
  const [grayscale, setGrayscale] = useState(0)
  const [hueRotate, setHueRotate] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [sepia, setSepia] = useState(0)
  const [invert, setInvert] = useState(0)

  const resetFilters = () => {
    setContrast(100)
    setBrightness(100)
    setSharpness(100)
    setBlur(0)
    setGrayscale(0)
    setHueRotate(0)
    setSaturation(100)
    setSepia(0)
    setInvert(0)
  }

  const autoEnhance = () => {
    setContrast(150)
    setBrightness(120)
    setSharpness(150)
    setBlur(0)
    setGrayscale(0)
    setHueRotate(0)
    setSaturation(120)
    setSepia(0)
    setInvert(0)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex justify-center">
        <div
          className="rounded-xl overflow-hidden border shadow-md"
          style={{
            filter: `
              contrast(${contrast}%)
              brightness(${brightness}%)
              saturate(${sharpness}%)
              blur(${blur}px)
              grayscale(${grayscale}%)
              hue-rotate(${hueRotate}deg)
              saturate(${saturation}%)
              sepia(${sepia}%)
              invert(${invert}%)
            `,
          }}
        >
          <img
            src={imageSrc}
            alt="Enhanced Brain Image"
            width={512}
            height={512}
            className="object-contain"
          />
        </div>
      </div>

      <Card className="flex-1 p-4 space-y-4">
        <h3 className="font-semibold text-sm">Adjust Image Filters</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><Contrast className="h-4 w-4" /> Contrast</label>
            <Slider value={[contrast]} onValueChange={(v) => setContrast(v[0])} min={50} max={200} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><Sun className="h-4 w-4" /> Brightness</label>
            <Slider value={[brightness]} onValueChange={(v) => setBrightness(v[0])} min={50} max={200} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><Zap className="h-4 w-4" /> Sharpness</label>
            <Slider value={[sharpness]} onValueChange={(v) => setSharpness(v[0])} min={50} max={200} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><EyeOff className="h-4 w-4" /> Blur</label>
            <Slider value={[blur]} onValueChange={(v) => setBlur(v[0])} min={0} max={10} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><Palette className="h-4 w-4" /> Grayscale</label>
            <Slider value={[grayscale]} onValueChange={(v) => setGrayscale(v[0])} min={0} max={100} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Hue Rotate</label>
            <Slider value={[hueRotate]} onValueChange={(v) => setHueRotate(v[0])} min={0} max={360} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><Droplet className="h-4 w-4" /> Saturation</label>
            <Slider value={[saturation]} onValueChange={(v) => setSaturation(v[0])} min={0} max={200} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><Coffee className="h-4 w-4" /> Sepia</label>
            <Slider value={[sepia]} onValueChange={(v) => setSepia(v[0])} min={0} max={100} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-2"><RotateCcwIcon className="h-4 w-4" /> Invert</label>
            <Slider value={[invert]} onValueChange={(v) => setInvert(v[0])} min={0} max={100} />
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <Button onClick={resetFilters} variant="outline">Reset</Button>
          <Button onClick={autoEnhance}><Sparkles className="h-4 w-4 mr-2" /> AI Auto Enhance</Button>
        </div>
      </Card>
    </div>
  )
}
