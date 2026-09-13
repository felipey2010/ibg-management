"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { MemberQuery } from "../member.schema";
import { memberStatusLabels } from "../member.types";

export function MemberFilters({ query }: Readonly<{ query: MemberQuery }>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const statuses = [
    { value: "all", label: "Todos os status" },
    ...Object.entries(memberStatusLabels).map(([value, label]) => ({ value, label })),
  ];
  return (
    <form
      className="bg-card flex flex-col gap-3 rounded-xl border p-4 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        const search = String(data.get("search") ?? "").trim();
        const status = String(data.get("status") ?? "all");
        if (search) params.set("search", search);
        if (status !== "all") params.set("status", status);
        startTransition(() => router.push(`/membros?${params}`));
      }}
    >
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" aria-hidden />
        <Input
          name="search"
          defaultValue={query.search}
          placeholder="Buscar por nome, e-mail ou telefone"
          aria-label="Buscar membros"
          className="pl-9"
          maxLength={100}
        />
      </div>
      <Select name="status" defaultValue={query.status || "all"} items={statuses}>
        <SelectTrigger aria-label="Filtrar por status" className="w-full sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline" disabled={pending}>
        Filtrar
      </Button>
      {query.search || query.status ? (
        <Button type="button" variant="ghost" onClick={() => startTransition(() => router.push("/membros"))}>
          Limpar
        </Button>
      ) : null}
    </form>
  );
}
