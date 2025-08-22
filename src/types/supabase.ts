export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: number;
          order_id: string;
          order_number: string;
          email: string;
          status: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          order_id: string;
          order_number: string;
          email: string;
          status: string;
          user_id: string;
        };
        Update: Partial<{
          order_id: string;
          order_number: string;
          email: string;
          status: string;
          user_id: string;
        }>;
      };

      order_items: {
        Row: {
          id: number;
          order_id: string;
          product_name: string;
          quantity: number;
          price: number;
          image: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          order_id: string;
          product_name: string;
          quantity: number;
          price: number;
          image: string;
          user_id: string;
        };
        Update: Partial<{
          order_id: string;
          product_name: string;
          quantity: number;
          price: number;
          image: string;
          user_id: string;
        }>;
      };
    };
  };
};

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];