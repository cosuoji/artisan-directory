export default function DataPolicy() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">
        Data Deletion & NDPR Rights
      </h1>

      <p className="mb-4">
        <strong>Abeg Fix</strong> respects your rights under the Nigeria Data
        Protection Regulation (NDPR). This page explains how you can manage,
        request, and delete your personal data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Your Data Rights</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Access your personal data collected by Abeg Fix</li>
        <li>Request corrections to inaccurate or incomplete data</li>
        <li>Request deletion of your personal data</li>
        <li>Withdraw consent for data processing</li>
        <li>Request a copy of your data in a portable format</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        How to Request Data Actions
      </h2>
      <p className="mb-4">
        Submit your requests via email to{" "}
        <a
          href="mailto:privacy@abegfix.com"
          className="text-blue-600 underline"
        >
          privacy@abegfix.com
        </a>
        . Include:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Your full name and registered email</li>
        <li>
          Type of request (access, correction, deletion, export, or consent
          withdrawal)
        </li>
        <li>
          Any relevant account or transaction details to help locate your data
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Response Time</h2>
      <p className="mb-4">
        We will respond to all requests within 7–14 business days.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Data Retention</h2>
      <p className="mb-4">
        We retain personal data only as long as necessary to provide our
        services or to comply with legal obligations. Deleted data will be
        removed from our active systems within 30 days of the approved request.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
      <p>
        Questions regarding your data rights or NDPR compliance can be sent to{" "}
        <a
          href="mailto:privacy@abegfix.com"
          className="text-blue-600 underline"
        >
          privacy@abegfix.com
        </a>
        .
      </p>
    </div>
  );
}
