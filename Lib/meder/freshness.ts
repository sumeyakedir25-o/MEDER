export type FreshnessStatus =
  | "recent"
  | "needs_verification"
  | "outdated";

export type FreshnessInfo = {
  status: FreshnessStatus;
  label: string;
  description: string;
  daysSinceVerification: number | null;
};

const RECENT_DAYS = 30;
const NEEDS_VERIFICATION_DAYS = 90;

export function getFreshnessStatus(
  lastVerifiedAt?: string | null,
): FreshnessInfo {
  if (!lastVerifiedAt) {
    return {
      status: "needs_verification",
      label: "Needs verification",
      description: "This place has not been verified recently.",
      daysSinceVerification: null,
    };
  }

  const verifiedDate = new Date(lastVerifiedAt);

  if (Number.isNaN(verifiedDate.getTime())) {
    return {
      status: "needs_verification",
      label: "Needs verification",
      description: "This place has not been verified recently.",
      daysSinceVerification: null,
    };
  }

  const now = new Date();

  const differenceInMilliseconds =
    now.getTime() - verifiedDate.getTime();

  const daysSinceVerification = Math.max(
    0,
    Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24),
    ),
  );

  if (daysSinceVerification <= RECENT_DAYS) {
    return {
      status: "recent",
      label: "Recently verified",
      description: "This place was verified recently.",
      daysSinceVerification,
    };
  }

  if (daysSinceVerification <= NEEDS_VERIFICATION_DAYS) {
    return {
      status: "needs_verification",
      label: "Needs verification",
      description: "This place may need its information checked.",
      daysSinceVerification,
    };
  }

  return {
    status: "outdated",
    label: "Outdated information",
    description: "This place has not been verified recently.",
    daysSinceVerification,
  };
}