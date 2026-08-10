import axios from "axios";

export type ApiErrorKind = "authentication" | "authorization" | "network" | "server" | "unexpected";

export interface AppApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
}

export function normalizeApiError(error: unknown): AppApiError {
  if (!axios.isAxiosError(error)) {
    return { kind: "unexpected", message: "Não foi possível concluir a operação." };
  }

  if (!error.response) {
    return { kind: "network", message: "Não foi possível conectar ao servidor. Tente novamente." };
  }

  const status = error.response.status;

  if (status === 401) {
    return { kind: "authentication", message: "Sua sessão expirou. Entre novamente.", status };
  }

  if (status === 403) {
    return { kind: "authorization", message: "Você não tem permissão para realizar esta ação.", status };
  }

  return {
    kind: "server",
    message: "O servidor não conseguiu concluir a solicitação. Tente novamente.",
    status,
  };
}
