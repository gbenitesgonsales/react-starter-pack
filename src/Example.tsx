import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

const CASH_PER_CLICK = 1;
const UPDATE_CLICK_COST_MULTIPLIER = 1.1;
const UPDATE_TICK_COST_MULTIPLIER = 1.2;

export function Example() {
  const [cash, setCash] = useState(0);
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [tickMultiplier, setTickMultiplier] = useState(1);
  const [updateTickCost, setUpdateTickCost] = useState(100);
  const [updateClickCost, setUpdateClickCost] = useState(20);


  const tick = () => {
    setCash((cash) => cash + (CASH_PER_CLICK * tickMultiplier));
  }

  const onClick = () => {
    setCash((cash) => cash + (CASH_PER_CLICK * clickMultiplier));
  }

  const canUpgradeClickMultiplier = cash >= updateClickCost;
  const canUpgradeTickMultiplier = cash >= updateTickCost;

  const onUpgradeClickMultiplier = () => {
    if (canUpgradeClickMultiplier) {
      setCash((cash) => cash - updateClickCost);
      setClickMultiplier((multiplier) => multiplier + 1);
      setUpdateClickCost((cost) => Math.round(cost * UPDATE_CLICK_COST_MULTIPLIER));
    }
  }
  const onUpgradeTickMultiplier = () => {
    if (canUpgradeTickMultiplier) {
      setCash((cash) => cash - updateTickCost);
      setTickMultiplier((multiplier) => multiplier + 1);
      setUpdateTickCost((cost) => Math.round(cost * UPDATE_TICK_COST_MULTIPLIER));
    }
  }

  const score = ((clickMultiplier - 1) * 10) + ((tickMultiplier - 1) * 5);


  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className='h-screen w-screen flex items-center justify-center flex-col gap-4'>
      <div>

        <a href="https://github.com/gbenitesgonsales" target="_blank">
          <img src={"https://avatars.githubusercontent.com/gbenitesgonsales"} className="size-24 rounded-full" alt="Vite logo" />
        </a>

      </div>
      <p>
        This is a simple clicker game built with <br />
        Vite, React, Tailwind CSS, and Shadcn/ui.
      </p>
      <div className='flex items-center flex-col'>
        <Button onClick={onClick}>
          Cash ${cash}
        </Button>

      </div>
      <div className='flex gap-10'>
        <div className='rounded-md border p-4 flex flex-col items-center gap-2'>
          <h3 className='font-medium'>Click multiplier</h3>
          <p className='font-mono text-2xl'>x{clickMultiplier}</p>
          <Button disabled={!canUpgradeClickMultiplier} onClick={onUpgradeClickMultiplier}>Upgrade (${updateClickCost})</Button>
        </div>
        <div className='rounded-md border p-4 flex flex-col items-center  gap-2'>
          <h3 className='font-medium'>Tick multiplier</h3>
          <p className='font-mono text-2xl'>x{tickMultiplier}</p>
          <Button disabled={!canUpgradeTickMultiplier} onClick={onUpgradeTickMultiplier}>Upgrade (${updateTickCost})</Button>
        </div>
      </div>

      <p className='text-muted-foreground'>Score:</p>
      <div className='flex gap-0.5'>
        {String(score).split('').map((digit, index) => (
          <span key={index} className='border rounded-xs text-3xl font-mono text-gray-500 px-0.5'>
            {digit}
          </span>
        ))}
      </div>

    </div>
  )
}
