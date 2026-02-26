export default function FAQs() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">
        Frequently Asked Questions (FAQs)
      </h1>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        1. How do I sign up as a user?
      </h2>
      <p className="mb-4">
        Click the "Sign Up" button on the homepage and provide your name, email,
        and phone number. Verify your email to complete registration.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        2. How can I hire an artisan?
      </h2>
      <p className="mb-4">
        Search for artisans by category or location, view their profiles, and
        contact them via the platform to discuss service details.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        3. How do I create an artisan profile?
      </h2>
      <p className="mb-4">
        Sign up as an artisan and complete your profile with your skills,
        services, portfolio, and contact information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        4. Is my personal information safe?
      </h2>
      <p className="mb-4">
        Yes. We follow NDPR regulations and have a comprehensive Privacy Policy
        explaining how we collect, store, and protect your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        5. How do I make payments?
      </h2>
      <p className="mb-4">
        Payments may be handled directly with the artisan or via
        platform-enabled payment options where available. Check each artisan
        profile for details.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        6. What if I have an issue with a service?
      </h2>
      <p className="mb-4">
        Contact the artisan first to resolve the issue. If unresolved, reach out
        to support@abegfix.com for assistance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        7. Can I delete my account?
      </h2>
      <p className="mb-4">
        Yes. You can request account deletion via your account settings or
        contact privacy@abegfix.com for NDPR-compliant deletion.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        8. How do I leave feedback?
      </h2>
      <p className="mb-4">
        After service completion, you can leave ratings and reviews on the
        artisan’s profile.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        9. Who can I contact for support?
      </h2>
      <p className="mb-4">
        All support requests can be sent to{" "}
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
