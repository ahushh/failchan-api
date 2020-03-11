
export const getTokenFromAuthHeaders = (header: string): string | undefined => {
  if (!header) {
    return undefined;
  }
  return header.split(' ')[1];
};
