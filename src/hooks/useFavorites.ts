import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useUser } from "@/context/UserContext";

type Favorite = {
  id: string;
  product_id: string;
};

export function useFavorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("id, product_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setFavorites(data);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const isFavorite = (productId: string) =>
    favorites.some((fav) => fav.product_id === productId);

  const toggleFavorite = async (productId: string) => {
    if (!user) return;

    if (isFavorite(productId)) {
      const favToRemove = favorites.find((f) => f.product_id === productId);
      if (favToRemove) {
        await supabase.from("favorites").delete().eq("id", favToRemove.id);
        setFavorites((prev) => prev.filter((f) => f.id !== favToRemove.id));
      }
    } else {
      const { data, error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_id: productId })
        .select()
        .single();

      if (!error && data) {
        setFavorites((prev) => [...prev, data]);
      }
    }
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    loading,
  };
}
