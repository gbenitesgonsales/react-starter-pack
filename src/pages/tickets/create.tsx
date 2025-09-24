
import { apiV1 } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, Label, PageLayout, Separator } from "package-gbg-components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export function CreateTicketPage() {

  const form = useForm();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiV1.post("/tickets", {
        ...data
      })
      return response.data;
    },
    onSuccess(data) {
      navigate(`/tickets`)
    },
  });

  const onSubmit = form.handleSubmit(({ ...data }) => {
    mutation.mutate({
      ...data
    });
  });

  return (
    <PageLayout>
      <PageLayout.Header>
        <h2>Importar arquivo para o dbseti</h2>
        <p className="text-muted-foreground">Import all the files, including revision history, from another version control system.</p>
        <Separator className="my-2" />
      </PageLayout.Header>
      <PageLayout.Content>

        <form onSubmit={onSubmit}>
          <div className="flex gap-4">
            <div>
              <Label>Título</Label>
              <Input  {...form.register("title")} />
            </div>
          </div>

          <div>
            <Label>Mensagem</Label>
            <Input {...form.register("message")} />
          </div>

          <div>
            <select className="h-8 bg-background border rounded-md w-full max-w-[440px] text-muted-foreground " {...form.register("type")}>
              <option value={"bug"} className="text-sm"> Correção </option>
              <option value={"feature"} className="text-sm"> Implementação </option>
              <option value={"doubt"} className="text-sm"> Dúvida </option>
            </select>
          </div>

          <div className="h-6" />

          <Button type="submit">Importar arquivo</Button>
        </form>



        {/* <Separator className="mt-10 mb-4" />

        <h1 className="text-lg">Documentos importados</h1>
        {mutation.isPending && <Spinner />}

        {documents.map((doc, index) => (
          <Link key={index} href={"/documents/" + doc.id}>
            <div className="p-4 border-b">
              <p className="text-sm text-gray-700">{doc.title}</p>
            </div>
          </Link>
        ))} */}

      </PageLayout.Content>
    </PageLayout>
  );
}