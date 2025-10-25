import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Zap, Activity, Layers } from "lucide-react";

const cellDetections = {
  image1: [
    { feature: "Lymphocyte cluster detected", confidence: 95, icon: Layers },
    { feature: "Abnormal nucleus size", confidence: 88, icon: AlertTriangle },
    { feature: "High mitochondrial activity", confidence: 80, icon: Activity },
    { feature: "Cytoplasmic vacuoles", confidence: 75, icon: Zap },
    { feature: "Membrane irregularity", confidence: 70, icon: AlertTriangle },
    { feature: "Nucleoli enlargement", confidence: 68, icon: Activity },
    { feature: "Autophagy markers", confidence: 82, icon: Zap },
    { feature: "Reactive protein expression", confidence: 78, icon: Activity },
    { feature: "Potential apoptosis", confidence: 90, icon: AlertTriangle },
  ],
  image2: [
    { feature: "Fibroblast proliferation", confidence: 92, icon: Layers },
    { feature: "Increased cytoskeleton density", confidence: 85, icon: Zap },
    { feature: "Abnormal vacuolation", confidence: 77, icon: Activity },
    { feature: "Mitochondrial clustering", confidence: 89, icon: Activity },
    { feature: "Membrane blebbing", confidence: 81, icon: AlertTriangle },
    { feature: "Nuclear fragmentation", confidence: 74, icon: AlertTriangle },
    { feature: "Reactive lysosomes", confidence: 83, icon: Zap },
    { feature: "High metabolic index", confidence: 88, icon: Activity },
    { feature: "Potential necrosis", confidence: 91, icon: AlertTriangle },
  ],
  image3: [
    { feature: "Neuronal dendrite growth", confidence: 95, icon: Layers },
    { feature: "Synapse density high", confidence: 90, icon: Activity },
    { feature: "Axonal damage detected", confidence: 82, icon: AlertTriangle },
    { feature: "Glial cell activation", confidence: 87, icon: Zap },
    { feature: "Mitochondrial hyperactivity", confidence: 85, icon: Activity },
    { feature: "Cytoskeleton remodeling", confidence: 78, icon: Zap },
    { feature: "Protein aggregation", confidence: 88, icon: AlertTriangle },
    { feature: "Nuclear envelope irregularity", confidence: 80, icon: AlertTriangle },
    { feature: "Autophagic vesicles", confidence: 76, icon: Activity },
  ],
};

export default function ImageTabs({ cellType }: { cellType: string }) {
  const [hasImage, setHasImage] = useState({
    image1: true,
    image2: true,
    image3: true,
  });

  const imageKeys = ["image1", "image2", "image3"];

  return (
    <div className="w-full">
      <CardContent>
        <Tabs defaultValue="image1">
          <TabsList className="mb-4">
            <TabsTrigger value="image1">Image 1</TabsTrigger>
            <TabsTrigger value="image2">Image 2</TabsTrigger>
            <TabsTrigger value="image3">Image 3</TabsTrigger>
          </TabsList>

          {imageKeys.map((img) => (
            <TabsContent key={img} value={img}>
              <div className="flex gap-4">
                {hasImage[img as keyof typeof hasImage] ? (
                  <img
                    src={`/images/cells/${cellType.toLowerCase()}${img.slice(-1)}.jpg`}
                    alt="Cell microscopy image"
                    className="w-80 h-80 object-cover rounded-lg"
                    onError={() =>
                      setHasImage((prev) => ({ ...prev, [img]: false }))
                    }
                  />
                ) : (
                  <button className="border-2 border-dashed border-gray-800 w-80 h-80 flex items-center justify-center text-gray-500">
                    Insert Image
                  </button>
                )}

                <div className="w-full">
                  <h4 className="text-lg font-semibold mb-4 text-foreground">
                    AI Detections
                  </h4>
                  <ul className="grid grid-cols-3 grid-rows-3 gap-4 w-full">
                    {cellDetections[img as keyof typeof cellDetections].map(
                      (det, idx) => {
                        const Icon = det.icon;
                        return (
                          <li
                            key={idx}
                            className="flex items-center space-x-3 p-2 bg-muted rounded-md full border"
                          >
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {det.feature}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Confidence: {det.confidence}%
                              </p>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </div>
  );
}
