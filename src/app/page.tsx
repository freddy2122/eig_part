import {
  BadgeCheck,
  Camera,
  Clapperboard,
  Crown,
  Gift,
  Gauge,
  GraduationCap,
  HandHeart,
  Headset,
  Heart,
  Infinity,
  Link2,
  Megaphone,
  Shield,
  Share2,
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { fetchCommissionRulesCatalog } from "@/lib/catalogApi";

const tierFeatures = {
  bronze: [
    "0-10 inscriptions/mois",
    "Accès au dashboard",
    "Support de communication",
    "Formation marketing",
  ],
  argent: [
    "11 - 20 inscriptions/mois",
    "Accès au dashboard",
    "Support de communication",
    "Formation marketing",
    "Invitation aux évènement d’EIG ou partenaires",
  ],
  or: [
    "+20 inscriptions/mois",
    "Accès au dashboard",
    "Support de communication",
    "Formation marketing",
    "Invitation VIP aux évènement d’EIG ou partenaires",
    "Goodies exclusifs",
  ],
};

export default async function Home() {
  const dbRules = await fetchCommissionRulesCatalog();
  const commissionByProgram = {
    superieur: getProgramTierPrices(dbRules, "superieur"),
    centre: getProgramTierPrices(dbRules, "centre"),
    college: getProgramTierPrices(dbRules, "college"),
  };

  return (
    <div className="space-y-8 md:space-y-10">
      <section id="hero" className="rounded-2xl border border-[#0b2e7a] bg-[#0b2e7a] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7dd3fc]">
          Programme Ambassadeur EIG
        </p>
        <h1 className="mt-2 max-w-3xl text-xl font-extrabold leading-tight text-white md:text-2xl">
          Rejoignez la communauté et gagnez des commissions sur chaque inscription validée.
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-200">
          Lien de parrainage unique, suivi en temps réel et paiements mensuels.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <a
            href="/partenaires/inscription"
            className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-[#0b2e7a]"
          >
            Rejoindre
          </a>
          <a
            href="/connexion"
            className="rounded-md border border-white/60 px-3.5 py-2 text-sm font-semibold text-white"
          >
            Connexion
          </a>
        </div>
      </section>

      <section id="pourquoi" className="rounded-2xl bg-white p-5 md:p-7">
        <h2 className="text-2xl font-extrabold text-[#16aee7] md:text-3xl">Pourquoi un Programme</h2>
        <h2 className="text-2xl font-extrabold text-[#0b2e7a] md:text-3xl">d&apos;Ambassadeur ?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Heart size={18} />}
            iconBg="bg-[#14aee5]"
            title="Authenticité"
            text="Les prospects font confiance aux témoignages authentiques de diplômés et d'étudiants actuels bien plus qu'aux campagnes marketing traditionnelles. Votre expérience est notre meilleur argument."
          />
          <FeatureCard
            icon={<Megaphone size={18} />}
            iconBg="bg-[#14aee5]"
            title="Portée Étendue"
            text="Chaque ambassadeur devient un multiplicateur de notre message, atteignant des réseaux que nous ne pourrions pas toucher seuls. Votre réseau devient notre réseau."
          />
          <FeatureCard
            icon={<Trophy size={18} />}
            iconBg="bg-[#14aee5]"
            title="Meilleurs Résultats"
            text="Les recommandations personnelles génèrent des taux de conversion supérieurs et des étudiants plus engagés qui correspondent mieux à la culture de l'EIG."
          />
        </div>
      </section>

      <section id="qui" className="rounded-2xl bg-white p-5 md:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-[#16aee5] md:text-3xl">Qui peut devenir</h2>
            <h2 className="text-2xl font-extrabold text-[#0b2e7a] md:text-3xl">Ambassadeur ?</h2>
            <div className="mt-6 space-y-6">
              <WhoItem
                icon={<GraduationCap size={18} />}
                iconBg="bg-[#14aee5]"
                title="Diplômés EIG Passionnés"
                text="Vous avez vécu l'expérience EIG et vous en êtes fier ? Partagez votre parcours et inspirez les futurs étudiants à rejoindre notre communauté."
              />
              <WhoItem
                icon={<Users size={18} />}
                iconBg="bg-[#d50f88]"
                title="Étudiants Actuels Enthousiastes"
                text="Vous êtes actuellement inscrit à l'EIG et vous aimez partager votre quotidien ? Devenez la voix authentique de notre école."
              />
              <WhoItem
                icon={<Share2 size={18} />}
                iconBg="bg-[#0b2e7a]"
                title="Personnes avec Réseau"
                text="Vous avez un réseau professionnel ou étudiant actif ? Mettez-le à profit pour recommander les formations EIG à ceux qui en ont besoin."
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#dff0fb] p-5">
              <h3 className="text-2xl font-bold text-[#d50f88] md:text-3xl">Qualités</h3>
              <h3 className="text-2xl font-bold text-[#d50f88] md:text-3xl">Recherchées</h3>
              <ul className="mt-4 space-y-4">
                <QualityItem icon={<Users size={16} />} iconBg="bg-[#14aee5]" text="Excellent Communicant" sub="À l'aise à l'oral et à l'écrit" />
                <QualityItem icon={<Sparkles size={16} />} iconBg="bg-[#d50f88]" text="Authentique & Passionné" sub="Vrai témoignage, pas de script" />
                <QualityItem icon={<Crown size={16} />} iconBg="bg-[#14aee5]" text="Leadership Naturel" sub="Capacité à influencer positivement" />
                <QualityItem icon={<GraduationCap size={16} />} iconBg="bg-[#d50f88]" text="Connaissance de l'EIG" sub="Bonne compréhension de nos formations" />
              </ul>
            </div>
            <div className="rounded-xl bg-[#e8ecf6] p-4">
              <p className="text-2xl font-bold text-[#0b2e7a]">Pas besoin d&apos;être un influenceur !</p>
              <p className="mt-1 text-base text-slate-800">
                Ce qui compte, c&apos;est votre authenticité et votre envie de partager votre expérience EIG.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="comment" className="rounded-2xl bg-white p-5 md:p-7">
        <h2 className="text-2xl font-extrabold text-[#16aee5] md:text-3xl">Comment Ça Marche ?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <HowCard icon={<Users size={18} />} title="Inscription Gratuite" text="Créez votre compte ambassadeur en quelques clics. L'inscription est 100% gratuite et sans engagement." footer="" bg="bg-[#dff0fb]" />
          <HowCard icon={<Link2 size={18} />} title="Recevez Votre Lien" text="Obtenez votre lien de parrainage unique et personnalisé pour suivre toutes vos recommandations." footer="Unique & Traçable" bg="bg-[#e8eaf1]" />
          <HowCard icon={<Share2 size={18} />} title="Recommandez" text="Partagez votre lien avec votre réseau : amis, famille, collègues, sur les réseaux sociaux..." footer="Illimité" bg="bg-[#f0e1ea]" />
          <HowCard icon={<Wallet size={18} />} title="Encaissez" text="Recevez vos commissions sur chaque inscription validée via votre lien. Paiements mensuels." footer="Tous les mois" bg="bg-[#f5f4df]" />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <MiniBenefit color="border-[#14aee5]" icon={<Shield size={16} className="text-[#14aee5]" />} title="100% Gratuit" sub="Aucun frais d'inscription" />
          <MiniBenefit color="border-[#d50f88]" icon={<Infinity size={16} className="text-[#d50f88]" />} title="Sans Engagement" sub="Participez à votre rythme" />
          <MiniBenefit color="border-[#e7b900]" icon={<Trophy size={16} className="text-[#e7b900]" />} title="Suivi en Temps Réel" sub="Dashboard personnel complet" />
        </div>
      </section>

      <section id="commissions" className="rounded-2xl bg-white p-5 md:p-7">
        <h2 className="text-3xl font-extrabold">
          <span className="text-[#16aee5]">Structure de Commission</span>{" "}
          <span className="text-[#0b2e7a]">Attractive</span>
        </h2>
        <p className="mt-2 text-base text-slate-800">
          Plus vous recommandez, plus vous gagnez. Évoluez dans les paliers et maximisez vos revenus.
        </p>
        <div className="mt-5 space-y-7">
          <ProgramBlock
            label="eig’ Supérieur"
            bronze={commissionByProgram.superieur.bronze}
            argent={commissionByProgram.superieur.argent}
            or={commissionByProgram.superieur.or}
          />
          <ProgramBlock
            label="eig’ Centre"
            bronze={commissionByProgram.centre.bronze}
            argent={commissionByProgram.centre.argent}
            or={commissionByProgram.centre.or}
          />
          <ProgramBlock
            label="eig’ Collège"
            bronze={commissionByProgram.college.bronze}
            argent={commissionByProgram.college.argent}
            or={commissionByProgram.college.or}
          />
        </div>
      </section>

      <section id="avantages" className="rounded-2xl bg-white p-5 md:p-7">
        <h2 className="text-3xl font-extrabold">
          <span className="text-[#16aee5]">Avantages Exclusifs des</span>{" "}
          <span className="text-[#0b2e7a]">Ambassadeurs</span>
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <AdvCard icon={<RefreshIcon />} title="Accès Prioritaire aux Événements" text="Invitations VIP aux conférences, séminaires et soirées networking de l'EIG." />
          <AdvCard icon={<GraduationCap size={16} />} title="Formations Gratuites" text="Accédez à des formations exclusives en développement personnel, marketing digital et leadership." />
          <AdvCard icon={<Users size={16} />} title="Networking Premium" text="Rejoignez une communauté d'ambassadeurs et d'alumni triés sur le volet." />
          <AdvCard icon={<BadgeCheck size={16} />} title="Certificat Officiel" text="Recevez un certificat d'ambassadeur EIG reconnu, valorisant pour votre CV." />
          <AdvCard icon={<Gift size={16} />} title="Goodies Exclusifs" text="Recevez des produits dérivés EIG exclusifs : t-shirts, mugs, sacs et autres surprises." />
          <AdvCard icon={<Camera size={16} />} title="Visibilité Officielle" text="Soyez mis en avant sur nos canaux officiels : site web, réseaux sociaux, newsletters." />
        </div>
        <div className="mt-5 border-t border-[#f1c5dc] pt-4">
          <p className="text-xl font-bold text-[#0b2e7a]">
            <span className="mr-2 text-[#d50f88]">✹</span>Un programme qui récompense votre engagement bien au-delà des commissions financières
          </p>
        </div>
      </section>

      <section id="outils" className="rounded-2xl bg-white p-5 md:p-7">
        <h2 className="text-3xl font-extrabold">
          <span className="text-[#16aee5]">Outils et support</span>{" "}
          <span className="text-[#0b2e7a]">À votre disposition</span>
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <ToolItem
              icon={<Gauge size={18} />}
              iconBg="bg-[#14aee5]"
              title="Dashboard Personnel"
              text="Un tableau de bord complet pour suivre en temps réel vos performances : nombre de clics, inscriptions en cours, commissions gagnées, historique des paiements."
            />
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-md bg-[#dff0fb] px-2 py-2 text-center">
                <p className="text-lg font-bold text-[#16aee5]">24/7</p>
                <p className="text-xs text-slate-700">Accès</p>
              </div>
              <div className="rounded-md bg-[#dff0fb] px-2 py-2 text-center">
                <p className="text-lg font-bold text-[#16aee5]">100%</p>
                <p className="text-xs text-slate-700">Gratuit</p>
              </div>
              <div className="rounded-md bg-[#dff0fb] px-2 py-2 text-center">
                <p className="text-lg font-bold text-[#16aee5]">Temps réel</p>
                <p className="text-xs text-slate-700">Données</p>
              </div>
            </div>
            <ToolItem
              icon={<GraduationCap size={18} />}
              iconBg="bg-[#14aee5]"
              title="Formation Complète"
              text="Une formation en présentielle/ligne complète sur les techniques de recommandation, le marketing de réseau, l'utilisation des réseaux sociaux et la communication persuasive."
            />
          </div>
          <div className="space-y-5">
            <ToolItem
              icon={<Megaphone size={18} />}
              iconBg="bg-[#14aee5]"
              title="Matériel Marketing"
              text="Accédez à une bibliothèque de ressources prêtes à l'emploi : images, vidéos, brochures, posts réseaux sociaux, email templates. Tout est professionnel et personnalisable."
            />
            <ToolItem
              icon={<Clapperboard size={18} />}
              iconBg="bg-[#14aee5]"
              title="Webinaires Mensuels"
              text="Sessions de formation live, partage d'expériences et Q&A avec l'équipe EIG."
            />
            <ToolItem
              icon={<Headset size={18} />}
              iconBg="bg-[#d50f88]"
              title="Support Dédié"
              text="Une équipe de support réactive à votre disposition par email et chat pour répondre à toutes vos questions et vous accompagner dans votre réussite."
            />
            <div className="inline-flex rounded-md bg-[#f0e1ea] px-3 py-2">
              <p className="text-sm font-semibold text-[#d50f88]">
                Instantané
                <span className="ml-1 font-normal text-slate-700">Forum WhatsApps</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="rejoindre" className="rounded-2xl bg-white p-5 md:p-7">
        <h2 className="text-3xl font-extrabold">
          <span className="text-[#16aee5]">Comment rejoindre</span>{" "}
          <span className="text-[#0b2e7a]">Le programme ?</span>
        </h2>
        <p className="mt-2 text-base text-slate-800">Processus simple et rapide - Commencez dès aujourd&apos;hui</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <JoinStep n="1" title="Remplissez le Formulaire" text="Inscrivez-vous en ligne en quelques minutes. Renseignez vos informations personnelles et votre parcours à l'EIG." bg="bg-[#dff0fb]" />
          <JoinStep n="3" title="Formation d'Intégration" text="Suivez notre formation en ligne complète pour maîtriser les outils et les meilleures pratiques de recommandation." bg="bg-[#e8eaf1]" />
          <JoinStep n="2" title="Passez l'Entretien" text="Un entretien rapide de 15 minutes par visioconférence pour échanger sur vos motivations et répondre à vos questions." bg="bg-[#e8eaf1]" />
          <JoinStep n="4" title="Recevez Votre Lien" text="Obtenez votre lien de parrainage personnalisé et commencez immédiatement à recommander les formations EIG." bg="bg-[#dff0fb]" />
        </div>
      </section>

      <section id="final" className="rounded-2xl bg-white p-5 md:p-7">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold">
            <span className="text-[#16aee5]">Prêt à devenir</span>{" "}
            <span className="text-[#0b2e7a]">Ambassadeur EIG ?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-slate-800">
            Rejoignez dès maintenant notre réseau d&apos;ambassadeurs et commencez à transformer vos recommandations en revenus.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <FinalCard icon={<Wallet size={20} />} title="Gagnez de l'Argent" text="Jusqu'à 20% de commission sur chaque inscription" />
            <FinalCard icon={<Users size={20} />} title="Développez Votre Réseau" text="Rencontrez des professionnels et élargissez vos horizons" />
            <FinalCard icon={<GraduationCap size={20} />} title="Formez-Vous Gratuitement" text="Accédez à des formations exclusives en marketing" />
          </div>
        </div>
      </section>
    </div>
  );
}

function formatFcfa(value?: number | null): string {
  return `${Number(value ?? 0).toLocaleString("fr-FR")} FCFA`;
}

function getProgramTierPrices(
  rules: Array<{ program_type: string; tier: "bronze" | "argent" | "or"; amount_per_enrollment?: number | null }>,
  programType: string,
): { bronze: string; argent: string; or: string } {
  const fallback: Record<string, { bronze: number; argent: number; or: number }> = {
    superieur: { bronze: 10000, argent: 15500, or: 20000 },
    centre: { bronze: 5500, argent: 10500, or: 15000 },
    college: { bronze: 3500, argent: 5500, or: 10000 },
  };
  const byTier = rules.filter((r) => r.program_type === programType);
  const bronze = byTier.find((r) => r.tier === "bronze")?.amount_per_enrollment ?? fallback[programType].bronze;
  const argent = byTier.find((r) => r.tier === "argent")?.amount_per_enrollment ?? fallback[programType].argent;
  const or = byTier.find((r) => r.tier === "or")?.amount_per_enrollment ?? fallback[programType].or;
  return { bronze: formatFcfa(bronze), argent: formatFcfa(argent), or: formatFcfa(or) };
}

function FeatureCard({
  icon,
  iconBg,
  title,
  text,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl bg-[#dff0fb] p-4">
      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white ${iconBg}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#16aee5] md:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-snug text-slate-900 md:text-base">{text}</p>
    </article>
  );
}

function WhoItem({
  icon,
  iconBg,
  title,
  text,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className={`mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#16aee5] md:text-xl">{title}</h3>
        <p className="mt-1 text-sm leading-snug text-slate-900 md:text-base">{text}</p>
      </div>
    </div>
  );
}

function QualityItem({
  icon,
  iconBg,
  text,
  sub,
}: {
  icon: ReactNode;
  iconBg: string;
  text: string;
  sub: string;
}) {
  return (
    <li className="flex gap-3">
      <div className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-white ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-[#0b2e7a] md:text-xl">{text}</p>
        <p className="text-sm text-slate-900 md:text-base">{sub}</p>
      </div>
    </li>
  );
}

function HowCard({
  icon,
  title,
  text,
  footer,
  bg,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  footer: string;
  bg: string;
}) {
  return (
    <article className={`rounded-2xl p-4 ${bg}`}>
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#14aee5] text-white">
        {icon}
      </div>
      <h3 className="mt-3 text-lg font-bold text-[#0b2e7a] md:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-snug text-slate-900 md:text-base">{text}</p>
      {footer ? <p className="mt-3 border-t border-slate-300 pt-2 text-sm font-semibold text-[#0b2e7a] md:text-base">{footer}</p> : null}
    </article>
  );
}

function MiniBenefit({
  color,
  icon,
  title,
  sub,
}: {
  color: string;
  icon: ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className={`border-l-4 ${color} bg-white px-4 py-3`}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-lg font-bold md:text-xl">{title}</p>
      </div>
      <p className="text-sm text-slate-700 md:text-base">{sub}</p>
    </div>
  );
}

function ProgramBlock({
  label,
  bronze,
  argent,
  or,
}: {
  label: string;
  bronze: string;
  argent: string;
  or: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xl font-extrabold text-[#0b2e7a] md:text-2xl">{label}</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <CommissionCard tier="BRONZE" value={bronze} bg="bg-[#dff0fb]" />
        <CommissionCard tier="ARGENT" value={argent} bg="bg-[#e6e6e8]" />
        <CommissionCard tier="OR" value={or} bg="bg-[#f4f1e8]" />
      </div>
      <div className="mt-4 border-t border-[#f1c5dc] pt-3">
        <p className="text-xl font-bold text-[#d50f88] md:text-2xl">Paiements Mensuels</p>
        <p className="text-sm text-slate-900 md:text-base">
          Tous les 30 jours, directement sur votre compte bancaire ou via PayPal/Mobile Money
        </p>
      </div>
    </div>
  );
}

function CommissionCard({
  tier,
  value,
  bg,
}: {
  tier: string;
  value: string;
  bg: string;
}) {
  const badgeClass =
    tier === "BRONZE" ? "bg-[#14aee5]" : tier === "ARGENT" ? "bg-[#9ca3af]" : "bg-[#c09b12]";
  const valueClass =
    tier === "BRONZE" ? "text-[#16aee5]" : tier === "ARGENT" ? "text-[#70737b]" : "text-[#b79000]";
  const features =
    tier === "BRONZE"
      ? tierFeatures.bronze
      : tier === "ARGENT"
        ? tierFeatures.argent
        : tierFeatures.or;
  return (
    <article className={`rounded-2xl p-4 ${bg}`}>
      <p className={`inline-flex rounded-full px-3 py-1 text-xs font-bold text-white ${badgeClass}`}>{tier}</p>
      <p className={`mt-3 text-2xl font-extrabold md:text-3xl ${valueClass}`}>{value}</p>
      <p className="text-sm text-[#0b2e7a] md:text-base">Par inscrits de commission</p>
      <ul className="mt-3 space-y-1 text-sm text-[#0b2e7a] md:text-base">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2"><span>●</span>{f}</li>
        ))}
      </ul>
    </article>
  );
}

function AdvCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl bg-[#dff0fb] p-4">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2e7a] text-white">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#0b2e7a] md:text-xl">{title}</h3>
      <p className="mt-1 text-sm leading-snug text-slate-900 md:text-base">{text}</p>
    </article>
  );
}

function RefreshIcon() {
  return <HandHeart size={16} />;
}

function ToolItem({
  icon,
  iconBg,
  title,
  text,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  text: string;
}) {
  return (
    <article className="flex gap-3">
      <div className={`mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#16aee5] md:text-xl">{title}</h3>
        <p className="mt-1 text-sm leading-snug text-slate-900 md:text-base">{text}</p>
      </div>
    </article>
  );
}

function JoinStep({
  n,
  title,
  text,
  bg,
}: {
  n: string;
  title: string;
  text: string;
  bg: string;
}) {
  return (
    <article className={`rounded-xl p-4 ${bg}`}>
      <div className="flex items-start gap-3">
        <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#14aee5] text-lg font-bold text-white">
          {n}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#16aee5] md:text-xl">{title}</h3>
          <p className="mt-1 text-sm leading-snug text-slate-900 md:text-base">{text}</p>
        </div>
      </div>
    </article>
  );
}

function FinalCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-xl bg-[#efefef] p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#16aee5]">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#16aee5] md:text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-snug text-[#0b2e7a] md:text-base">{text}</p>
    </article>
  );
}
