import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Contrast,
  Sun,
  Zap,
  EyeOff,
  Palette,
  RotateCcw,
  Droplet,
  Coffee,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function VisualEnhancement({ imageSrc }: { imageSrc: string }) {
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);

  const resetFilters = () => {
    setContrast(100);
    setBrightness(100);
    setSharpness(100);
    setBlur(0);
    setGrayscale(0);
    setHueRotate(0);
    setSaturation(100);
    setSepia(0);
    setInvert(0);
  };

  const autoEnhance = () => {
    setContrast(150);
    setBrightness(120);
    setSharpness(150);
    setBlur(0);
    setGrayscale(0);
    setHueRotate(0);
    setSaturation(120);
    setSepia(0);
    setInvert(0);
  };

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
            alt="Enhanced Cell Image"
            className="object-cover"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      <Card className="flex-1 p-4 space-y-4">
        <h3 className="font-semibold text-sm">Adjust Image Filters</h3>
        <div className="grid grid-cols-2 gap-8">
          {[
            { label: "Contrast", icon: Contrast, value: contrast, set: setContrast, min: 50, max: 200 },
            { label: "Brightness", icon: Sun, value: brightness, set: setBrightness, min: 50, max: 200 },
            { label: "Sharpness", icon: Zap, value: sharpness, set: setSharpness, min: 50, max: 200 },
            { label: "Blur", icon: EyeOff, value: blur, set: setBlur, min: 0, max: 10 },
            { label: "Grayscale", icon: Palette, value: grayscale, set: setGrayscale, min: 0, max: 100 },
            { label: "Hue Rotate", icon: RotateCcw, value: hueRotate, set: setHueRotate, min: 0, max: 360 },
            { label: "Saturation", icon: Droplet, value: saturation, set: setSaturation, min: 0, max: 200 },
            { label: "Sepia", icon: Coffee, value: sepia, set: setSepia, min: 0, max: 100 },
            { label: "Invert", icon: RotateCcw, value: invert, set: setInvert, min: 0, max: 100 },
          ].map(({ label, icon: Icon, value, set, min, max }) => (
            <div key={label} className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-2">
                <Icon className="h-4 w-4" /> {label}
              </label>
              <Slider value={[value]} onValueChange={(v) => set(v[0])} min={min} max={max} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-4">
          <Button onClick={resetFilters} variant="outline">Reset</Button>
          <Button onClick={autoEnhance}><Sparkles className="h-4 w-4 mr-2" /> AI Auto Enhance</Button>
        </div>
      </Card>
    </div>
  );
}
