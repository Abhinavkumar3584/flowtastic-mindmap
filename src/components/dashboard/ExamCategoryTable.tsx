
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CategoryStat {
  category: string;
  count: number;
  averageNodes: number;
  averageConnections: number;
}

interface ExamCategoryTableProps {
  data: CategoryStat[];
}

export function ExamCategoryTable({ data }: ExamCategoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Category</TableHead>
            <TableHead className="text-right">Mind Maps</TableHead>
            <TableHead className="text-right">Avg. Nodes</TableHead>
            <TableHead className="text-right">Avg. Connections</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.category}>
              <TableCell className="font-medium">{item.category.split(" ")[0]}</TableCell>
              <TableCell className="text-right">{item.count}</TableCell>
              <TableCell className="text-right">{item.averageNodes}</TableCell>
              <TableCell className="text-right">{item.averageConnections}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
