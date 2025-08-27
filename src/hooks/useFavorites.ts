import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

type Favorite = {
  id: string;
  product_id: string;
};

export function useFavorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id, product_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("❌ Erreur récupération favoris:", error);
          toast.error("Erreur lors du chargement des favoris");
        } else if (data) {
          setFavorites(data);
        }
      } catch (error) {
        console.error("❌ Erreur inattendue:", error);
        toast.error("Erreur inattendue");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const isFavorite = (productId: string) =>
    favorites.some((fav) => fav.product_id === productId);

  const toggleFavorite = async (productId: string) => {
    // Redirection vers login si pas connecté
    if (!user) {
      toast.info("🔐 Connecte-toi pour ajouter des favoris");
      
      // Sauvegarder la page courante et rediriger vers login
      const currentPath = encodeURIComponent(pathname);
      router.push(`/login?redirect=${currentPath}`);
      return;
    }

    try {
      if (isFavorite(productId)) {
        // Supprimer des favoris
        const favToRemove = favorites.find((f) => f.product_id === productId);
        if (favToRemove) {
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("id", favToRemove.id);

          if (error) {
            console.error("❌ Erreur suppression favori:", error);
            toast.error("Erreur lors de la suppression");
          } else {
            setFavorites((prev) => prev.filter((f) => f.id !== favToRemove.id));
            toast.success("💔 Retiré des favoris");
          }
        }
      } else {
        // Ajouter aux favoris
        const { data, error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, product_id: productId })
          .select()
          .single();

        if (error) {
          console.error("❌ Erreur ajout favori:", error);
          toast.error("Erreur lors de l'ajout");
        } else if (data) {
          setFavorites((prev) => [...prev, data]);
          toast.success("❤️ Ajouté aux favoris");
        }
      }
    } catch (error) {
      console.error("❌ Erreur inattendue:", error);
      toast.error("Erreur inattendue");
    }
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    loading,
  };
}
