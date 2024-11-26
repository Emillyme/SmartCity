"use client";
import { Share } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import do Select

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedSensor) {
      alert("Por favor, selecione um arquivo e um sensor!");
      return;
    }
  
    const formData = new FormData();
    formData.append("sensor_type", selectedSensor);
    formData.append("csv_file", file);
    console.log("FormData enviado:", formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        // },
        body: formData,
      });
  
      if (response.ok) {
        alert("Upload realizado com sucesso!");
      } else {
        const data = await response.json();
        alert(`Erro no upload: ${data.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    }
  };
  

  return (
    <>
      <Dialog>
        <DialogTrigger className="flex items-center gap-2">
          <Share className="text-muted-foreground w-5 " />
          Upload
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>
              Selecione o tipo de sensor e o arquivo CSV para o upload.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label htmlFor="sensor_type">Selecione o tipo de sensor:</label>
            <Select onValueChange={setSelectedSensor}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Selecione o tipo de sensor" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem className="cursor-pointer" value="Temperatura">Temperatura</SelectItem>
                <SelectItem className="cursor-pointer" value="Umidade">Umidade</SelectItem>
                <SelectItem className="cursor-pointer" value="Contador">Contador</SelectItem>
                <SelectItem className="cursor-pointer" value="Luminosidade">Luminosidade</SelectItem>
              </SelectContent>
            </Select>
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

function UploadComponent() {
  return <Upload />;
}

export default UploadComponent;