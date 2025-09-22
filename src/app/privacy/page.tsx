export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
      
      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Collecte des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous collectons les données personnelles que vous nous fournissez directement, 
            notamment lors de la création de votre compte, de vos commandes et de vos 
            interactions avec notre site. Ces données incluent :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Adresse de livraison et de facturation</li>
            <li>Informations de paiement (traitées de manière sécurisée)</li>
            <li>Historique des commandes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous utilisons vos données personnelles pour :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Traiter et livrer vos commandes</li>
            <li>Gérer votre compte client</li>
            <li>Vous contacter concernant vos commandes</li>
            <li>Améliorer nos services et votre expérience</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Cookies et technologies similaires</h2>
          <p className="text-gray-700 leading-relaxed">
            Notre site utilise des cookies pour :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Mémoriser vos préférences (panier, langue)</li>
            <li>Analyser le trafic et l'utilisation du site</li>
            <li>Personnaliser votre expérience</li>
            <li>Assurer la sécurité de votre session</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Vous pouvez gérer vos préférences de cookies via le bandeau de consentement 
            ou les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager 
            vos informations uniquement avec :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Nos prestataires de services (livraison, paiement)</li>
            <li>Les autorités compétentes si requis par la loi</li>
            <li>Nos partenaires de confiance avec votre consentement explicite</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Sécurité des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous mettons en place des mesures de sécurité appropriées pour protéger 
            vos données personnelles contre l'accès non autorisé, la modification, 
            la divulgation ou la destruction. Cela inclut :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Chiffrement des données sensibles</li>
            <li>Accès restreint aux données personnelles</li>
            <li>Surveillance régulière de nos systèmes</li>
            <li>Formation de notre personnel sur la protection des données</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
          <p className="text-gray-700 leading-relaxed">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit de limitation :</strong> limiter le traitement de vos données</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour exercer vos droits ou pour toute question concernant cette politique 
            de confidentialité, contactez-nous :
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p><strong>Email :</strong> privacy@sneakershop.fr</p>
            <p><strong>Adresse :</strong> 123 Rue de la Mode, 75001 Paris, France</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            Cette politique de confidentialité peut être mise à jour périodiquement. 
            Nous vous informerons de tout changement significatif par email ou via 
            une notification sur notre site.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </section>
      </div>
    </div>
  )
}
