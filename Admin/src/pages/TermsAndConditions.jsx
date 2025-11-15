import React from "react";

// --- Reusable Section Components ---

/**
 * A reusable component for a main numbered section.
 * @param {object} props
 * @param {string} props.title - The title of the section (e.g., "1. Acceptance of These Terms").
 * @param {React.ReactNode} props.children - The content of the section.
 */
const TermsSection = ({ title, children }) => (
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
 * @param {string} props.title - The title of the sub-section (e.g., "Account Creation").
 * @param {React.ReactNode} props.children - The text content of the sub-section.
 */
const SubSection = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    <p>{children}</p>
  </div>
);

/**
 * A reusable component for the list of prohibited actions.
 * @param {object} props
 * @param {React.ReactNode} props.children - The text content of the list item.
 */
const ProhibitedListItem = ({ children }) => (
  <li className="flex items-start">
    <span className="text-red-500 mr-2 mt-1 flex-shrink-0">🚫</span>
    <span>{children}</span>
  </li>
);

// --- Main Application Component ---

/**
 * The main component for the Terms & Conditions page.
 */
export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Terms & Conditions for GyanBrix
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: November 15, 2025
            </p>
          </div>

          {/* Body Content */}
          <div className="prose prose-indigo max-w-none">
            <TermsSection title="1. Acceptance of These Terms">
              <p>
                Welcome to GyanBrix ("we," "us," or "our"). These Terms &
                Conditions ("Terms") govern your use of our website and our
                "GyanBrix" mobile application (collectively, the "Service").
              </p>
              <p>
                By creating an account or using our Service, you agree to be
                bound by these Terms and our Privacy Policy. If you do not agree
                to these Terms, you must not use our Service.
              </p>
              <p>
                If you are under 18 years old, you represent that your parent or
                legal guardian has reviewed and agreed to these Terms on your
                behalf.
              </p>
            </TermsSection>

            <TermsSection title="2. User Accounts">
              <SubSection title="Account Creation:">
                You must provide accurate and complete information when creating
                your account (including your name, email, phone number, and date
                of birth).
              </SubSection>
              <SubSection title="Account Security:">
                You are solely responsible for all activity that occurs on your
                account and for keeping your password secret. You must notify us
                immediately of any breach of security or unauthorized use of
                your account.
              </SubSection>
              <SubSection title="No Account Sharing:">
                You agree not to share your account login credentials (password)
                with any other person. Your account is for your personal use
                only.
              </SubSection>
            </TermsSection>

            <TermsSection title="3. 🛡️ Intellectual Property & Your License">
              <p className="text-sm text-gray-600 italic">
                This is our most important section.
              </p>
              <SubSection title="Our Ownership:">
                All content on the Service, including all Assamese educational
                materials, videos, notes, text, graphics, quizzes, software, and
                our brand (GyanBrix logo and name), is the exclusive
                intellectual property of GyanBrix and its licensors.
              </SubSection>
              <SubSection title="Your Limited License:">
                We grant you a limited, non-exclusive, non-transferable, and
                revocable license to access and use the Service for your
                personal, non-commercial, educational study only. This license
                is only for viewing content on our platform. It does not grant
                you any ownership rights.
              </SubSection>
            </TermsSection>

            <TermsSection title="4. 🚫 Prohibited Conduct (The Rules)">
              <p>
                Your permission to use the Service is conditional on you
                following these rules. You agree NOT to do any of the following:
              </p>
              <ul className="space-y-2 mt-4 pl-0 list-none">
                <ProhibitedListItem>
                  <strong>Do not copy or steal our content.</strong> You will
                  not download, screenshot, record, copy, reproduce, distribute,
                  re-upload, re-sell, or create derivative works from any
                  content on the Service.
                </ProhibitedListItem>
                <ProhibitedListItem>
                  <strong>Do not share your account.</strong> You will not share
                  your password or let anyone else access your account.
                </ProhibitedListItem>
                <ProhibitedListItem>
                  <strong>No commercial use.</strong> You will not use the
                  Service for any commercial purpose (e.g., using our materials
                  to run your own tuition business, charging others to view our
                  content).
                </ProhibitedListItem>
                <ProhibitedListItem>
                  <strong>Do not attack the app.</strong> You will not attempt
                  to hack, reverse-engineer, decompile, or otherwise try to
                  discover the source code of our app or website.
                </ProhibitedListItem>
                <ProhibitedListItem>
                  <strong>No illegal use.</strong> You will not use the Service
                  for any purpose that is illegal or prohibited by these Terms.
                </ProhibitedListItem>
                <ProhibitedListItem>
                  <strong>No automated access.</strong> You will not use any
                  robot, spider, or other automated means to access the Service
                  or scrape our data.
                </ProhibitedListItem>
              </ul>
            </TermsSection>

            <TermsSection title="5. User Feedback & Reviews">
              <p>
                We may provide you with the ability to submit feedback or
                reviews about your experience. You understand that these reviews
                are for internal administrative use only and will not be made
                public to other users.
              </p>
              <p>
                By submitting any feedback or review, you grant GyanBrix a
                perpetual, royalty-free, worldwide license to use, modify, and
                incorporate that feedback for the purpose of improving our
                Service (e.g., in marketing materials or as testimonials),
                without any compensation to you.
              </p>
              <p>
                You agree not to submit any review that is hateful, abusive,
                defamatory, obscene, or illegal. We reserve the right to review
                and remove any such submission.
              </p>
            </TermsSection>

            <TermsSection title="6. Advertisements and Third-Party Links">
              <p>
                Our Service is supported by advertisements (e.g., from Google
                AdMob), as detailed in our Privacy Policy. The Service may also
                contain links to third-party websites or services that are not
                owned or controlled by GyanBrix.
              </p>
              <p>
                We are not responsible for the content, privacy policies, or
                practices of any third-party ads or websites.
              </p>
            </TermsSection>

            <TermsSection title="7. Termination">
              <SubSection title="Breach of Terms:">
                We reserve the right to immediately suspend or terminate your
                account and access to the Service, without prior notice, if you
                breach any of these Terms, especially the rules in Section 4
                ("Prohibited Conduct").
              </SubSection>
              <SubSection title="Our Discretion:">
                We also reserve the right to suspend or terminate your account
                at our sole discretion, at any time, to protect the integrity
                and safety of our Service.
              </SubSection>
            </TermsSection>

            <TermsSection title="8. Disclaimer of Warranties">
              <p>
                The Service is provided on an "AS-IS" and "AS AVAILABLE" basis.
                GyanBrix makes no warranties (express or implied) that the
                Service will be uninterrupted, error-free, secure, or that the
                educational content will be 100% accurate or complete. You use
                the Service at your own risk.
              </p>
            </TermsSection>

            <TermsSection title="9. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, GyanBrix (and its owners
                and employees) shall not be liable for any indirect, incidental,
                special, or consequential damages (including loss of data or
                profits) resulting from your use of, or inability to use, the
                Service.
              </p>
            </TermsSection>

            <TermsSection title="10. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of India. Any legal disputes arising from these
                Terms will be subject to the exclusive jurisdiction of the
                courts located in Rangia, Assam.
              </p>
            </TermsSection>

            <TermsSection title="11. Changes to These Terms">
              <p>
                We reserve the right to modify these Terms at any time. If we
                make material changes, we will notify you through the app or by
                email. Your continued use of the Service after such changes
                constitutes your acceptance of the new Terms.
              </p>
            </TermsSection>

            <TermsSection title="12. Contact Us">
              <p>
                If you have any questions about these Terms & Conditions, please
                contact us at:
              </p>
              <p className="font-semibold text-indigo-600">
                Email: contact@gyanbrix.in
              </p>
            </TermsSection>
          </div>
        </div>
      </main>
    </div>
  );
}
