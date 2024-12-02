"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Configuração das cores e rótulos do gráfico
const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",  // Defina as cores
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
  rainfall: {
    label: "Rainfall (mm)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


const getToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Token não encontrado. Faça o login.");
  }
  return token;
};

export default function Home() {
  const [selectedData, setSelectedData] = useState("luminosidade"); // Estado para selecionar os dados (luminosidade, umidade, etc.)
  const [luminosidadeData, setLuminosidadeData] = useState<any[]>([]); // Dados de luminosidade
  const [umidadeData, setUmidadeData] = useState<any[]>([]); // Dados de umidade
  const [contadorData, setContadorData] = useState<any[]>([]); // Dados de contador
  const [loading, setLoading] = useState(true);

  const token = getToken();

  // Função para buscar dados de luminosidade
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
    setLuminosidadeData(data);
  };

  // Função para buscar dados de umidade
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
    setUmidadeData(data);
  };

  // Função para buscar dados de contador
  const fetchContadorData = async () => {
    const response = await fetch("http://localhost:8000/api/contadores/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });
    const data = await response.json();
    setContadorData(data);
  };

  // Função para buscar todos os dados
  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchLuminosidadeData(),
      fetchUmidadeData(),
      fetchContadorData(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData(); // Buscar todos os dados ao montar o componente
  }, []);

  // Função para mudar os dados conforme a seleção
  const handleDataChange = (dataType: string) => {
    setSelectedData(dataType);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Definir qual conjunto de dados será usado
  const chartData = {
    luminosidade: luminosidadeData,
    umidade: umidadeData,
    contador: contadorData,
  }[selectedData];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          Showing different types of data for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Seletor para mudar o tipo de dados */}
        <div className="mb-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedData === "luminosidade" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() => handleDataChange("luminosidade")}
          >
            Luminosity
          </button>
          <button
            className={`px-4 py-2 ml-2 rounded ${
              selectedData === "umidade" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() => handleDataChange("umidade")}
          >
            Humidity
          </button>
          <button
            className={`px-4 py-2 ml-2 rounded ${
              selectedData === "contador" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() => handleDataChange("contador")}
          >
            Counter
          </button>
        </div>

        <ChartContainer config={chartConfig[selectedData] || {}}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey={selectedData}
              type="natural"
              fill={`var(--color-${selectedData})`}
              fillOpacity={0.4}
              stroke={`var(--color-${selectedData})`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
          {/* Ícone de seta para alternar gráficos */}
          <div className="ml-auto flex items-center cursor-pointer">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
