"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
const getToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Token não encontrado. Faça o login.");
  }
  return token;
};

const TemperaturaPage = () => {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sensorOptions, setSensorOptions] = useState<number[]>([]); // Lista de sensores disponíveis
  const [selectedSensorId, setSelectedSensorId] = useState<string>("1");
  const [newValue, setNewValue] = useState<string>(""); // Valor de umidade
  const [newTimestamp, setNewTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      const token = getToken();

      try {
        // Obter sensores de umidade
        const umidadeResponse = await fetch(
          "http://localhost:8000/api/luminosidade/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            mode: "cors",
          }
        );

        if (!umidadeResponse.ok) {
          throw new Error("Erro ao buscar sensores de luminosidade");
        }

        const umidadeData = await umidadeResponse.json();
        setSensors(umidadeData);

        // Obter sensores gerais
        const sensoresResponse = await fetch(
          "http://localhost:8000/api/sensores/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            mode: "cors",
          }
        );

        if (!sensoresResponse.ok) {
          throw new Error("Erro ao buscar sensores");
        }

        const sensoresData = await sensoresResponse.json();
        const sensorIds = sensoresData.map((sensor: any) => sensor.id); // Mapeia os IDs dos sensores
        setSensorOptions(sensorIds);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  const handleAddSensor = async () => {
    const token = getToken();

    try {
      const response = await fetch("http://localhost:8000/api/luminosidade/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
        body: JSON.stringify({
          sensor: selectedSensorId,
          valor: newValue,
          timestamp: newTimestamp?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar sensor de luminosidade");
      } else {
        toast.success("Sensor adicionado com sucesso!");
      }

      const newSensor = await response.json();
      setSensors((prev) => [...prev, newSensor]);
      setNewValue("");
      setNewTimestamp(null);
    } catch (error) {
      console.error("Erro ao adicionar dado:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Sensores de Luminosidade</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Adicionar Sensor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Sensor de Umidade</DialogTitle>
              <DialogDescription>
                Preencha as informações do seu novo sensor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">

              {/* Seleção do Sensor */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sensor" className="text-right">
                  Sensor ID:
                </Label>
                <Select onValueChange={setSelectedSensorId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Escolha" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensorOptions.map((id) => (
                      <SelectItem key={id} value={id.toString()}>
                        Sensor {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campo de Valor */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valor" className="text-right">
                  Valor:
                </Label>
                <Input
                  id="valor"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Novo valor de umidade"
                  className="col-span-3"
                />
              </div>

              {/* Campo de Timestamp */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timestamp" className="text-right">
                  Timestamp:
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`col-span-3 w-full justify-start ${
                        !newTimestamp ? "text-muted-foreground" : ""
                      }`}
                    >
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      {newTimestamp
                        ? format(newTimestamp, "PPP")
                        : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTimestamp ? newTimestamp : undefined}
                      onSelect={setNewTimestamp as any}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddSensor}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Valor</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensors.map((luminosidade: any) => (
            <TableRow key={luminosidade.id}>
              <TableCell>{luminosidade.valor || "N/A"}</TableCell>
              <TableCell>{luminosidade.timestamp || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TemperaturaPage;
