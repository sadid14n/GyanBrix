import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        ⚠️ CRITICAL LEGAL WARNING - PLEASE READ FIRST
      </h1>

      <p className="mb-6">
        You answered <strong>("a) I don't have a system for this yet")</strong>{" "}
        for parental consent. Under the new <strong>DPDP Act, 2025</strong>, you
        are legally required to obtain
        <strong> Verifiable Parental Consent</strong> before collecting any data
        from users under 18. This Privacy Policy assumes you WILL build this
        system.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">
        Privacy Policy for GyanBrix
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Last Updated: November 15, 2025
      </p>

      <h3 className="text-lg font-semibold mt-4">1. Introduction</h3>
      <p>
        Welcome to GyanBrix ("we," "us," or "our"). We provide an educational
        platform for Assamese medium students through our website and mobile
        application.
      </p>
      <p>
        This Privacy Policy explains what information we collect, how we use it,
        protect it, and your rights. By using our service, you (and your
        parent/guardian if you are a minor) agree to this policy.
      </p>

      <h3 className="text-lg font-semibold mt-4">
        2. ❗ Our Policy on Children's Data (DPDP Act)
      </h3>
      <p>
        We comply with the Digital Personal Data Protection (DPDP) Act for users
        under 18.
      </p>
      <ul className="list-disc ml-6">
        <li>
          <strong>Verifiable Parental Consent</strong> is required before
          collecting any data from a child.
        </li>
        <li>
          <strong>No targeted ads</strong> for children. They only receive
          contextual, non-personalized ads.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4">
        3. What Information We Collect
      </h3>
      <h4 className="font-medium">A. Personal Information You Provide</h4>
      <ul className="list-disc ml-6">
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Date of Birth</li>
        <li>School Name & Class</li>
        <li>Address</li>
      </ul>

      <h4 className="font-medium mt-3">
        B. Information Collected Automatically
      </h4>
      <p>
        No third-party analytics (like Google Analytics) are currently used.
      </p>

      <h3 className="text-lg font-semibold mt-4">
        4. How We Use Your Information
      </h3>
      <ul className="list-disc ml-6">
        <li>To manage and secure your account.</li>
        <li>Personalize educational content.</li>
        <li>Send updates and support messages.</li>
        <li>Display ads as per Section 5.</li>
        <li>Comply with legal requirements.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4">
        5. 📢 Advertising (Google AdMob)
      </h3>
      <p>
        We use Google AdMob to show ads. Users under 18 see only
        non-personalized ads. Users 18+ may see personalized ads.
      </p>

      <h3 className="text-lg font-semibold mt-4">
        6. How We Share & Store Your Data
      </h3>
      <p>
        <strong>We never sell your data.</strong> We only share it with
        essential service providers:
      </p>
      <ul className="list-disc ml-6">
        <li>Firebase (database, authentication, storage)</li>
        <li>Vercel (website hosting)</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4">
        7. Your Data Rights (DPDP Act)
      </h3>
      <ul className="list-disc ml-6">
        <li>Right to Access</li>
        <li>Right to Correct</li>
        <li>Right to Withdraw Consent</li>
        <li>
          Right to Erasure — email:{" "}
          <a href="mailto:contact@gyanbrix.in">contact@gyanbrix.in</a>
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4">8. Data Security</h3>
      <p>
        We use reasonable security measures and rely on Firebase protections.
      </p>

      <h3 className="text-lg font-semibold mt-4">9. Grievance Officer</h3>
      <p>
        Email: <strong>contact@gyanbrix.in</strong>
      </p>

      <h3 className="text-lg font-semibold mt-4">10. Governing Law</h3>
      <p>
        Governed by the laws of India. Jurisdiction:{" "}
        <strong>Rangia, Assam</strong>.
      </p>

      <h3 className="text-lg font-semibold mt-4">11. Changes to This Policy</h3>
      <p>
        We may update this policy. Continued use of our service means you accept
        the latest version.
      </p>

      <p className="mt-6 text-sm text-gray-600">
        This is your complete Privacy Policy. Need Terms & Conditions? I can
        draft it for you.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
