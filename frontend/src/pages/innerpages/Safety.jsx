export default function Safety() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">User Safety Tips</h1>

      <p className="mb-4">
        At <strong>Abeg Fix</strong>, your safety is our priority. Please follow
        these tips to ensure a secure and reliable experience on the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Before Hiring an Artisan
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Verify the artisan's identity and qualifications.</li>
        <li>Check reviews and ratings from previous customers.</li>
        <li>Confirm the agreed price and job scope in writing or via chat.</li>
        <li>
          Avoid paying the full amount upfront; use milestone payments if
          possible.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">During Service</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Meet in a safe location if possible.</li>
        <li>Do not share unnecessary personal information.</li>
        <li>Keep communication on the platform to document agreements.</li>
        <li>Supervise the work and ensure safety protocols are followed.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">After Service</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide honest feedback and ratings.</li>
        <li>Report suspicious or unsafe behavior to support@abegfix.com.</li>
        <li>Keep records of payments, receipts, and communications.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">General Safety Tips</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Trust your instincts and avoid risky situations.</li>
        <li>Use secure payment methods whenever possible.</li>
        <li>Keep your devices updated with security patches.</li>
        <li>
          Be cautious of unsolicited messages or offers outside the platform.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
      <p>
        For assistance or to report safety issues, contact us at{" "}
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
