import torch
from torch import nn
from torchvision.models import MobileNet_V3_Small_Weights, mobilenet_v3_small


class CamClassifier(nn.Module):
    """MobileNetV3-Small features, global average pool, one linear layer.

    With a single linear layer after the pool, the class activation map
    sum_k w[c, k] * features[k] is exact (Zhou et al., CVPR 2016), so every
    prediction can come with a heatmap at no extra cost.
    """

    def __init__(self, num_classes, pretrained=True):
        super().__init__()
        weights = MobileNet_V3_Small_Weights.IMAGENET1K_V1 if pretrained else None
        self.features = mobilenet_v3_small(weights=weights).features
        channels = self.features[-1].out_channels
        self.dropout = nn.Dropout(0.2)
        self.fc = nn.Linear(channels, num_classes)

    def forward(self, x):
        pooled = self.features(x).mean(dim=(2, 3))
        return self.fc(self.dropout(pooled))


class ExportWrapper(nn.Module):
    """Inference graph with two outputs: logits and one CAM per class."""

    def __init__(self, model: CamClassifier):
        super().__init__()
        self.model = model

    def forward(self, x):
        features = self.model.features(x)
        logits = self.model.fc(features.mean(dim=(2, 3)))
        cams = torch.einsum("ck,nkhw->nchw", self.model.fc.weight, features)
        return logits, cams
