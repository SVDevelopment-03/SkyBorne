export type RTKError = {
  status: number;
  data?: Record<string, unknown> & {
    message?: string;
  };
};
