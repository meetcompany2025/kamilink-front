"use client";
export const fetchCache = "force-no-store";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { VehicleService } from "@/services/vehicleService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Truck } from "lucide-react";
import api from "@/services/api";

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vehicleId = id;

  const [vehicle, setVehicle] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const v = await VehicleService.getById(vehicleId);
        setVehicle(v);

        // ---- CORREÇÃO: pegar imagem via signed URL ----
      const image = v.Image?.find((i: any) => i.type === "VEHICLE_IMAGE");

      if (image) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.id}/view`;
        setImageUrl(url);
      } else {
        setImageUrl(null);
      }

      } catch (err) {
        console.error("Erro ao carregar veículo:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando dados do veículo...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-8 text-center text-red-500">
        Veículo não encontrado.
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Detalhes do Veículo</h1>

      {/* Foto do veículo */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Foto do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Vehicle"
              className="w-full h-64 object-cover rounded-xl shadow-md border"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center rounded-xl border bg-muted text-muted-foreground">
              Sem imagem disponível
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados principais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Info label="Tipo" value={vehicle.type} />
            <Info label="Marca" value={vehicle.brand} />
            <Info label="Modelo" value={vehicle.model} />
            <Info label="Placa" value={vehicle.licensePlate} />
            <Info label="Ano" value={vehicle.year} />
            <Info label="Capacidade de Carga" value={`${vehicle.loadCapacity} kg`} />
            <Info label="Dimensões" value={vehicle.dimensions || "N/A"} />
            <Info label="Reboque" value={vehicle.trailerType} />
            <Info label="Província Base" value={vehicle.baseProvince} />
          </div>

          <Separator />

          {/* <div>
            <h3 className="font-medium mb-1">Características</h3>
            {vehicle.features?.length ? (
              <ul className="list-disc ml-5 text-sm">
                {vehicle.features.map((f: string) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma característica adicionada.
              </p>
            )}
          </div> */}

          {/* <Separator /> */}
{/* 
          <div>
            <h3 className="font-medium mb-1">Descrição</h3>
            <p className="text-sm text-muted-foreground">
              {vehicle.description || "Sem descrição."}
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
