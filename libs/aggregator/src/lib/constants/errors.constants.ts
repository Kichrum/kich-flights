import { ErrorCode } from '../enums/error-code.enum';

export const ERROR_BY_CODE: { [code in ErrorCode]: Record<string, string> } = {
  [ErrorCode.AllSourcesFailed]: {
    code: ErrorCode.AllSourcesFailed,
    message: 'All sources failed',
  },
};
