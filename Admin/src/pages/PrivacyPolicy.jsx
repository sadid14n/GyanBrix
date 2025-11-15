import React from "react";

// --- Reusable Section Components ---

/**
 * A reusable component for a main numbered section.
 * @param {object} props
 * @param {string} props.title - The title of the section (e.g., "1. Introduction").
 * @param {React.ReactNode} props.children - The content of the section.
 */
const PrivacySection = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
      {title}
    </h2>
    <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
  </section>
);

/**
 * A reusable component for a sub-section with a title.
 * @param {object} props
 * @param {string} props.title - The title of the sub-section (e.g., "Verifiable Parental Consent:").
 * @param {React.ReactNode} props.children - The text content of the sub-section.
 */
const SubSection = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    <p>{children}</p>
  </div>
);

/**
 * A reusable component for a list item with an icon.
 * @param {object} props
 * @param {React.ReactNode} props.children - The text content of the list item.
 */
const InfoListItem = ({ children }) => (
  <li className="flex items-start">
    <svg
      className="w-5 h-5 text-indigo-500 mr-2 mt-1 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    <span>{children}</span>
  </li>
);

// --- Main Application Component ---

/**
 * The main component for the Privacy Policy page.
 */
export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Privacy Policy for GyanBrix
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: November 15, 2025
            </p>
          </div>

          {/* Body Content */}
          <div className="prose prose-indigo max-w-none">
            <PrivacySection title="1. Introduction">
              <p>
                Welcome to GyanBrix ("we," "us," or "our"). We provide an
                educational platform for Assamese medium students through our
                website and our "GyanBrix" mobile application (collectively, the
                "Service").
              </p>
              <p>
                This Privacy Policy explains what information we collect, how we
                use and protect it, and your rights regarding your information.
                This policy applies to both our website and our mobile app.
              </p>
              <p>
                By creating an account or using our Service, you (and your
                parent/guardian, if you are a minor) agree to the terms of this
                Privacy Policy.
              </p>
            </PrivacySection>

            {/* Special Highlighted Section for Children's Data */}
            <PrivacySection title="2. ❗ Our Policy on Children's Data (DPDP Act)">
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md space-y-3">
                <p>
                  We are an educational platform and understand that many of our
                  users will be under 18 years old ("Children"). Our policy on
                  Children's data is strict and complies with India's Digital
                  Personal Data Protection (DPDP) Act, 2023 and DPDP Rules,
                  2025.
                </p>
                <SubSection title="Verifiable Parental Consent:">
                  We must obtain verifiable parental or guardian consent before
                  we collect any personal information from a Child. Users under
                  18 are not permitted to create an account or use the Service
                  until this consent is provided.
                </SubSection>
                <SubSection title="Advertising for Children:">
                  We strictly prohibit behavioral monitoring or targeted
                  advertising for Children. Users we identify as being under 18
                  will only receive non-personalized, contextual advertisements.
                  These ads are based on the content of the page (e.g., an ad
                  for a notebook on a "Math" page) and not on the user's
                  personal data or behavior.
                </SubSection>
              </div>
            </PrivacySection>

            <PrivacySection title="3. What Information We Collect">
              <p>
                We only collect information that is necessary to provide and
                improve our Service.
              </p>
              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                A. Personal Information You Provide:
              </h3>
              <p>
                When you create a GyanBrix account, we collect the following
                information:
              </p>
              <ul className="space-y-2 mt-2 pl-0 list-none">
                <InfoListItem>
                  <strong>Full Name:</strong> To personalize your account and
                  learning experience.
                </InfoListItem>
                <InfoListItem>
                  <strong>Email Address:</strong> To create your account, log
                  in, and send important service updates (like password resets).
                </InfoListItem>
                <InfoListItem>
                  <strong>Phone Number:</strong> For account verification (e.g.,
                  OTP) and to secure your account.
                </InfoListItem>
                <InfoListItem>
                  <strong>Date of Birth:</strong> To verify your age so we can
                  apply the correct legal protections (e.g., parental consent
                  and ad settings).
                </InfoListItem>
                <InfoListItem>
                  <strong>School Name & Class/Grade:</strong> To provide you
                  with the correct and relevant educational content.
                </InfoListItem>
                <InfoListItem>
                  <strong>Address:</strong> To help us understand your region
                  and provide relevant content or support.
                </InfoListItem>
              </ul>

              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                B. Information Collected Automatically:
              </h3>
              <p>
                We do not currently use any third-party analytics tools (like
                Google Analytics) to track your behavior.
              </p>
            </PrivacySection>

            <PrivacySection title="4. How We Use Your Information">
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-2 mt-2 pl-0 list-none">
                <InfoListItem>
                  To create, secure, and manage your account.
                </InfoListItem>
                <InfoListItem>
                  To provide and personalize our educational content based on
                  your class and school.
                </InfoListItem>
                <InfoListItem>
                  To communicate with you about your account, service updates,
                  or support requests.
                </InfoListItem>
                <InfoListItem>
                  To display advertisements to support our free service (as
                  detailed in Section 5).
                </InfoListItem>
                <InfoListItem>
                  To comply with our legal obligations in India.
                </InfoListItem>
              </ul>
            </PrivacySection>

            {/* Special Highlighted Section for Advertising */}
            <PrivacySection title="5. 📢 Advertising (Google AdMob)">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-md space-y-3">
                <p>
                  GyanBrix is a free service, which is made possible by showing
                  advertisements.
                </p>
                <SubSection title="Ad Partner:">
                  We use Google AdMob to display ads in our app and on our
                  website. Google may collect and use data to provide these ads.
                  You can review{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="text-indigo-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google's Privacy & Terms here
                  </a>{" "}
                  for more information on how they handle data.
                </SubSection>
                <SubSection title="For Users Under 18:">
                  As stated in Section 2, all users identified as Children will
                  only receive non-personalized, contextual ads.
                </SubSection>
                <SubSection title="For Users 18 and Over:">
                  Users 18 and over may see personalized ads based on their
                  interests. You can opt-out of personalized advertising at any
                  time through your phone's settings (e.g., "Limit Ad Tracking")
                  or in your Google Account settings.
                </SubSection>
              </div>
            </PrivacySection>

            <PrivacySection title="6. How We Share & Store Your Data">
              <p className="font-semibold text-gray-800">
                We do not sell your personal data. Ever.
              </p>
              <p>
                We only share your data with essential third-party service
                providers who help us run our Service. They are legally required
                to protect your data and cannot use it for their own purposes.
              </p>
              <p>These providers include:</p>
              <ul className="space-y-2 mt-2 pl-0 list-none">
                <InfoListItem>
                  <strong>Firebase (a Google service):</strong> We use Firebase
                  for our database, user authentication (login), and cloud
                  storage.
                </InfoListItem>
                <InfoListItem>
                  <strong>Vercel:</strong> We use Vercel to host our website.
                </InfoListItem>
              </ul>
              <p>
                We may also disclose your information if required by Indian law
                or a court order.
              </p>
            </PrivacySection>

            <PrivacySection title="7. Your Data Rights (DPDP Act)">
              <p>
                As a user, you have rights over your personal data under the
                DPDP Act.
              </p>
              <SubSection title="Right to Access:">
                You have the right to request a copy of the personal data we
                hold about you.
              </SubSection>
              <SubSection title="Right to Correct:">
                You can correct or update your information through your account
                profile.
              </SubSection>
              <SubSection title="Right to Withdraw Consent:">
                You can withdraw your consent for us to use your data at any
                time (though this may require you to stop using the Service).
              </SubSection>
              <SubSection title="Right to Erasure (Deletion):">
                You have the right to delete your account. To request the
                deletion of your account and all associated personal data,
                please send an email to our Grievance Officer at{" "}
                <a
                  href="mailto:contact@gyanbrix.in"
                  className="text-indigo-600 hover:underline"
                >
                  contact@gyanbrix.in
                </a>
                .
              </SubSection>
            </PrivacySection>

            <PrivacySection title="8. Data Security">
              <p>
                We use reasonable administrative and technical safeguards to
                protect your personal information. We rely on the security
                measures provided by our partners, such as Firebase, to keep
                your data safe from unauthorized access or loss.
              </p>
            </PrivacySection>

            <PrivacySection title="9. Grievance Officer">
              <p>
                If you have any questions, concerns, or complaints about this
                Privacy Policy or how we handle your data, please contact our
                Grievance Officer:
              </p>
              <p className="font-semibold text-indigo-600 text-lg">
                Email: contact@gyanbrix.in
              </p>
            </PrivacySection>

            <PrivacySection title="10. Governing Law">
              <p>
                This Privacy Policy and any disputes arising from it are
                governed by the laws of India. Any legal action will be subject
                to the exclusive jurisdiction of the courts in Rangia, Assam.
              </p>
            </PrivacySection>

            <PrivacySection title="11. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. If we make
                major changes, we will notify you through the app or by email.
                Your continued use of the Service after a change means you
                accept the new policy.
              </p>
            </PrivacySection>
          </div>
        </div>
      </main>
    </div>
  );
}
