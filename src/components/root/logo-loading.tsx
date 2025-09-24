import { Spinner } from "package-gbg-components";
import { useEffect, useState } from "react";

const SLOW_LOADING_THRESHOLD = 3000;
export function LogoLoading() {

  const [isSlow, setIsSlow] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSlow(true);
    }, SLOW_LOADING_THRESHOLD); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return <div className="w-screen h-screen flex flex-col items-center justify-center gap-2 pointer-events-none select-none">
    <h1 className="font-barlow">HELPDESK</h1>
    <Spinner />
    {isSlow && <p className="text-muted-foreground animate-pulse">Aguarde, estamos buscando sua sessão...</p>}
  </div>
}