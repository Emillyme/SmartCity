"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Frame,
  LifeBuoy,
  Send,
  ThermometerSun,
  Droplet,
  Sun,
  ListOrdered,
  ChartSpline,
  WalletCards,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Upload from "./upload"

const data = {
  navMain: [
    {
      title: "Temperatura",
      url: "#",
      icon: ThermometerSun,
      isActive: false,
      items: [
        {
          title: "Ver todos",
          url: "#",
        },
        {
          title: "Upload",
          url: "#",
        },
      ],
    },
    {
      title: "Umidade",
      url: "#",
      icon: Droplet,
      items: [
        {
          title: "Ver todos",
          url: "#",
        },
        {
          title: "Upload",
          url: "#",
        },
      ],
    },
    {
      title: "Luminosidade",
      url: "#",
      icon: Sun,
      items: [
        {
          title: "Ver todos",
          url: "#",
        },
        {
          title: "Upload",
          url: "#",
        },
      ],
    },
    {
      title: "Contador",
      url: "#",
      icon: ListOrdered,
      items: [
        {
          title: "Ver todos",
          url: "#",
        },
        {
          title: "Upload",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Todos os Sensores",
      url: "#",
      icon: WalletCards,
    },
    {
      name: "Gráficos",
      url: "#",
      icon: ChartSpline,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="font-bold">
                <Image
                  src="/logo.png"
                  width={140}
                  height={140}
                  alt="Picture of the author"
                />  
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
