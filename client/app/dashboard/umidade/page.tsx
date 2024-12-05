"use client";

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
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns"; 

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
  const [selectedSensorId, setSelectedSensorId] = useState<string>("1");
  const [newValue, setNewValue] = useState<string>(""); // Valor de umidade
  const [newTimestamp, setNewTimestamp] = useState<Date | null>(null); // Altere o tipo para Date | null

  useEffect(() => {
    const fetchSensors = async () => {
      const token = getToken();

      try {
        const response = await fetch("http://localhost:8000/api/umidade/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar sensores de umidade");
        }

        const data = await response.json();
        setSensors(data);
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
      const response = await fetch("http://localhost:8000/api/umidade/", {
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
        throw new Error("Erro ao adicionar sensor de umidade");
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>Adicionar Sensor</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar sensor de umidade</DialogTitle>
            <DialogDescription>
              Preencha as informações do seu novo sensor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor:
              </Label>
              <Input id="valor" className="col-span-3" />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start ${
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
                  selected={newTimestamp}
                  onSelect={setNewTimestamp}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button onClick={handleAddSensor}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1>Sensores de Umidade</h1>
      <div>
        <label>
          Sensor ID:
          <select
            value={selectedSensorId}
            onChange={(e) => setSelectedSensorId(e.target.value)}
          >
            <option value="1">Sensor 1</option>
            <option value="2">Sensor 2</option>
            <option value="3">Sensor 3</option>
          </select>
        </label>
        <label>
          Valor:
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Novo valor de umidade"
          />
        </label>
        <label>
          Timestamp:
          <input
            type="datetime-local"
            value={
              newTimestamp
                ? format(newTimestamp, "yyyy-MM-dd'T'HH:mm:ss")
                : ""
            }
            onChange={(e) => setNewTimestamp(new Date(e.target.value))}
            placeholder="YYYY-MM-DD HH:mm:ss"
          />
        </label>
        <button onClick={handleAddSensor}>Adicionar</button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Valor</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensors.map((umidade: any) => (
            <TableRow key={umidade.id}>
              <TableCell>{umidade.valor || "N/A"}</TableCell>
              <TableCell>{umidade.timestamp || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TemperaturaPage;
