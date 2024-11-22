"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";


export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSensorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSensor(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !selectedSensor) {
      alert("Por favor, selecione um arquivo e um sensor!");
      return;
    }

    const formData = new FormData();
    formData.append("sensor_type", selectedSensor);
    formData.append("csv_file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Upload realizado com sucesso!");
      } else {
        alert("Erro no upload");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="mr-4">
            <Button className="px-[30px]">Upload</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>
              Selecione o tipo de sensor e o arquivo CSV para o upload.
            </DialogDescription>
          </DialogHeader>

          {/* Seleção do tipo de sensor */}
          <div>
            <label htmlFor="sensor_type">Selecione o tipo de sensor:</label>
            <select
              id="sensor_type"
              value={selectedSensor}
              onChange={handleSensorChange}
              className="block w-full p-2 mt-2"
            >
              <option value="">Selecione...</option>
              <option value="Temperatura">Temperatura</option>
              <option value="Umidade">Umidade</option>
              <option value="Contador">Contador</option>
              <option value="Luminosidade">Luminosidade</option>
            </select>
          </div>

          {/* Seleção do arquivo CSV */}
          <div className="mt-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full p-2 mt-2"
            />
          </div>

          {/* Botão de upload */}
          <div className="mt-4 flex justify-end">
            <Button onClick={handleUpload}>Enviar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
