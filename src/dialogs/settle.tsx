import { apiV1 } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Icon,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "package-gbg-components";
import { useState } from "react";
import { useForm } from "react-hook-form";

type SettleForm = {
  amount: number;
  bankAccountId: string | null;
};

export function SettleDialog({ installmentId, defaultValues }: { installmentId: string, defaultValues?: any }) {
  const [open, setOpen] = useState(false);

  const form = useForm<SettleForm>({
    values: {
      amount: 0,
      bankAccountId: null,
      ...defaultValues
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SettleForm) => {
      const response = await apiV1.post("/finances/settle", {
        installmentId,
        amount: data.amount,
        bankAccountId: data.bankAccountId
      });
      return response.data;
    },
    onSuccess: () => {
      form.reset();
    },
  });

  // Busca de contas no backend
  const { data: accounts = [], isLoading } = useQuery<any[]>({
    queryKey: ["bankAccounts"],
    queryFn: async () => {
      const res = await apiV1.get("/bankAccounts");
      return res.data;
    },
    select: (data) => data?.bankAccounts || [],
  });

  const submit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="small" variant="outline" leadingVisual="money">
          Liquidar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon name="money" className="size-6 text-green-600" />
            <h1 className="text-lg font-semibold">Liquidar parcela</h1>
          </div>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor a liquidar</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ex: 15000"
              {...form.register("amount", {
                required: "Informe um valor",
                min: { value: 1, message: "Valor deve ser maior que zero" },
                valueAsNumber: true,
              })}
            />
            {form.formState.errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <Label>Conta Origem</Label>
            <Select
              value={form.watch("bankAccountId") || undefined}
              onValueChange={(val) => {
                form.setValue("bankAccountId", val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta de origem" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            isLoading={mutation.isPending}
            leadingVisual="check"
            type="submit"
            className="w-full"
          >
            Confirmar liquidação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
