
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  [key: string]: any;
}

export interface ValidationField {
  field: string;
  message: string;
  type: string;
}

export interface ApiErrorDetails {
  statusCode: number;
  message: string;
  fields?: ValidationField[];
}

export class ApiError extends Error {
  status?: number;
  statusCode?: number;
  fields?: ValidationField[];

  constructor(message: string, status?: number, details?: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    if (details) {
      this.statusCode = details.statusCode;
      this.fields = details.fields;
    }
  }
}