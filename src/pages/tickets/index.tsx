import { Link } from "@/adpters/link";
import { apiV1 } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "package-gbg-components";


export function TicketsPage() {
  return <div className="p-10 ">


    <Grid />
  </div>
}

function Grid({ params }: {
  params?: any
}) {

  const { data: { tickets = [] } = {}, isError } = useQuery({
    queryKey: ["transactions", { ...params }],
    queryFn: async () => {
      const resp = await apiV1.get("/tickets", {
        params: {
          ...params
        }
      });
      return resp.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // select: data => data ?? { transactions: [], meta: {} }
  });

  if (isError)
    return <div>Error loading finances</div>

  return (
    <div>

      <Link href="/tickets/new">
        Novo
      </Link>


      <DataTable
        columns={[
          {
            field: 'id',
            header: 'ID',
            width: '30%'
          },
          {
            field: 'title',
            header: 'title',
          },
          {
            field: 'message',
            header: 'message',
          },
          {
            field: 'type',
            header: 'type',
          },
          {
            field: 'status',
            header: 'status',
          },
          {
            id: 'assignment.id',
            header: "assignment",
            renderCell: row => row.assignment?.user?.name
          }
        ]}
        data={tickets}
      />
    </div>)
}

