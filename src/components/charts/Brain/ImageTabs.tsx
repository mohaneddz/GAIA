import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Zap, Brain, Activity } from "lucide-react"

const detections = {
  image1: [
    { feature: "Tumor detected in frontal lobe", confidence: 95, icon: AlertTriangle },
    { feature: "Abnormal swelling in parietal region", confidence: 87, icon: Brain },
    { feature: "Increased activity in motor cortex", confidence: 78, icon: Activity },
    { feature: "Ventricular enlargement", confidence: 82, icon: Brain },
    { feature: "White matter hyperintensities", confidence: 74, icon: Zap },
    { feature: "Cortical thinning in temporal lobe", confidence: 69, icon: Activity },
    { feature: "Calcification in basal ganglia", confidence: 88, icon: Brain },
    { feature: "Perfusion deficit in thalamus", confidence: 76, icon: Activity },
    { feature: "Suspected glioma in occipital lobe", confidence: 91, icon: AlertTriangle },
  ],
  image2: [
    { feature: "Lesion in temporal lobe", confidence: 92, icon: Zap },
    { feature: "Reduced blood flow in occipital area", confidence: 84, icon: Activity },
    { feature: "Asymmetry in brain hemispheres", confidence: 76, icon: Brain },
    { feature: "Atrophy in hippocampus", confidence: 88, icon: Brain },
    { feature: "Periventricular lesions", confidence: 79, icon: AlertTriangle },
    { feature: "Demyelination patterns", confidence: 71, icon: Zap },
    { feature: "Hydrocephalus signs", confidence: 83, icon: Brain },
    { feature: "Cyst in cerebellum", confidence: 77, icon: AlertTriangle },
    { feature: "Axonal injury markers", confidence: 89, icon: Activity },
  ],
  image3: [
    { feature: "Hemorrhage in cerebellum", confidence: 98, icon: AlertTriangle },
    { feature: "Edema in brainstem", confidence: 89, icon: Brain },
    { feature: "Microbleeds in subcortical regions", confidence: 81, icon: Zap },
    { feature: "Ischemic stroke indicators", confidence: 93, icon: AlertTriangle },
    { feature: "Aneurysm in anterior cerebral artery", confidence: 85, icon: Brain },
    { feature: "Gliosis in white matter", confidence: 77, icon: Activity },
    { feature: "Thrombosis in venous sinuses", confidence: 90, icon: AlertTriangle },
    { feature: "Infarct in parietal lobe", confidence: 86, icon: Brain },
    { feature: "Encephalitis patterns", confidence: 72, icon: Zap },
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
        <Tabs defaultValue="image1">
          <TabsList className="mb-4">
            <TabsTrigger value="image1">Image 1</TabsTrigger>
            <TabsTrigger value="image2">Image 2</TabsTrigger>
            <TabsTrigger value="image3">Image 3</TabsTrigger>
          </TabsList>
          <TabsContent value="image1">
            <div className="flex gap-4">
              {hasImage.image1 ? (
                <img
                  src="/images/brain/image1.png"
                  alt="Black and white brain image"
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
          <TabsContent value="image2">
            <div className="flex gap-4">
              {hasImage.image2 ? (
                <img
                  src="/images/brain/image2.png"
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
          <TabsContent value="image3">
            <div className="flex gap-4">
              {hasImage.image3 ? (
                <img
                  src="/images/brain/image3.png"
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
