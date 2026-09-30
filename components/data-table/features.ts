import {
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table"

export const dataTableFeatures = tableFeatures({ columnVisibilityFeature })

export type DataTableFeatures = typeof dataTableFeatures

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

export const columnHelper = <TData extends RowData>() =>
  createColumnHelper<DataTableFeatures, TData>()
