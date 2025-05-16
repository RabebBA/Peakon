import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

const statuses = [
  "Bloquée",
  "En attente",
  "En dev",
  "Planifié pour aujourd'hui",
  "KO",
];
const testStatuses = ["A tester", "Test bloqué", "En attente de build"];

export function ProjectDashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedStatus, setSelectedStatus] = React.useState(
    "Planifié pour aujourd'hui"
  );

  return (
    <div className="p-4 grid gap-6 grid-cols-1 xl:grid-cols-2">
      {/* Tableau 1: Dev Restant */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Dev Restant</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Développeur</TableHead>
                {statuses.map((status) => (
                  <TableHead key={status}>{status}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jean Dupont</TableCell>
                {statuses.map((status, i) => (
                  <TableCell key={i}>3</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tableau 2: Type de Dev Restant */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Type de Dev Restant</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type de Demande</TableHead>
                {statuses.map((status) => (
                  <TableHead key={status}>{status}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {["Retour client", "Test interne", "Développement"].map(
                (type) => (
                  <TableRow key={type}>
                    <TableCell>{type}</TableCell>
                    {statuses.map((status, i) => (
                      <TableCell key={i}>2</TableCell>
                    ))}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Liste 1: Tâches Planifiées pour la Journée */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">
            Tâches Planifiées pour Aujourd'hui
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Date :</span>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Statut :</span>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Affectation</TableHead>
                <TableHead>Temps estimé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                onClick={() => navigate("/task/123")}
                className="cursor-pointer hover:bg-muted"
              >
                <TableCell>Fix bug #234</TableCell>
                <TableCell>
                  <Badge>Jean Dupont</Badge>
                </TableCell>
                <TableCell>02h00m</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Liste 2: Tâches en Dev Actuellement */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Tâches en Dev Actuellement</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Feature login</span>
                <Badge>Marie Curie</Badge>
                <span className="text-sm">02h15m / 04h00m</span>
              </div>
              <Progress value={56} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste 3: Ressources Disponibles */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Ressources Disponibles</h2>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>Paul Martin</span>
              <Badge>Frontend</Badge>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Tableau 3: Situation Test */}
      <Card className="col-span-full">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Situation Test</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Développeur</TableHead>
                {testStatuses.map((status) => (
                  <TableHead key={status}>{status}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Sophie Leroy</TableCell>
                {testStatuses.map((status, i) => (
                  <TableCell key={i}>1</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
