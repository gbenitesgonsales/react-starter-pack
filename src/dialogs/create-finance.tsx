import { apiV1 } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Icon,
  Input,
  Label,
  Textarea
} from "package-gbg-components";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FinanceForm = {
  kind: "PAYABLE" | "RECEIVABLE";
  title: string;
  description?: string;
  amount: number;
  installments: number;
};
export function CreateFinanceDialog({ defaultValues, onSuccess }: { defaultValues?: any, onSuccess?: (data: any) => void }) {
  const [open, setOpen] = useState(false);

  const form = useForm<FinanceForm>({
    values: {
      kind: "PAYABLE",
      title: "",
      description: "",
      amount: 0,
      installments: 1,
      bankAccountId: null,
      ...defaultValues
    },
  });

  const [selectedType, setSelectedType] = useState<"PAYABLE" | "RECEIVABLE">(
    form.getValues("type")
  );

  const mutation = useMutation({
    mutationFn: async (data: FinanceForm) => {
      return await apiV1.post("/finances", data);
    },
    onSuccess: (data, variables) => {
      form.reset();
      if (onSuccess) onSuccess({ ...variables, ...data });
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
    setOpen(false);
    setSelectedType("PAYABLE");

  });

  const handleTypeChange = (type: "PAYABLE" | "RECEIVABLE") => {
    setSelectedType(type);
    form.setValue("kind", type);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" leadingVisual="plus">
          Criar finança
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon name="money" className="size-6 text-green-600" />
            <h1 className="text-lg font-semibold">Criar finança</h1>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab Selector */}
          <div className="flex bg-muted rounded-md p-1">
            {(["PAYABLE", "RECEIVABLE"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`cursor-pointer shadow-inner flex-1 px-4 py-2 rounded-md text-sm font-medium transition 
                ${selectedType === type
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground"
                  }`}
              >
                {type === "PAYABLE" ? "A Pagar" : "A Receber"}
              </button>
            ))}
          </div>

          {/* Título */}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Conta de luz"
              {...form.register("title", { required: "Título é obrigatório" })}
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Detalhes adicionais (opcional)"
              {...form.register("description")}
            />
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="amount">Valor (centavos)</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              placeholder="Ex: 120000"
              {...form.register("amount", {
                required: "Valor é obrigatório",
                valueAsNumber: true,
              })}
            />
            {form.formState.errors.amount && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          {/* Parcelas */}
          <div>
            <Label htmlFor="installments">Parcelas</Label>
            <Input
              id="installments"
              type="number"
              min={1}
              placeholder="Ex: 12"
              {...form.register("installments", {
                required: "Parcelas é obrigatório",
                valueAsNumber: true,
              })}
            />
            {form.formState.errors.installments && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.installments.message}
              </p>
            )}
          </div>

          {/* Botão */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}
