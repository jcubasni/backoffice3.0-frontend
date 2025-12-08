import { useMemo, useState } from "react"
import { SyncLoader } from "react-spinners"
import { CardCompany } from "@/app/companies/components/card-company"
import { useGetCompanies } from "@/app/companies/hooks/useCompaniesService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Pagination } from "@/shared/components/ui/pagination"
import { usePagination } from "@/shared/hooks/usePagination"
import { Colors } from "@/shared/types/constans"

export const ListCompanies = () => {
  const [search, setSearch] = useState("")
  const { data: companies = [], isLoading } = useGetCompanies()

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search, companies])

  const {
    currentPage,
    totalPages,
    currentItems: currentCompanies,
    setCurrentPage,
    nextPage,
    prevPage,
  } = usePagination(filteredCompanies, 9)

  return (
    <main className="mx-auto flex min-h-screen w-full flex-col justify-center gap-4 p-2">
      <Card>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
            <AvatarFallback>JG</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-center font-bold text-3xl sm:text-left">
              John Doe
            </h1>
            <p className="text-muted-foreground">
              Senior Business Development Manager
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar empresas..."
              label="Buscar"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>
      <Card className="flex-1">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <SyncLoader color={Colors.extra} loading={isLoading} size={14} />
          </div>
        )}
        <div className="grid flex-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 xl:grid-rows-3">
          {currentCompanies?.map((company) => (
            <CardCompany key={company.id} company={company} />
          ))}

          {Array.from({ length: 9 - currentCompanies.length }).map((_, i) => (
            <div key={`empty-${i}`} className="hidden lg:invisible lg:block">
              <CardCompany />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </Card>
    </main>
  )
}
