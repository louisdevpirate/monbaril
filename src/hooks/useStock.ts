import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface StockInfo {
  available: number;
  reserved: number;
  total: number;
  lowStock: boolean;
}

interface StockReservation {
  id: string;
  product_id: string;
  quantity: number;
  reservation_type: 'cart' | 'order' | 'manual';
  expires_at: string;
}

export function useStock() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (productId: string, quantity: number): Promise<StockInfo | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, stock_reserved, min_stock_threshold')
        .eq('id', productId)
        .single();

      if (error || !data) return null;

      const available = Math.max(0, (data.stock_quantity || 0) - (data.stock_reserved || 0));
      const lowStock = available <= (data.min_stock_threshold || 5);

      return {
        available,
        reserved: data.stock_reserved || 0,
        total: data.stock_quantity || 0,
        lowStock
      };
    } catch {
      return null;
    }
  };

  const reserveStock = async (productId: string, quantity: number): Promise<boolean> => {
    if (!user) {
      toast.error("Tu dois être connecté pour ajouter au panier");
      return false;
    }

    try {
      setLoading(true);

      const stockInfo = await checkAvailability(productId, quantity);
      if (!stockInfo) {
        toast.error("Impossible de vérifier le stock");
        return false;
      }

      if (stockInfo.available < quantity) {
        toast.error(`Stock insuffisant. Disponible : ${stockInfo.available}`);
        return false;
      }

      const { data, error } = await supabase.rpc('reserve_stock', {
        p_product_id: productId,
        p_user_id: user.id,
        p_quantity: quantity,
        p_reservation_type: 'cart',
        p_expires_in_hours: 24
      });

      if (error || !data) {
        toast.error("Erreur lors de la réservation du stock");
        return false;
      }

      return true;
    } catch {
      toast.error("Erreur inattendue");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const releaseStock = async (productId: string, quantity: number): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('release_stock', {
        p_product_id: productId,
        p_user_id: user.id,
        p_quantity: quantity,
        p_reservation_type: 'cart'
      });

      if (error) return false;
      return data;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const confirmOrderStock = async (productId: string, quantity: number): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('confirm_order_stock', {
        p_product_id: productId,
        p_user_id: user.id,
        p_quantity: quantity
      });

      if (error) return false;
      return data;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserReservations = async (): Promise<StockReservation[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('stock_reservations')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  };

  return {
    checkAvailability,
    reserveStock,
    releaseStock,
    confirmOrderStock,
    getUserReservations,
    loading
  };
}
