import DocContent from "@/components/docs/DocContent";
import TableOfContents from "@/components/docs/TableOfContents";

export default function DocsPage() {
  return (
    <div className="flex">
      <DocContent />
      <TableOfContents />
    </div>
  );
}
