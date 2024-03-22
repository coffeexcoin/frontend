import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  Table,
} from "@nextui-org/react";
import React from "react";

interface TableComponentProps {
  columns: any;
  rows: any;
  size?: "default" | "compact";
  onRowClick?: (key: string) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  rows,
  onRowClick,
  size = "default",
}) => {
  return (
    <div className="h-full overflow-scroll">
      <Table
        aria-label="Table"
        removeWrapper
        shadow="none"
        classNames={{
          th: " table-header ",
          tbody: "px-0 h-full ",
          tr: `${onRowClick ? "cursor-pointer hover:text-[#a1a1aa]" : ""} ${
            size === "compact" ? "h-[35px]" : "h-[50px]"
          } table-row `,
          td: "px-0 pr-[8px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item: any) => (
            <TableRow
              key={item.key}
              onClick={onRowClick ? () => onRowClick(item.key) : () => {}}
            >
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default TableComponent;
