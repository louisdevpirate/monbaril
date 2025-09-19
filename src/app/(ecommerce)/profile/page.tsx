"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";
import { InfoIcon, LocationIcon, LockIcon } from "@/components/icons/icons";
import Footer from "@/components/sections/Footer";
import { useUser } from "@/context/UserContext";

interface ProfileData {
  username: string;
  email: string;
  birthdate: string;
  role: string;
  is_active: boolean;
  avatar_url: string;
  preferences: any;
  subscription_tier: string;
  total_orders: number;
  total_spent: number;
}

interface Address {
  id?: string;
  type: "delivery" | "billing";
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}

export default function ProfilePage() {
  const { user, userAvatar, setUserAvatar } = useUser();
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    birthdate: "",
    role: "user",
    is_active: true,
    avatar_url: "",
    preferences: {},
    subscription_tier: "free",
    total_orders: 0,
    total_spent: 0,
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "security"
  >("profile");
  const hasLoadedRef = useRef(false);

  // Synchroniser l'avatar du contexte avec les données du profil
  useEffect(() => {
    if (userAvatar) {
      setProfileData((prev) => ({
        ...prev,
        avatar_url: userAvatar,
      }));
    }
  }, [userAvatar]);

  useEffect(() => {
    // Réinitialiser le flag de chargement quand l'utilisateur change
    hasLoadedRef.current = false;
    
    console.log("🔄 useEffect profil déclenché, user:", user?.id);
    const getUser = async () => {
      try {
        if (user && !hasLoadedRef.current) {
          hasLoadedRef.current = true;
          console.log("📡 Chargement du profil pour user:", user.id);
          // Charger les données du profil depuis la base de données
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setProfileData({
              username: profile.username || "",
              email: user.email || "",
              birthdate: profile.birthdate || "",
              role: profile.role || "user",
              is_active: profile.is_active !== false,
              avatar_url: profile.avatar_url || "",
              preferences: profile.preferences || {},
              subscription_tier: profile.subscription_tier || "free",
              total_orders: profile.total_orders || 0,
              total_spent: profile.total_spent || 0,
            });
          } else {
            // Créer un profil par défaut dans la base de données
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: user.id,
                username: user.email?.split("@")[0] || "",
                role: "user",
                is_active: true,
                avatar_url: "1.png",
                preferences: {},
                subscription_tier: "free",
                total_orders: 0,
                total_spent: 0,
              });

            if (insertError) {
              console.error(
                "Erreur lors de la création du profil:",
                insertError
              );
            }

            // Mettre à jour l'état local
            setProfileData((prev) => ({
              ...prev,
              email: user.email || "",
              username: user.email?.split("@")[0] || "",
              role: "user",
              is_active: true,
              avatar_url: "1.png",
              preferences: {},
              subscription_tier: "free",
              total_orders: 0,
              total_spent: 0,
            }));
          }

          // Charger les adresses
          try {
            const { data: userAddresses } = await supabase
              .from("addresses")
              .select("*")
              .eq("user_id", user.id);

            if (userAddresses) {
              setAddresses(userAddresses);
            }
          } catch (addressError) {
            console.error(
              "Erreur lors du chargement des adresses:",
              addressError
            );
            // Ne pas bloquer le chargement du profil si les adresses échouent
            setAddresses([]);
          }
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement du profil:", error);
        toast.error(
          `Erreur lors du chargement: ${error.message || "Tables non configurées"}`
        );
      } finally {
        console.log("✅ Chargement du profil terminé");
        setIsLoading(false);
      }
    };

    getUser();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // Mettre à jour le profil dans la base de données (sans écraser le rôle)
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: profileData.username,
        birthdate: profileData.birthdate || null,
        is_active: profileData.is_active,
        avatar_url: profileData.avatar_url,
        preferences: profileData.preferences,
        subscription_tier: profileData.subscription_tier,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Mettre à jour l'avatar dans le contexte
      setUserAvatar(profileData.avatar_url || null);

      toast.success("Profil mis à jour avec succès !");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(
        `Erreur lors de la mise à jour du profil: ${error.message || "Table profiles non trouvée"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressSave = async (address: Address) => {
    if (!user) return;

    try {
      const addressData = {
        type: address.type,
        first_name: address.first_name,
        last_name: address.last_name,
        company: address.company || null,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || null,
        city: address.city,
        postal_code: address.postal_code,
        country: address.country || "France",
        phone: address.phone || null,
        is_default: address.is_default || false,
        user_id: user.id,
      };

      if (address.id) {
        // Mise à jour
        const { error } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", address.id);

        if (error) throw error;
      } else {
        // Création
        const { error } = await supabase.from("addresses").insert(addressData);

        if (error) throw error;
      }

      // Recharger les adresses
      const { data: userAddresses } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      if (userAddresses) {
        setAddresses(userAddresses);
      }

      toast.success("Adresse sauvegardée avec succès !");
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(
        `Erreur lors de la sauvegarde de l'adresse: ${error.message || "Table addresses non trouvée"}`
      );
    }
  };

  const handleAddressDelete = async (addressId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Recharger les adresses
      const { data: userAddresses } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      if (userAddresses) {
        setAddresses(userAddresses);
      }

      toast.success("Adresse supprimée avec succès !");
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        `Erreur lors de la suppression de l'adresse: ${error.message || "Erreur inconnue"}`
      );
    }
  };

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Mot de passe modifié avec succès !");
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast.error("Erreur lors du changement de mot de passe");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à votre profil.
          </p>
          <a
            href="/login"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-100 via-white to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-38 h-38 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={
                    userAvatar
                      ? `/images/avatar/${userAvatar}`
                      : "/images/avatar/1.png"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Mon Profil
            </h1>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Gérez vos informations personnelles, adresses et préférences
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-orange-100 text-orange-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <InfoIcon className="w-5 h-5" />
                  <span>Informations personnelles</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer ${
                    activeTab === "addresses"
                      ? "bg-orange-100 text-orange-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <LocationIcon className="w-5 h-5" />
                  <span>Adresses</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer ${
                    activeTab === "security"
                      ? "bg-orange-100 text-orange-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <LockIcon className="w-5 h-5" />
                  <span>Sécurité</span>
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {activeTab === "profile" && (
                <ProfileTab
                  profileData={profileData}
                  setProfileData={setProfileData}
                  onSave={handleProfileUpdate}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "addresses" && (
                <AddressesTab
                  addresses={addresses}
                  onSave={handleAddressSave}
                  onDelete={handleAddressDelete}
                />
              )}

              {activeTab === "security" && (
                <SecurityTab onPasswordChange={handlePasswordChange} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Composant pour l'onglet Profil
function ProfileTab({
  profileData,
  setProfileData,
  onSave,
  isSaving,
}: {
  profileData: ProfileData;
  setProfileData: (
    data: ProfileData | ((prev: ProfileData) => ProfileData)
  ) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev: ProfileData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Informations personnelles
      </h2>

      <form onSubmit={onSave} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={profileData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date de naissance
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={profileData.birthdate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={profileData.email}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">
            L'email ne peut pas être modifié
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6"></div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Avatar
          </label>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() =>
                  setProfileData((prev: ProfileData) => ({
                    ...prev,
                    avatar_url: `${num}.png`,
                  }))
                }
                className={`relative w-24 h-24 rounded-full border-2 transition-all cursor-pointer overflow-hidden ${
                  profileData.avatar_url === `${num}.png`
                    ? "border-orange-500 ring-4 ring-orange-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={`/images/avatar/${num}.png`}
                  alt={`Avatar ${num}`}
                  className="w-full h-full object-cover"
                />
                {profileData.avatar_url === `${num}.png` && (
                  <div className="absolute inset-0 bg-orange-500/5 flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 bg-opacity-30 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Commandes totales: {profileData.total_orders}
                </label>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Montant total dépensé: {profileData.total_spent}€
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg cursor-pointer hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </button>
      </form>
    </div>
  );
}

// Composant pour l'onglet Adresses
function AddressesTab({
  addresses,
  onSave,
  onDelete,
}: {
  addresses: Address[];
  onSave: (address: Address) => void;
  onDelete: (addressId: string) => void;
}) {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    type: "delivery",
    first_name: "",
    last_name: "",
    company: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    country: "France",
    phone: "",
    is_default: false,
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(addressForm);
    setEditingAddress(null);
    setAddressForm({
      type: "delivery",
      first_name: "",
      last_name: "",
      company: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postal_code: "",
      country: "France",
      phone: "",
      is_default: false,
    });
  };

  const startEditing = (address: Address) => {
    setEditingAddress(address);
    setAddressForm(address);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mes adresses</h2>
        <button
          onClick={() => setEditingAddress({} as Address)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
        >
          + Ajouter une adresse
        </button>
      </div>

      {editingAddress && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingAddress.id ? "Modifier l'adresse" : "Nouvelle adresse"}
          </h3>

          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'adresse
                </label>
                <select
                  value={addressForm.type}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      type: e.target.value as "delivery" | "billing",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="delivery">Livraison</option>
                  <option value="billing">Facturation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise (optionnel)
                </label>
                <input
                  type="text"
                  value={addressForm.company}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.first_name}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.last_name}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                required
                value={addressForm.address_line_1}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    address_line_1: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.postal_code}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      postal_code: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.country}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
                >
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAddress(null)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
              </div>
              {editingAddress.id && (
                <div>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Êtes-vous sûr de vouloir supprimer cette adresse ?"
                        )
                      ) {
                        onDelete(editingAddress.id!);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer underline"
                  >
                    Supprimer cette adresse 
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune adresse enregistrée</p>
            <p className="text-sm">
              Ajoutez votre première adresse pour faciliter vos commandes
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        address.type === "delivery"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {address.type === "delivery"
                        ? "Livraison"
                        : "Facturation"}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {address.first_name} {address.last_name}
                  </p>
                  {address.company && (
                    <p className="text-gray-600">{address.company}</p>
                  )}
                  <p className="text-gray-600">{address.address_line_1}</p>
                  <p className="text-gray-600">
                    {address.postal_code} {address.city}, {address.country}
                  </p>
                  {address.phone && (
                    <p className="text-gray-600">{address.phone}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(address)}
                    className="text-orange-500 hover:text-orange-700 text-sm font-medium cursor-pointer"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Composant pour l'onglet Sécurité
function SecurityTab({
  onPasswordChange,
}: {
  onPasswordChange: (currentPassword: string, newPassword: string) => void;
}) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsChanging(true);
    try {
      await onPasswordChange(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // L'erreur est gérée dans la fonction parent
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité</h2>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Changer le mot de passe
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe actuel *
              </label>
              <input
                type="password"
                id="currentPassword"
                required
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                id="newPassword"
                required
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmer le nouveau mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isChanging}
              className="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChanging ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </form>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Historique des commandes
          </h3>
          <p className="text-gray-600 mb-4">
            Consultez l'historique de vos commandes et téléchargez vos factures.
          </p>
          <a
            href="/orders"
            className="inline-block bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Voir mes commandes
          </a>
        </div>
      </div>
    </div>
  );
}
