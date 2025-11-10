"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FreightRequestService } from "@/services/freightRequestService";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/use-toast";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Truck,
  User,
  FileText,
  CheckCircle,
  AlertTriangle,
  Map,
} from "lucide-react";

// Outros
import Link from "next/link";
import { MapView, type MapLocation } from "@/components/map/map-view";
import { geocodeAddress } from "@/lib/geo-utils";

export default function FreightDetailsClient({ id }: { id: string }) {
  const [freight, setFreight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadFreight() {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const data = await FreightRequestService.getFreightDetail(id);
        if (!data) {
          toast({
            title: "Erro",
            description: "Frete não encontrado.",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }
        setFreight(data);

        //  Geolocalização (mapa)
        setIsLoadingMap(true);
        try {
          const originAddress = `${data.originAddress}, ${data.originCity}, ${data.originState}, Angola`;
          const destAddress = `${data.destinationAddress}, ${data.destinationCity}, ${data.destinationState}, Angola`;

          const originCoords = await geocodeAddress(originAddress);
          const destCoords = await geocodeAddress(destAddress);

          const locations: MapLocation[] = [];
          if (originCoords)
            locations.push({
              ...originCoords,
              name: "Origem",
              description: originAddress,
              isOrigin: true,
            });
          if (destCoords)
            locations.push({
              ...destCoords,
              name: "Destino",
              description: destAddress,
              isDestination: true,
            });

          setMapLocations(locations);
        } catch {
          toast({
            title: "Erro no mapa",
            description: "Não foi possível carregar o mapa.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingMap(false);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadFreight();
  }, [user, id, router, toast]);

  async function handleCancelFreight() {
    try {
      await FreightRequestService.cancel(id);
      toast({ title: "Frete cancelado." });
      router.push("/services/my-freights");
    } catch {
      toast({ title: "Erro", description: "Não foi possível cancelar.", variant: "destructive" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando detalhes do frete...</p>
      </div>
    );
  }

  if (!freight) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertTriangle size={48} className="text-red-500" />
        <p>Frete não encontrado.</p>
        <Link href="/dashboard">
          <Button>
            <ArrowLeft className="mr-2" size={16} /> Voltar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/services/my-freights">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detalhes do Frete</h1>
            <p className="text-sm text-muted-foreground">ID: {freight.id}</p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="info" className="mt-6">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        {/* 📌 Aba de Informações */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck size={20} />
                <span className="font-medium">Status: </span>
                <Badge variant={freight.status === "PENDING" ? "secondary" : "default"}>
                  {freight.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span className="font-medium">Data de Solicitação: </span>
                {new Date(freight.createdAt).toLocaleDateString("pt-PT")}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={18} /> Origem
                  </h3>
                  <p>{freight.originAddress}</p>
                  <p>{freight.originCity} - {freight.originState}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={18} /> Destino
                  </h3>
                  <p>{freight.destinationAddress}</p>
                  <p>{freight.destinationCity} - {freight.destinationState}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package size={18} /> Detalhes da Carga
                </h3>
                <p><strong>Peso:</strong> {freight.weight} kg</p>
                <p><strong>Tipo:</strong> {freight.cargoType}</p>
                <p><strong>Descrição:</strong> {freight.description || "Sem descrição"}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <User size={18} /> Cliente
                </h3>
                <p><strong>Nome:</strong> {freight.client?.name}</p>
                <p><strong>Telefone:</strong> {freight.client?.phone}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 📌 Aba do Mapa */}
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Visualização no Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMap ? (
                <p>Carregando mapa...</p>
              ) : mapLocations.length > 0 ? (
                <MapView locations={mapLocations} height="400px" />
              ) : (
                <p className="text-muted-foreground">Não foi possível exibir o mapa.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 📌 Aba de Documentos */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos e Comprovativos</CardTitle>
            </CardHeader>
            <CardContent>
              {freight.documents?.length ? (
                <ul className="space-y-2">
                  {freight.documents.map((doc: any) => (
                    <li key={doc.id} className="flex items-center gap-2">
                      <FileText size={18} />
                      <a href={doc.url} target="_blank" className="text-blue-600 underline">
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum documento enviado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 🔘 Ações */}
      <div className="flex justify-end">
        {freight.status === "PENDING" && (
          <Button variant="destructive" onClick={handleCancelFreight}>
            Cancelar Frete
          </Button>
        )}
      </div>
    </div>
  );
}
