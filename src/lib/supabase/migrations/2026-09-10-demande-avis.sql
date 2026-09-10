-- Séquence de demande d'avis après livraison.
--
-- On stocke la date de livraison plutôt qu'une date d'échéance calculée : les
-- délais de relance restent ainsi modifiables dans le code sans avoir à
-- retoucher les lignes déjà écrites.
--
-- À exécuter une fois dans l'éditeur SQL Supabase.

alter table public.orders
  add column if not exists delivered_at            timestamptz,
  add column if not exists review_request_sent_at  timestamptz,
  add column if not exists review_reminder_sent_at timestamptz,
  add column if not exists review_opt_out          boolean not null default false;

comment on column public.orders.delivered_at is
  'Horodatage du passage au statut « delivered ». Point de départ de la séquence d''avis.';
comment on column public.orders.review_opt_out is
  'Le client a demandé à ne plus recevoir de sollicitation d''avis.';

-- Le balayage quotidien filtre sur ces trois colonnes : sans index il lirait
-- toute la table à chaque passage.
create index if not exists orders_relance_avis_idx
  on public.orders (delivered_at)
  where review_opt_out = false and review_reminder_sent_at is null;
