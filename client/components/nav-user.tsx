import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Adicionei o hook useRouter para navegação
import {
  BadgeCheck,
  Bell,
  LogOut,
  Sparkles,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CaretSortIcon } from "@radix-ui/react-icons"

interface User {
  username: string
  email: string
  avatar: string
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const Router = useRouter() 

  useEffect(() => {
    async function fetchUser() {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        setError('Token de acesso não encontrado')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/get_user/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário')
        }

        const userData = await response.json()
        setUser(userData) // Atualiza o estado com os dados do usuário
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false) // Desativa o loading ao final da requisição
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  const handleLogout = () => {
    localStorage.removeItem("acessToken")
    Router.push('/Login')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.username || "Usuário"} />
                  <AvatarFallback className="rounded-lg">{user?.username}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.username}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.username || "Usuário"} />
                  <AvatarFallback className="rounded-lg">{user?.username}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.username}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Settings />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell />
                Notificações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
