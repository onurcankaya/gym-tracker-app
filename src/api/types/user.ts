export type User = {
  id: string;
  name: string;
  email: string;
};

export type UpdateUserDTO = {
  name?: string;
  email?: string;
};
