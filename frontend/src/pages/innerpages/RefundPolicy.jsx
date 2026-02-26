export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">
        Refund & Cancellation Policy
      </h1>

      <p className="mb-4">
        At <strong>Abeg Fix</strong>, our platform connects users with service
        professionals. We do not directly provide the services listed, and we do
        not process payments between customers and artisans. Therefore, refunds
        for services rendered must be handled directly between the customer and
        the artisan.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Platform Fees</h2>
      <p className="mb-4">
        Any fees paid to Abeg Fix for upgraded features (such as profile
        boosting, advertising, or premium listings) are{" "}
        <strong>non-refundable</strong> once activated.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">User Responsibilities</h2>
      <p className="mb-4">
        Before hiring an artisan, users are responsible for:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Reviewing artisan profiles and ratings</li>
        <li>Verifying identity and qualifications if necessary</li>
        <li>Agreeing on pricing and job scope before work begins</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Refunds from Artisans</h2>
      <p className="mb-4">
        If a dispute occurs regarding service quality or payment, refunds must
        be requested directly from the artisan. Abeg Fix may assist by sharing
        communication records but is not responsible for refund enforcement.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Subscriptions & Promotional Services
      </h2>
      <p className="mb-4">
        Payments for promotional tools or subscription features are final and
        cannot be refunded once the service period begins.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Cancellation Policy</h2>
      <p className="mb-4">
        Users may stop using the platform at any time. Cancellation of premium
        plans does not grant a refund for unused time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
      <p>
        For questions about this policy, contact
        <a
          href="mailto:support@abegfix.com"
          className="text-blue-600 underline"
        >
          {" "}
          support@abegfix.com
        </a>
        .
      </p>
    </div>
  );
}
