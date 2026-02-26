export default function About() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">About Abeg Fix</h1>

      <p className="mb-4">
        <strong>Abeg Fix</strong> is a Nigerian platform connecting customers
        with skilled artisans and service providers across various trades. Our
        mission is to make it easier for users to find reliable professionals
        while helping artisans grow their business and reputation.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Our Vision</h2>
      <p className="mb-4">
        To become Nigeria's most trusted marketplace for service professionals,
        empowering artisans and creating a safe, efficient, and transparent
        ecosystem for service delivery.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Our Mission</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>
          Provide a platform where users can easily discover skilled artisans.
        </li>
        <li>Empower artisans to manage and grow their businesses online.</li>
        <li>
          Ensure safe, reliable, and transparent interactions between users and
          artisans.
        </li>
        <li>Promote trust, quality, and accountability across all services.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Our Values</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Integrity: We operate honestly and transparently.</li>
        <li>Safety: We prioritize the safety of our users and artisans.</li>
        <li>Excellence: We strive to deliver the best experience possible.</li>
        <li>
          Community: We support artisans and customers in building strong
          relationships.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
      <p>
        For inquiries, partnerships, or support, email us at{" "}
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
