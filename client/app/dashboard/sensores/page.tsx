"use client";

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

const SensorsPage = () => {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSensors = async () => {
      const token = getToken();

      try {
        const response = await fetch("http://localhost:8000/api/sensores/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar sensores");
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Lista de Sensores</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Responsável</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensors.map((sensor: any) => (
            <TableRow key={sensor.id}>
              <TableCell>{sensor.id || "N/A"}</TableCell>
              <TableCell>{sensor.tipo || "Desconhecido"}</TableCell>
              <TableCell>{sensor.unidade_medida || "N/A"}</TableCell>
              <TableCell>{sensor.localizacao || "N/A"}</TableCell>
              <TableCell>{sensor.latitude || "N/A"}</TableCell>
              <TableCell>{sensor.responsavel || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SensorsPage;
