"use client";
import { Link } from '@/adpters/link';
import { apiV1 } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'package-gbg-components';

export function FinancesGrid({ params }: {
  params?: any
}) {

  const { data: finances, isError } = useQuery({
    queryKey: ["finances", { ...params }],
    queryFn: async () => {
      const resp = await apiV1.get("/finances", {
        params: {
          ...params
        }
      });
      return resp.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: data => data?.finances || []
  });

  if (isError)
    return <div>Error loading finances</div>

  return (
    <DataTable
      columns={[
        {
          field: 'id',
          header: 'ID',
          renderCell: (row) => <Link href={`/finances/${row.id}`} className="text-blue-600 hover:underline">{row.id}</Link>,
        },
        {
          field: 'title',
          header: 'Title',
        },
        {
          field: 'totalAmount',
          header: 'Total Amount',
          renderCell: (row) => (row.totalAmount / 100).toFixed(2),
        },
        {
          field: 'status',
          header: 'Status',
        },
        {
          field: 'kind',
          header: 'Kind',
        },
        {
          field: 'person',
          header: 'Person',
          renderCell: (row) => row.person?.name || 'N/A',
        },
        {
          field: 'issueDate',
          header: 'Issue Date',
          renderCell: (row) => new Date(row.issueDate).toLocaleDateString(),
        },
        {
          field: 'category',
          header: 'Category',
          renderCell: renderCategory,
        },
      ]}
      data={finances}
    />
  )
}

function renderCategory(row: any) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-base bg-muted rounded-md size-6 flex items-center justify-center">{row.category?.icon}</div>
      <span>{row.category?.name}</span>
    </div>
  )
}