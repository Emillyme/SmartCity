"use client";

import { Share } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import do Select
import { toast } from "sonner";

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        alert("Por favor, selecione um arquivo CSV válido!");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedSensor) {
      alert("Por favor, selecione um arquivo e um tipo de sensor!");
      return;
    }

    setIsUploading(true); // Indica que o upload está em andamento

    const formData = new FormData();
    formData.append("sensor_type", selectedSensor);
    formData.append("csv_file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Inclui o token JWT para autenticação
        },
        body: formData,
      });

      if (response.ok) {
        toast("Arquivo enviado com sucesso!");
        setFile(null);
        setSelectedSensor("");
      } else {
        const data = await response.json();
        alert(`Erro no upload: ${data.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
    } finally {
      setIsUploading(false); // Conclui o upload
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
            <DialogTitle>Upload de Arquivos</DialogTitle>
            <DialogDescription>
              Selecione o tipo de sensor e o arquivo CSV para realizar o upload.
            </DialogDescription>
          </DialogHeader>

          {/* Seleção do tipo de sensor */}
          <div>
            <label htmlFor="sensor_type">Selecione o tipo de sensor:</label>
            <Select onValueChange={setSelectedSensor}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Selecione o tipo de sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Temperatura">Temperatura</SelectItem>
                <SelectItem value="Umidade">Umidade</SelectItem>
                <SelectItem value="Contador">Contador</SelectItem>
                <SelectItem value="Luminosidade">Luminosidade</SelectItem>
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
            <Button onClick={handleUpload} disabled={!file || !selectedSensor || isUploading}>
              {isUploading ? "Enviando..." : "Enviar"}
            </Button>
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
