export default function Cookies() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Cookie Policy</h1>

      <p className="mb-4">
        This Cookie Policy explains how <strong>Abeg Fix</strong> uses cookies
        and similar technologies when you visit our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">What are cookies?</h2>
      <p className="mb-4">
        Cookies are small text files stored on your device that help websites
        remember information about your visit. They improve usability and help
        us analyse site traffic.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Types of cookies we use
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <strong>Essential cookies:</strong> Required for basic site
          functionality (e.g., login sessions).
        </li>
        <li>
          <strong>Performance cookies:</strong> Help us understand how visitors
          use our site (e.g., Google Analytics).
        </li>
        <li>
          <strong>Functional cookies:</strong> Remember preferences like
          language or region.
        </li>
        <li>
          <strong>Advertising/Third-party cookies:</strong> May be used by
          external partners for targeted advertising.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">How we use cookies</h2>
      <p className="mb-4">We use cookies to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Keep you logged in during a session</li>
        <li>Remember your preferences</li>
        <li>Analyse site performance and traffic</li>
        <li>Deliver relevant marketing and advertising (where applicable)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Managing cookies</h2>
      <p className="mb-4">
        You can control or delete cookies via your browser settings. Note that
        blocking certain cookies may affect site functionality. Our Cookie
        Consent Banner lets you opt in/out of non-essential cookies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Third-party cookies</h2>
      <p className="mb-4">
        We may use third-party services such as analytics and payment providers
        that set their own cookies. We do not control third-party cookie
        practices—please check their privacy policies for more information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
      <p>
        If you have questions about our use of cookies, contact{" "}
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
