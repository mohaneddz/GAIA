import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeartPulse, CloudRain, Droplet, AlertTriangle } from "lucide-react"

const detections = {
  image1: [
    { feature: "Cardiomegaly detected", confidence: 95, icon: HeartPulse },
    { feature: "Pulmonary congestion", confidence: 87, icon: CloudRain },
    { feature: "Pleural effusion", confidence: 78, icon: Droplet },
    { feature: "Aortic widening", confidence: 82, icon: AlertTriangle },
    { feature: "Pericardial effusion", confidence: 74, icon: Droplet },
    { feature: "Ventricular hypertrophy", confidence: 69, icon: HeartPulse },
    { feature: "Mediastinal shift", confidence: 88, icon: AlertTriangle },
    { feature: "Pneumothorax signs", confidence: 76, icon: CloudRain },
    { feature: "Coronary calcification", confidence: 91, icon: HeartPulse },
  ],
  image2: [
    { feature: "Left atrial enlargement", confidence: 92, icon: HeartPulse },
    { feature: "Interstitial edema", confidence: 84, icon: CloudRain },
    { feature: "Rib fractures", confidence: 76, icon: AlertTriangle },
    { feature: "Hilar lymphadenopathy", confidence: 88, icon: Droplet },
    { feature: "Aortic aneurysm", confidence: 79, icon: HeartPulse },
    { feature: "Pulmonary fibrosis", confidence: 71, icon: CloudRain },
    { feature: "Cardiac tamponade", confidence: 83, icon: Droplet },
    { feature: "Myocardial infarction", confidence: 77, icon: AlertTriangle },
    { feature: "Valvular calcification", confidence: 89, icon: HeartPulse },
  ],
  image3: [
    { feature: "Right heart strain", confidence: 98, icon: HeartPulse },
    { feature: "Alveolar edema", confidence: 89, icon: CloudRain },
    { feature: "Pneumomediastinum", confidence: 81, icon: AlertTriangle },
    { feature: "Thromboembolism", confidence: 93, icon: Droplet },
    { feature: "Congenital heart defect", confidence: 85, icon: HeartPulse },
    { feature: "Bronchiectasis", confidence: 77, icon: CloudRain },
    { feature: "Pericarditis", confidence: 90, icon: Droplet },
    { feature: "Ischemic changes", confidence: 86, icon: HeartPulse },
    { feature: "Lung abscess", confidence: 72, icon: AlertTriangle },
  ],
}

export default function CardioImageTabs() {
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
            <TabsTrigger value="image1">Original</TabsTrigger>
            <TabsTrigger value="image2">Detection</TabsTrigger>
            <TabsTrigger value="image3">Filtered</TabsTrigger>
          </TabsList>
          <TabsContent value="image1">
            <div className="flex gap-4">
              {hasImage.image1 ? (
                <img
                  src="/images/heart/image1.jpg"
                  alt="Cardiology image 1"
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
                  src="/images/heart/image2.jpg"
                  alt="Cardiology image 2"
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
                  src="/images/heart/image3.jpg"
                  alt="Cardiology image 3"
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
