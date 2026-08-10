import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatLongDate(date: Date): string {
  const formatted = format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
