"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import dayjs from "dayjs"; // Biblioteca para manipular datas

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Token não encontrado. Faça o login.");
  }
  return token;
};

const transformData = (data: { valor: number; timestamp: string }[]) => {
  return data.map((item) => ({
    date: dayjs(item.timestamp).isValid()
      ? dayjs(item.timestamp).format("DD/MM/YYYY")
      : "Data inválida",
    value: item.valor,
  }));
};

export default function Home() {
  const [luminosidadeData, setLuminosidadeData] = useState<any[]>([]);
  const [umidadeData, setUmidadeData] = useState<any[]>([]);
  const [temperaturaData, setTemperaturaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  const fetchLuminosidadeData = async () => {
    const response = await fetch("http://localhost:8000/api/luminosidade/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });
    const data = await response.json();
    console.log("Luminosidade Data Original:", data); // Verifique os dados brutos
    const transformed = transformData(data);
    console.log("Luminosidade Data Transformada:", transformed);
    setLuminosidadeData(transformData(data));
  };

  const fetchUmidadeData = async () => {
    const response = await fetch("http://localhost:8000/api/umidade/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });
    const data = await response.json();
    setUmidadeData(transformData(data));
  };

  const fetchTemperaturaData = async () => {
    const response = await fetch("http://localhost:8000/api/temperatura/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });
    const data = await response.json();
    setTemperaturaData(transformData(data));
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchLuminosidadeData(),
      fetchUmidadeData(),
      fetchTemperaturaData(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de Temperatura */}
      <Card>
        <CardHeader>
          <CardTitle>
            Temperatura{" "}
            <span className="text-sm text-gray-500">
              ({temperaturaData.length} leituras)
            </span>
          </CardTitle>
          <CardDescription>Variação ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart
            width={1500}
            height={300}
            data={temperaturaData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </CardContent>
      </Card>

      {/* Para os outros gráficos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Umidade{" "}
            <span className="text-sm text-gray-500">
              ({umidadeData.length} leituras)
            </span>
          </CardTitle>
          <CardDescription>Variação ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart
            width={1500}
            height={300}
            data={umidadeData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8D8CE1"
              fill="#8D8CE1"
            />
          </AreaChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Luminosidade{" "}
            <span className="text-sm text-gray-500">
              ({luminosidadeData.length} leituras)
            </span>
          </CardTitle>
          <CardDescription>Variação ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart
            width={1500}
            height={300}
            data={luminosidadeData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8794A9"
              fill="#8794A9"
            />
          </AreaChart>
        </CardContent>
      </Card>
    </div>
  );
}
