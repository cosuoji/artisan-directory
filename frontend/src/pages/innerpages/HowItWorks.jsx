export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">How Abeg Fix Works</h1>

      <p className="mb-4">
        <strong>Abeg Fix</strong> connects users with skilled artisans in a few
        simple steps. Here’s how the platform works for both customers and
        service providers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">For Customers</h2>
      <ol className="list-decimal pl-6 mb-4">
        <li>Create an account or log in.</li>
        <li>Search for artisans by category, location, or rating.</li>
        <li>View artisan profiles, reviews, and previous work.</li>
        <li>
          Contact artisans through the platform to discuss scope, availability,
          and price.
        </li>
        <li>
          Hire and complete the service safely, providing feedback after
          completion.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-6 mb-3">For Artisans</h2>
      <ol className="list-decimal pl-6 mb-4">
        <li>
          Create an artisan profile detailing skills, services, and portfolio.
        </li>
        <li>Receive inquiries from interested customers.</li>
        <li>Respond promptly and agree on job details and pricing.</li>
        <li>Deliver high-quality service and complete the job as agreed.</li>
        <li>Receive ratings and feedback to improve visibility and trust.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-6 mb-3">Safety & Support</h2>
      <p className="mb-4">
        Keep all communication on the platform for safety and documentation.
        Reach out to our support team for any disputes, questions, or
        assistance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
      <p>
        Questions or assistance:{" "}
        <a
          href="mailto:support@abegfix.com"
          className="text-blue-600 underline"
        >
          support@abegfix.com
        </a>
        .
      </p>
    </div>
  );
}
