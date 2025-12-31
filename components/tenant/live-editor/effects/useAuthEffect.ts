import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseAuthEffectProps {
  user: any;
  authLoading: boolean;
}

export const useAuthEffect = ({ user, authLoading }: UseAuthEffectProps) => {
  const router = useRouter();

  // Authentication Effect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
};
