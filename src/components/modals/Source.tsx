import { SourceInformation } from "../../types";

export default function Source({ source }: { source: SourceInformation }) {
  return (
    <div className="mt-4 space-y-3">
      <p>{ source.description }</p>
      <a href={source.link} className="text-sm text-blue-600 underline">{source.link}</a>
    </div>
  );
}