export type BaseResponse<T> = {
  Success: boolean;
  Message: string;
  Object: T | null;
  Errors: string[] | null;
};

export type PaginatedResponse<T> = {
  Success: boolean;
  Message: string;
  Object: T[];
  PageNumber: number;
  PageSize: number;
  TotalSize: number;
  Errors: null;
};

export function ok<T>(message: string, object: T | null = null): BaseResponse<T> {
  return { Success: true, Message: message, Object: object, Errors: null };
}

export function fail(message: string, errors: string[], object: null = null): BaseResponse<null> {
  return { Success: false, Message: message, Object: object, Errors: errors };
}