export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Conditions générales de vente</h1>
      
      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Informations légales</h2>
          <div className="p-4 bg-gray-50 rounded">
            <p><strong>Raison sociale :</strong> SneakerShop SAS</p>
            <p><strong>Siège social :</strong> 123 Rue de la Mode, 75001 Paris, France</p>
            <p><strong>SIRET :</strong> 123 456 789 00012</p>
            <p><strong>Capital social :</strong> 50 000 €</p>
            <p><strong>Directeur de publication :</strong> Jean Dupont</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Objet</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes conditions générales de vente régissent les relations contractuelles 
            entre SneakerShop et tout client désireux d'acquérir des produits proposés sur 
            le site sneakershop.fr.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Produits et prix</h2>
          <p className="text-gray-700 leading-relaxed">
            Les produits proposés sont des chaussures de sport (sneakers) de différentes 
            marques. Les prix sont indiqués en euros TTC et sont valables tant qu'ils 
            sont visibles sur le site. SneakerShop se réserve le droit de modifier ses 
            prix à tout moment.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Les images des produits sont fournies à titre indicatif et peuvent différer 
            légèrement de la réalité.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Commandes</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour passer commande, le client doit :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Créer un compte ou se connecter</li>
            <li>Sélectionner les produits et les ajouter au panier</li>
            <li>Remplir le formulaire de commande avec ses informations</li>
            <li>Valider la commande et effectuer le paiement</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Toute commande vaut acceptation des présentes conditions générales de vente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Paiement</h2>
          <p className="text-gray-700 leading-relaxed">
            Le paiement s'effectue en ligne par carte bancaire ou PayPal. Le montant 
            de la commande est débité au moment de la validation de la commande.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            En cas de refus d'autorisation de paiement, la commande sera automatiquement 
            annulée.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Livraison</h2>
          <p className="text-gray-700 leading-relaxed">
            Les commandes sont expédiées sous 2 à 5 jours ouvrés. Les délais de livraison 
            sont indicatifs et ne constituent pas une obligation de résultat.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Les frais de port sont offerts à partir de 50€ d'achat. En dessous de ce 
            montant, les frais de port s'élèvent à 5,90€.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Droit de rétractation</h2>
          <p className="text-gray-700 leading-relaxed">
            Conformément à la législation en vigueur, le client dispose d'un délai de 
            14 jours pour retourner les produits sans avoir à justifier de motifs ni 
            à payer de pénalités.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Les produits doivent être retournés dans leur emballage d'origine, en parfait 
            état, accompagnés du bon de retour.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Garanties</h2>
          <p className="text-gray-700 leading-relaxed">
            Tous nos produits bénéficient de la garantie légale de conformité et de la 
            garantie des vices cachés, dans les conditions prévues par le Code civil.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Responsabilité</h2>
          <p className="text-gray-700 leading-relaxed">
            SneakerShop ne saurait être tenu responsable des dommages indirects résultant 
            de l'utilisation des produits vendus.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Droit applicable</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes conditions générales de vente sont soumises au droit français. 
            En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
          <div className="p-4 bg-gray-50 rounded">
            <p><strong>Service client :</strong> contact@sneakershop.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Horaires :</strong> Du lundi au vendredi, 9h-18h</p>
          </div>
        </section>
      </div>
    </div>
  )
}
