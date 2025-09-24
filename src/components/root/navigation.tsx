"use client";
import { Link } from "@/adpters/link";
import { Button, Navigation } from "package-gbg-components";
export default function AppNavigation() {


  return <aside className="bg-muted w-64 relative">
    <Navigation className="top-0 p-0 sticky h-[calc(100vh)] w-64 flex flex-col min-h-0 border-r overflow-hidden" >

      <div className="flex flex-col gap-1 p-4 border-b m-0">

        <Link href={"/"}>
          <Button variant="invisible" className="w-full justify-start" leadingVisual="home">
            Início
          </Button>
        </Link>

        <Link href={"/tickets"}>
          <Button variant="invisible" className="w-full justify-start" leadingVisual="help">
            Chamados
          </Button>
        </Link>

      </div>


    </Navigation></aside>
}

