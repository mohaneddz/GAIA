import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Zap, Brain, Activity } from "lucide-react"

const detections = {
 image1: [
    { feature: "Compound fracture of tibia", confidence: 95, icon: AlertTriangle },
    { feature: "Spiral fracture of femur", confidence: 87, icon: Zap },
    { feature: "Joint effusion in knee", confidence: 82, icon: Brain }, // Structural issue
    { feature: "Stress reaction in fibula", confidence: 78, icon: Activity }, // Activity/Healing related
    { feature: "Non-union status in radius", confidence: 74, icon: Brain },
    { feature: "Avulsion fracture (ankle)", confidence: 69, icon: Zap },
    { feature: "Osteomyelitis suspected", confidence: 88, icon: AlertTriangle },
    { feature: "Subluxation of shoulder joint", confidence: 76, icon: Activity },
    { feature: "Torus/buckle fracture", confidence: 91, icon: Brain },
  ],
  image2: [
    { feature: "Compression fracture (L4)", confidence: 92, icon: AlertTriangle },
    { feature: "Pelvic stress fracture", confidence: 88, icon: Zap },
    { feature: "Scoliosis curve detected", confidence: 84, icon: Brain },
    { feature: "Rib hairline fracture (R5)", confidence: 76, icon: Zap },
    { feature: "Sacral insufficiency fracture", confidence: 79, icon: AlertTriangle },
    { feature: "Spondylolisthesis at L5-S1", confidence: 71, icon: Brain },
    { feature: "Degenerative disc disease", confidence: 83, icon: Activity },
    { feature: "Healed clavicle fracture", confidence: 77, icon: Brain },
    { feature: "Displaced fracture of C2", confidence: 89, icon: AlertTriangle },
  ],
  image3: [
    { feature: "Scaphoid non-union fracture", confidence: 98, icon: AlertTriangle },
    { feature: "Metatarsal stress fracture", confidence: 89, icon: Zap },
    { feature: "Acute carpal tunnel swelling", confidence: 81, icon: Brain },
    { feature: "Phalangeal comminuted fracture", confidence: 93, icon: AlertTriangle },
    { feature: "Tarsal coalition", confidence: 85, icon: Brain },
    { feature: "Ligament tear in thumb", confidence: 77, icon: Activity },
    { feature: "Severely displaced wrist fracture", confidence: 90, icon: AlertTriangle },
    { feature: "Osteopenia/Bone density loss", confidence: 86, icon: Activity },
    { feature: "Lisfranc injury markers", confidence: 72, icon: Zap },
  ],
}

export default function ImageTabs() {
  const [hasImage, setHasImage] = useState({
    image1: true,
    image2: true,
    image3: true,
  })

  return (
    <div className="w-full">
      <CardContent>
        <Tabs defaultValue="Original">
          <TabsList className="mb-4">
            <TabsTrigger value="Original">Original</TabsTrigger>
            <TabsTrigger value="Detection">Detection</TabsTrigger>
            <TabsTrigger value="Filtered">Filtered</TabsTrigger>
          </TabsList>
          <TabsContent value="Original">
            <div className="flex gap-4">
              {hasImage.image1 ? (
                <img
                  src="/images/bones/image1.jpg"
                  alt="Black and white bone image"
                  className="w-80 h-80 object-cover rounded-lg"
                  onError={() =>
                    setHasImage(prev => ({ ...prev, image1: false }))
                  }
                />
              ) : (
                <button className="border-2 border-dashed border-gray-800 w-80 h-80 flex items-center justify-center text-gray-500">
                  Insert Image
                </button>
              )}
              <div className="w-full">
                <h4 className="text-lg font-semibold mb-4 text-foreground">AI Detections</h4>
                <ul className="grid grid-cols-3 grid-rows-3 gap-4 w-full">
                  {detections.image1.map((det, idx) => {
                    const Icon = det.icon;
                    return (
                      <li key={idx} className="flex items-center space-x-3 p-2 bg-muted rounded-md full border">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{det.feature}</p>
                          <p className="text-xs text-muted-foreground">Confidence: {det.confidence}%</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Detection">
            <div className="flex gap-4">
              {hasImage.image2 ? (
                <img
                  src="/images/bones/image2.jpg"
                  alt="Tumour detection brain image"
                  className="w-80 h-80 object-cover rounded-lg"
                  onError={() =>
                    setHasImage(prev => ({ ...prev, image2: false }))
                  }
                />
              ) : (
                <button className="border-2 border-dashed border-gray-800 w-80 h-80 flex items-center justify-center text-gray-500">
                  Insert Image
                </button>
              )}
              <div className="w-full">
                <h4 className="text-lg font-semibold mb-4 text-foreground">AI Detections</h4>
                <ul className="grid grid-cols-3 grid-rows-3 gap-4 w-full">
                  {detections.image2.map((det, idx) => {
                    const Icon = det.icon;
                    return (
                      <li key={idx} className="flex items-center space-x-3 p-2 bg-muted rounded-md full border">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{det.feature}</p>
                          <p className="text-xs text-muted-foreground">Confidence: {det.confidence}%</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Filtered">
            <div className="flex gap-4">
              {hasImage.image3 ? (
                <img
                  src="/images/bones/image3.jpg"
                  alt="Brain activity image"
                  className="w-80 h-80 object-cover rounded-lg"
                  onError={() =>
                    setHasImage(prev => ({ ...prev, image3: false }))
                  }
                />
              ) : (
                <button className="border-2 border-dashed border-gray-800 w-80 h-80 flex items-center justify-center text-gray-500">
                  Insert Image
                </button>
              )}
              <div className="w-full">
                <h4 className="text-lg font-semibold mb-4 text-foreground">AI Detections</h4>
                <ul className="grid grid-cols-3 grid-rows-3 gap-4 w-full">
                  {detections.image3.map((det, idx) => {
                    const Icon = det.icon;
                    return (
                      <li key={idx} className="flex items-center space-x-3 p-2 bg-muted rounded-md full border">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{det.feature}</p>
                          <p className="text-xs text-muted-foreground">Confidence: {det.confidence}%</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}
