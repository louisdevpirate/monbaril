import { useState, useEffect } from "react";
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

  // Vérifier la disponibilité d'un produit
  const checkAvailability = async (productId: string, quantity: number): Promise<StockInfo | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, stock_reserved, min_stock_threshold')
        .eq('slug', productId)
        .single();

      if (error) {
        console.error('❌ Erreur vérification stock:', error);
        return null;
      }

      const available = Math.max(0, (data.stock_quantity || 0) - (data.stock_reserved || 0));
      const lowStock = available <= (data.min_stock_threshold || 5);

      return {
        available,
        reserved: data.stock_reserved || 0,
        total: data.stock_quantity || 0,
        lowStock
      };
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      return null;
    }
  };

  // Réserver du stock (ajout au panier)
  const reserveStock = async (productId: string, quantity: number): Promise<boolean> => {
    if (!user) {
      toast.error("🔐 Tu dois être connecté pour réserver du stock");
      return false;
    }

    try {
      setLoading(true);

      // Vérifier d'abord la disponibilité
      const stockInfo = await checkAvailability(productId, quantity);
      if (!stockInfo) {
        toast.error("❌ Impossible de vérifier le stock");
        return false;
      }

      if (stockInfo.available < quantity) {
        toast.error(`❌ Stock insuffisant. Disponible : ${stockInfo.available}`);
        return false;
      }

      // Appeler la fonction Supabase pour réserver
      const { data, error } = await supabase.rpc('reserve_stock', {
        p_product_id: productId,
        p_user_id: user.id,
        p_quantity: quantity,
        p_reservation_type: 'cart',
        p_expires_in_hours: 24
      });

      if (error) {
        console.error('❌ Erreur réservation stock:', error);
        toast.error("❌ Erreur lors de la réservation du stock");
        return false;
      }

      if (data) {
        toast.success(`✅ Stock réservé pour ${quantity} unité(s)`);
        return true;
      } else {
        toast.error("❌ Impossible de réserver le stock");
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      toast.error("❌ Erreur inattendue");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Libérer du stock réservé (retrait du panier)
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

      if (error) {
        console.error('❌ Erreur libération stock:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Confirmer une commande (convertir réservation en vente)
  const confirmOrderStock = async (productId: string, quantity: number): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('confirm_order_stock', {
        p_product_id: productId,
        p_user_id: user.id,
        p_quantity: quantity
      });

      if (error) {
        console.error('❌ Erreur confirmation commande:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtenir les réservations actives d'un utilisateur
  const getUserReservations = async (): Promise<StockReservation[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('stock_reservations')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération réservations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
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
