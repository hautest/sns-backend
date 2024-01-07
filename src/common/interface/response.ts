interface Error {
  message: string;
}

export const errorRes = ({ message }: Error) => ({
  success: false,
  message,
});

export const successRes = (data?: any) => ({
  success: true,
  ...data,
});
