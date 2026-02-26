export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
      <p className="mb-4">Effective Date: 11th November 2025</p>
      <p className="mb-4">Last Updated: 11th November 2025</p>
      <p className="mb-4">
        Welcome to <strong>Abeg Fix</strong> ("we", "our", "us"). We connect
        users with skilled artisans and service providers across Nigeria. Your
        privacy is extremely important to us. This Privacy Policy explains how
        we collect, use, and protect your information in compliance with the
        Nigeria Data Protection Regulation (NDPR).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Information We Collect
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Account Details: Name, email, phone number, address</li>
        <li>Service Activity: Searches, bookings, chat messages, reviews</li>
        <li>Device Information: IP address, browser type, device info</li>
        <li>Location Data: When you allow device location access</li>
        <li>Payment Information: When payments are enabled</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To create and manage your account</li>
        <li>To match users with artisans</li>
        <li>To improve platform safety and user experience</li>
        <li>To send alerts, updates, and security notifications</li>
        <li>To comply with Nigerian laws and NDPR requirements</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Cookies and Tracking</h2>
      <p className="mb-4">
        We use cookies to enhance user experience, remember login information,
        and analyze website traffic. You may disable cookies through your
        browser settings, but some features may stop working.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Data Sharing</h2>
      <p className="mb-4">
        We do <strong>not sell</strong> your data. We may share information only
        with trusted third-party providers for payment processing, security, or
        analytics.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Your Data Rights (NDPR)
      </h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Request access to your data</li>
        <li>Request correction or deletion</li>
        <li>Withdraw consent for data use</li>
        <li>Request data export</li>
      </ul>
      <p className="mb-4">
        Submit requests via:{" "}
        <a
          href="mailto:privacy@abegfix.com"
          className="text-blue-600 underline"
        >
          privacy@abegfix.com
        </a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Security</h2>
      <p className="mb-4">
        We use reasonable security measures to protect your information, but no
        system is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Data Retention</h2>
      <p className="mb-4">
        We keep your information as long as your account is active or as
        required by law.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
      <p className="mb-2">If you have questions, contact:</p>
      <p>
        Email:{" "}
        <a
          href="mailto:support@abegfix.com"
          className="text-blue-600 underline"
        >
          support@abegfix.com
        </a>
      </p>
      <p>Website: www.abegfix.com</p>
    </div>
  );
}
