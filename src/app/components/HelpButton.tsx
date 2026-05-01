import { useState, memo } from "react";
import { HelpCircle, X } from "lucide-react";

interface HelpButtonProps {
  isCentral?: boolean;
  loginPageOnly?: boolean;
}

const HelpModal = memo(({ isOpen, onClose, isCentral, loginPageOnly }: { isOpen: boolean; onClose: () => void; isCentral: boolean; loginPageOnly?: boolean }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-lg p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2 w-8 h-8 flex items-center justify-center"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-primary">
          {loginPageOnly ? "Account Access Help" : "How to Use the NYC SMARTech Audit System"}
        </h2>

        <div className="space-y-6 text-sm">
          {!loginPageOnly && (
            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Overview
              </h3>
              <p className="text-muted-foreground">
                This system allows regional offices to submit
                pubmats and captions for automated auditing,
                with Central NYC providing additional review
                and handling appeals.
              </p>
            </section>
          )}

          {!loginPageOnly && !isCentral && (
            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                For Regional Offices
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">
                    1. Submit PubMats
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>Go to the "PubMats" tab</li>
                    <li>Select post type and platforms</li>
                    <li>
                      Upload your image (drag & drop or
                      browse)
                    </li>
                    <li>Choose a submission date</li>
                    <li>
                      Click "Analyze" to get automatic
                      scoring
                    </li>
                    <li>
                      Scores ≥75 are Accepted, &lt;75 are
                      Rejected
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">
                    2. Submit Captions
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>Go to the "Captions" tab</li>
                    <li>
                      Write your caption and select
                      platforms
                    </li>
                    <li>Choose a submission date</li>
                    <li>
                      Click "Analyze" for automated scoring
                      on grammar, inclusivity, and tone
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">
                    3. View Submissions
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>
                      Check "Home" tab to see all your
                      submissions
                    </li>
                    <li>
                      Use filters to sort by status,
                      platform, or date
                    </li>
                    <li>
                      Click column headers to sort
                      (ascending/descending)
                    </li>
                    <li>
                      Click pubmat images to enlarge them
                    </li>
                    <li>
                      Click "See more" to view full captions
                      or remarks
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">
                    4. Appeal Rejections
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>
                      Find rejected posts in Home Page table
                    </li>
                    <li>
                      Click the "Appeal" button in the
                      Actions column
                    </li>
                    <li>
                      Provide a reason for your appeal
                    </li>
                    <li>
                      Central NYC will review and approve or
                      reject your appeal
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">
                    5. Review Status & Rejection Reasons
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>
                      Check "Review Status" column to see
                      Central NYC's decision
                    </li>
                    <li>
                      View "Rejection Reason" column for
                      detailed feedback
                    </li>
                    <li>
                      Statuses: Pending Review, Good for
                      Posting, For Revision
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {!loginPageOnly && isCentral && (
            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                For Central NYC
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">
                    1. Review Approved Posts
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>Go to "Approved" tab</li>
                    <li>
                      See all accepted posts from regional
                      offices
                    </li>
                    <li>
                      Click ✓ to mark as "Good for Posting"
                    </li>
                    <li>
                      Click × to mark "For Revision" and add
                      comments
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">
                    2. Review Appeals
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>Go to "Appeals" tab</li>
                    <li>
                      View all pending appeals from regional
                      offices
                    </li>
                    <li>
                      Read the appeal reason from the
                      submitter
                    </li>
                    <li>
                      Click ✓ to approve (changes to Good
                      for Posting)
                    </li>
                    <li>
                      Click × to reject and add feedback
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">
                    3. Manage Account Requests
                  </p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                    <li>
                      Go to "Requests" in the menu dropdown
                    </li>
                    <li>
                      Review password reset, handoff, and
                      new account requests
                    </li>
                    <li>
                      Click "Approve" to generate
                      verification codes (expire in 15 min)
                    </li>
                    <li>
                      Send verification codes to requesters
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {loginPageOnly && (
            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Account Access
              </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium">
                  Forgot Password
                </p>
                <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                  <li>
                    Click "Account Access" on login page
                  </li>
                  <li>Submit a password reset request</li>
                  <li>Wait for Central NYC approval</li>
                  <li>
                    Use the 6-digit verification code to
                    reset
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium">
                  Account Handoff
                </p>
                <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                  <li>
                    Use when transferring account to a new
                    person
                  </li>
                  <li>
                    Submit handoff request with new assignee
                    name
                  </li>
                  <li>Central NYC reviews and approves</li>
                  <li>
                    New person receives access via
                    verification code
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium">
                  New Office Account
                </p>
                <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                  <li>
                    Request a new account for a new office
                  </li>
                  <li>
                    Provide office name, email, and assigned
                    person details
                  </li>
                  <li>
                    Central NYC will create credentials upon
                    approval
                  </li>
                </ul>
              </div>
            </div>
            </section>
          )}

          {!loginPageOnly && (
            <section>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Tips
            </h3>
            <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
              <li>
                Submit posts with the planned posting date,
                not today's date
              </li>
              <li>
                Use filters and sorting to find specific
                submissions quickly
              </li>
              <li>
                Check rejection reasons carefully before
                appealing
              </li>
              <li>
                Verification codes expire after 15 minutes
              </li>
              <li>
                All tables support sorting by clicking
                column headers
              </li>
              <li>
                Click "See more" buttons to view full text
                content
              </li>
            </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

HelpModal.displayName = 'HelpModal';

export function HelpButton({
  isCentral = false,
  loginPageOnly = false,
}: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all z-40"
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      <HelpModal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentral={isCentral} loginPageOnly={loginPageOnly} />
    </>
  );
}