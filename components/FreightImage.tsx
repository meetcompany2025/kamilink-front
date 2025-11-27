import { FreightRequest } from "@/types/freightRequest";
import { Package } from "lucide-react";
import { useState } from "react";

export const FreightImage = ({ freight }: { freight: FreightRequest }) => {
  const hasImage = freight.Image && freight.Image.length > 0;
  const imageUrl = hasImage ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${freight.Image[0].id}/view` : null;
  const [imageError, setImageError] = useState(false);

  if (!hasImage) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          Nenhuma imagem disponível para este frete
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
        {!imageError ? (
          <img
            src={imageUrl || ''}
            alt={`Imagem do frete ${freight.Image[0].filename}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-4">
            <Package className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Erro ao carregar imagem
            </p>
          </div>
        )}
      </div>
    </div>
  );
};