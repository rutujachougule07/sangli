import { Toaster as Sonner } from "sonner";
import logo from "@/assets/bnp-logo.png";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        success: <img src={logo} className="size-5 object-contain" />,
        error: <img src={logo} className="size-5 object-contain" />,
        info: <img src={logo} className="size-5 object-contain" />,
        warning: <img src={logo} className="size-5 object-contain" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
