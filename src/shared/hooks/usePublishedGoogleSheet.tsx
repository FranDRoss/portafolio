// usePublishedGoogleSheet.ts
import * as React from "react";
import Papa from "papaparse";

export type UsePublishedSheetResult = {
  rows: Record<string, string>[];
  loading: boolean;
  error: string | null;
};

type Options = {
  delimiter?: string;
  skipEmptyLines?: boolean;
  transformHeader?: (h: string) => string;
};

/**
 * Fetch + parse a *published Google Sheet as CSV*.
 * - No schema validation here (intentionally).
 * - Returns rows as string maps so each consumer can validate.
 */
export function usePublishedGoogleSheet(
  csvUrl: string | null | undefined,
  opts: Options = {}
): UsePublishedSheetResult {
  const [rows, setRows] = React.useState<Record<string, string>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!csvUrl) {
        setRows([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(csvUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csvText = await res.text();

        const parsed = Papa.parse<Record<string, string>>(csvText, {
          header: true,
          skipEmptyLines: opts.skipEmptyLines ?? true,
          delimiter: opts.delimiter,
          transformHeader: opts.transformHeader,
        });

        if (parsed.errors?.length) {
          // Keep it short; detailed error reporting can be added later.
          throw new Error(parsed.errors[0].message || "CSV parse error");
        }

        const data = (parsed.data || []).filter(Boolean) as Record<string, string>[];

        if (!cancelled) {
          setRows(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setRows([]);
          setLoading(false);
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [csvUrl, opts.delimiter, opts.skipEmptyLines, opts.transformHeader]);

  return { rows, loading, error };
}
