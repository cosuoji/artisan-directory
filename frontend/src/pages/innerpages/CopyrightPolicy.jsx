import useSEO from "../../hooks/useSEO";

export default function CopyrightPolicy() {
  useSEO({ title: "Copyright & Takedown Policy" });
  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-xl mt-10 mb-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">
        Copyright & Takedown Policy
      </h1>

      <p className="mb-4">
        <strong>Abeg Fix</strong> respects the intellectual property rights of
        others and expects all users to do the same. This policy outlines our
        process for handling copyright infringement claims in accordance with
        applicable laws, including the Nigerian Copyright Act 2022 and, where
        applicable, international copyright regulations.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Reporting Copyright Infringement
      </h2>

      <p className="mb-4">
        If you believe that content on Abeg Fix infringes your copyright, please
        send a written notice including the following:
      </p>

      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>
          A clear identification of the copyrighted work claimed to be infringed
        </li>
        <li>The exact URL or location of the allegedly infringing material</li>
        <li>Your full name and contact information (email and phone number)</li>
        <li>
          A statement that you have a good faith belief that the use of the
          material is not authorized by the copyright owner, its agent, or the
          law
        </li>
        <li>
          A statement that the information provided in your notice is accurate
          and that you are the copyright owner or authorized to act on their
          behalf
        </li>
        <li>Your electronic or physical signature</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Submission of Notice</h2>

      <p className="mb-4">Copyright complaints should be sent to:</p>

      <p className="mb-4">
        <a
          href="mailto:support@abegfix.com"
          className="text-blue-600 underline"
        >
          support@abegfix.com
        </a>
      </p>

      <p className="mb-4">
        Upon receiving a valid complaint, Abeg Fix may remove or disable access
        to the allegedly infringing material while we investigate the claim.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Counter-Notification Process
      </h2>

      <p className="mb-4">
        If your content has been removed and you believe it was done in error or
        misidentification, you may submit a counter-notification containing:
      </p>

      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>
          Identification of the removed material and its previous location
        </li>
        <li>Your name and contact information</li>
        <li>
          A statement under penalty of perjury that you believe the material was
          removed as a result of mistake or misidentification
        </li>
        <li>Your electronic or physical signature</li>
      </ul>

      <p className="mb-4">
        If appropriate, the content may be restored after review.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Repeat Infringers</h2>

      <p className="mb-4">
        Abeg Fix reserves the right to suspend or terminate accounts of users
        who repeatedly infringe intellectual property rights.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Good Faith & Misuse</h2>

      <p className="mb-4">
        Any person who knowingly submits false claims of infringement may be
        subject to legal liability under applicable law.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>

      <p>
        Questions regarding this Copyright & Takedown Policy may be sent to{" "}
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
