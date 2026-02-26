import { EmailCampaignDetail } from "@/components/email-campaigns/EmailCampaignDetail";

interface EmailCampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmailCampaignDetailPage({ params }: EmailCampaignDetailPageProps) {
  const { id } = await params;
  return <EmailCampaignDetail campaignId={id} />;
}
