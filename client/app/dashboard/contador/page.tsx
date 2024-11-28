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

const ContadorPage = () => {
  const [contador, setContador] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContador = async () => {
      const token = getToken();

      try {
        const response = await fetch("http://localhost:8000/api/contador/", {
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
        setContador(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContador();
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
            <TableHead>Valor</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contador.map((contador: any) => (
            <TableRow key={contador.id}>
              <TableCell>{contador.id || "N/A"}</TableCell>
              <TableCell>{contador.valor || "Desconhecido"}</TableCell>
              <TableCell>{contador.timestamp || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContadorPage;
