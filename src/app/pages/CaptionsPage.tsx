import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { usePosts } from "@/contexts/PostsContext";
import { useAuth } from "@/contexts/AuthContext";
import { DatePicker } from "@/app/components/ui/date-picker";
import { format } from "date-fns";

type Platform = "Facebook" | "Instagram" | "X" | "TikTok";

interface AnalysisResult {
  captionScore: number;
  remarks: string;
  status: "Accepted" | "Rejected";
  grammar: number;
  inclusivity: number;
  tone: number;
}

export function CaptionsPage() {
  const { addPost } = usePosts();
  const { currentOffice } = useAuth();

  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    Platform[]
  >([]);
  const [postDate, setPostDate] = useState<Date | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(false);

  const platforms: Platform[] = [
    "Facebook",
    "Instagram",
    "X",
    "TikTok",
  ];

  const analyzeContent = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      let captionScore = 70;
      const length = caption.length;

      if (length > 50 && length < 300) captionScore += 10;
      if (length > 300) captionScore -= 5;
      if (length < 20) captionScore -= 10;

      if (caption.includes("#")) captionScore += 5;

      if (
        selectedPlatforms.includes("Instagram") &&
        caption.includes("#")
      ) {
        captionScore += 5;
      }

      if (selectedPlatforms.includes("X") && length < 280) {
        captionScore += 5;
      }

      if (
        selectedPlatforms.includes("Facebook") &&
        length > 100
      ) {
        captionScore += 5;
      }

      if (caption.includes("?")) captionScore += 3;
      if (caption.includes("!")) captionScore += 2;

      captionScore += Math.floor(Math.random() * 8) - 4;
      captionScore = Math.max(0, Math.min(100, captionScore));

      let status: "Accepted" | "Rejected";
      let remarks: string;

      if (captionScore >= 75) {
        status = "Accepted";
        remarks =
          "The caption passed the auditing process. It is grammatically correct and inclusive with platform guidelines.";
      } else {
        status = "Rejected";
        remarks =
          "The caption did not meet the required standard. Improve grammar, inclusivity and tone";
      }

      let grammar = 70;
      let inclusivity = 70;
      let tone = 70;

      // Grammar check
      if (!caption.includes("  ")) grammar += 5;
      if (caption[0] === caption[0]?.toUpperCase())
        grammar += 5;
      if (
        caption.endsWith(".") ||
        caption.endsWith("!") ||
        caption.endsWith("?")
      )
        grammar += 5;

      // Inclusivity check
      if (!caption.toLowerCase().includes("guys"))
        inclusivity += 5;
      if (
        caption.toLowerCase().includes("everyone") ||
        caption.toLowerCase().includes("all")
      )
        inclusivity += 5;

      // Tone check
      if (caption.includes("!")) tone += 5;
      if (caption.includes("?")) tone += 5;
      if (caption.length > 50) tone += 5;

      // Normalize
      grammar = Math.min(100, grammar);
      inclusivity = Math.min(100, inclusivity);
      tone = Math.min(100, tone);

      setAnalysisResult({
        captionScore,
        remarks,
        status,
        grammar,
        inclusivity,
        tone,
      });

      setIsAnalyzing(false);

      const today = new Date().toISOString().split("T")[0];
      const auditDateStr = postDate
        ? format(postDate, "yyyy-MM-dd")
        : today;

      addPost({
        id: `POST-${Date.now().toString().slice(-6)}`,
        platform:
          selectedPlatforms.length === 1
            ? selectedPlatforms[0]
            : selectedPlatforms,
        caption,
        score: captionScore,
        captionScore,
        grammar,
        inclusivity,
        tone,
        status,
        recommendation: remarks,
        date: today,
        office: currentOffice || "",
        submissionDate: auditDateStr,
        lastUpdated: auditDateStr,
        auditFocus: "caption",
        centralReviewStatus: "Pending Review",
        appealStatus: "Not Appealed",
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 2000);
  };

  const handleStartNew = () => {
    setCaption("");
    setSelectedPlatforms([]);
    setPostDate(undefined);
    setAnalysisResult(null);
    setShowSuccessMessage(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Caption Input */}
      <div className="bg-card rounded-lg border border-border p-6">
        <label className="block mb-4">
          <span className="text-lg font-semibold text-primary block">
            Caption Verifier
          </span>
          <span className="text-sm text-muted-foreground block mb-4">
            Write or paste your caption
          </span>
        </label>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter your caption here..."
          rows={6}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary resize-none"
        />

        <div className="text-xs text-right text-muted-foreground mt-2">
          {caption.length} characters
        </div>
      </div>

      {/* Platform */}
      <div className="bg-card rounded-lg border border-border p-6">
        <span className="text-lg font-semibold text-primary block mb-4">
          Platform
        </span>

        <div className="space-y-3">
          {platforms.map((p) => (
            <label key={p} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(p)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlatforms([
                      ...selectedPlatforms,
                      p,
                    ]);
                  } else {
                    setSelectedPlatforms(
                      selectedPlatforms.filter((i) => i !== p),
                    );
                  }
                }}
                className="h-4 w-4 appearance-none rounded border border-border bg-background
                             checked:bg-primary checked:border-primary
                             relative
                             after:content-[''] after:absolute after:hidden
                             after:left-1/2 after:top-1/2
                             after:w-[4px] after:h-[8px]
                             after:border-white after:border-r-[2.5px] after:border-b-[2.5px]
                             after:rotate-45
                             after:-translate-x-1/2 after:-translate-y-[60%]
                             checked:after:block"
              />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="bg-card rounded-lg border border-border p-6">
        <span className="text-lg font-semibold text-primary block mb-4">
          Date
        </span>

        <DatePicker
          date={postDate}
          onDateChange={setPostDate}
          placeholder="Pick a date"
        />
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button
          onClick={analyzeContent}
          disabled={
            !caption ||
            selectedPlatforms.length === 0 ||
            !postDate ||
            isAnalyzing
          }
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Analyze
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {analysisResult && (
        <div
          className={`border-2 rounded-lg p-6 ${
            analysisResult.status === "Accepted"
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {analysisResult.status === "Accepted" ? (
              <CheckCircle className="text-green-600" />
            ) : (
              <AlertCircle className="text-red-600" />
            )}
            <h3 className="font-bold">
              {analysisResult.status}
            </h3>
          </div>

          <div className="text-center text-3xl font-bold mt-4">
            {analysisResult.captionScore}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Grammar
              </p>
              <p className="font-semibold">
                {analysisResult.grammar}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Inclusivity
              </p>
              <p className="font-semibold">
                {analysisResult.inclusivity}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Tone
              </p>
              <p className="font-semibold">
                {analysisResult.tone}
              </p>
            </div>
          </div>

          <p className="mt-4">{analysisResult.remarks}</p>

          <button
            onClick={handleStartNew}
            className="mt-6 bg-accent px-4 py-2 rounded"
          >
            New Submission
          </button>
        </div>
      )}

      {showSuccessMessage && (
        <div className="bg-green-500 text-white text-center p-3 rounded">
          Submitted successfully!
        </div>
      )}
    </div>
  );
}