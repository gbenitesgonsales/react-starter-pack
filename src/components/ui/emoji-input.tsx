import { Button, cn, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, ScrollArea, ScrollBar } from "package-gbg-components";
import { useController } from "react-hook-form";
import { emojis } from '../../../public/emojis.json';

type Emoji = {
  code: string[];
  emoji: string;
  name: string;
}

function RecursiveSubgroup({ subgroups }: { subgroups: Record<string, Emoji[]> }) {
  return Object.entries(subgroups).flatMap(([key, emojis]) => emojis);
}

export function EmojiInput({ control, name }: { control?: any, name?: string }) {

  const { field: { onChange, value } } = useController({ name, control });

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button leadingVisual={!value ? "happy" : undefined} size="icon">
        {value}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="h-96 max-w-96 w-full">
      <ScrollArea className="h-full relative">
        {Object.entries(emojis).map(([group, subgroups]) => (
          <>
            <p className="p-2 sticky top-0 bg-popover z-10">{group}</p>
            <div className="flex flex-wrap gap-1">
              {RecursiveSubgroup({ subgroups }).map(({ name, emoji }) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="icon"
                  onClick={() => onChange(emoji)}
                  title={name}
                  className={cn(emoji === value && "border-blue-600 bg-blue-600/20")}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </>
        ))}
        <ScrollBar />
      </ScrollArea>
    </DropdownMenuContent>
  </DropdownMenu>
}