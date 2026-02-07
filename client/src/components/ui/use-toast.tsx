import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
  duration?: number;
}

export const useToast = () => {
  const toast = ({ title, description, variant, className, duration }: ToastProps) => {
    const message = title ? `${title}${description ? '\n' + description : ''}` : description || '';

    switch (variant) {
      case 'destructive':
        sonnerToast.error(message, {
          className,
          duration: duration || 5000,
        });
        break;
      case 'success':
        sonnerToast.success(message, {
          className,
          duration: duration || 4000,
        });
        break;
      default:
        sonnerToast(message, {
          className,
          duration: duration || 4000,
        });
    }
  };

  return { toast };
};
