import * as DialogPrimitive from "@radix-ui/react-dialog";

export function MyCorporaDialogContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-transparent" />

      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}