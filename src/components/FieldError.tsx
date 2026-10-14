type Props = {
  id: string;
  message?: string;
};


export function FieldError({ id, message }: Props) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="border-l-4 border-amber-600 pl-2 text-sm font-medium"
    >
      {message}
    </p>
  );
}