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

const TemperaturaPage = () => {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSensors = async () => {
      const token = getToken();

      try {
        const response = await fetch("http://localhost:8000/api/temperatura/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar sensores de temperatura");
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
      <h1>Sensores de Temperatura</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Valor</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensors.map((temperatura: any) => (
            <TableRow key={temperatura.id}>
              <TableCell>{temperatura.valor || "N/A"}</TableCell>
              <TableCell>{temperatura.timestamp || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TemperaturaPage;
