"use client";

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
} from "package-gbg-components";
import { useState } from "react";
import { useForm } from "react-hook-form";

type TransferForm = {
  originBankAccountId: string;
  destinationBankAccountId: string;
  date: string; // formato ISO (yyyy-mm-dd)
  amount: number;
};

export function TransferBankAccountDialog({
  defaultValues,
  onSuccess,
}: {
  defaultValues?: Partial<TransferForm>;
  onSuccess?: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<TransferForm>({
    values: {
      originBankAccountId: "",
      destinationBankAccountId: "",
      date: new Date().toISOString().substring(0, 10), // default hoje
      amount: 0,
      ...defaultValues,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TransferForm) => {
      return await apiV1.post("/bankTransfers", data);
    },
    onSuccess: (data, variables) => {
      form.reset();
      setOpen(false);
      if (onSuccess) onSuccess({ ...variables, ...data });
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" leadingVisual="arrow-in-out">
          Nova transferência
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon name="swap-horizontal" className="size-6 text-blue-600" />
            <h1 className="text-lg font-semibold">Transferência bancária</h1>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Origem */}
          <div>
            <Label htmlFor="originBankAccountId">Conta de origem</Label>
            <Input
              id="originBankAccountId"
              placeholder="ID da conta de origem"
              {...form.register("originBankAccountId", {
                required: "Conta de origem é obrigatória",
              })}
            />
            {form.formState.errors.originBankAccountId && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.originBankAccountId.message}
              </p>
            )}
          </div>

          {/* Destino */}
          <div>
            <Label htmlFor="destinationBankAccountId">Conta de destino</Label>
            <Input
              id="destinationBankAccountId"
              placeholder="ID da conta de destino"
              {...form.register("destinationBankAccountId", {
                required: "Conta de destino é obrigatória",
              })}
            />
            {form.formState.errors.destinationBankAccountId && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.destinationBankAccountId.message}
              </p>
            )}
          </div>

          {/* Data */}
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              {...form.register("date", {
                required: "Data é obrigatória",
              })}
            />
            {form.formState.errors.date && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="amount">Valor (centavos)</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              placeholder="Ex: 100000"
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

          {/* Botão */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Transferindo..." : "Transferir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
