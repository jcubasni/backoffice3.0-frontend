import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { useGetCompanies } from "../hooks/useCompaniesService"

export const TableCompaniesBlock = () => {
  const [globalMessage, setGlobalMessage] = useState("")
  const [search, setSearch] = useState("")
  const [messages, setMessages] = useState<{ [id: string]: string }>({})
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])

  const companies = useGetCompanies()
  const filteredCompanies = (companies.data ?? []).filter(
    (company) =>
      company.name?.toLowerCase().includes(search.toLowerCase()) ||
      company.ruc?.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleSelect = (id: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleSendAll = () => {
    selectedCompanies.forEach((id) => {
      const msg = messages[id] || globalMessage
      console.log(`Enviando mensaje a ${id}:`, msg)
    })
  }

  const handleSendSingle = (id: string) => {
    console.log(`Enviando mensaje a ${id}:`, messages[id])
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="font-medium text-sm block mb-1">
          Mensaje por falta de pago:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={globalMessage}
            onChange={(e) => setGlobalMessage(e.target.value)}
            className="sm:flex-1"
          />
          <Button variant="outline">Guardar</Button>
          <Button variant="outline">Editar</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <Input
          placeholder="Filtrar por nombre o RUC"
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-80"
        />
        <Button onClick={handleSendAll} className="w-full sm:w-auto">
          Enviar mensaje a todos
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-50">
            <tr className="border-b text-left">
              <th className="p-2">#</th>
              <th className="p-2">RUC</th>
              <th className="p-2">Empresa</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Mensaje</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="border-b">
                <td className="p-2">
                  <Checkbox
                    checked={selectedCompanies.includes(company.id)}
                    onCheckedChange={() => toggleSelect(company.id)}
                  />
                </td>
                <td className="p-2">{company.ruc}</td>
                <td className="p-2">{company.name}</td>
                <td className="p-2">{company.email}</td>
                <td className="p-2">
                  <Input
                    className="w-full"
                    value={messages[company.id] || ""}
                    onChange={(e) =>
                      setMessages((prev) => ({
                        ...prev,
                        [company.id]: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="p-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSendSingle(company.id)}
                  >
                    Enviar mensaje
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
